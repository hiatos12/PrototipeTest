extends Node2D


const PORT: int = 25565
const SERVER_IP: String = "127.0.0.1"
const MAX_PLAYERS: int = 5

const PLAYER_SCENE: PackedScene = preload("res://player.tscn")


# Точки спавна.
# ID 1 → первая
# ID 2 → вторая
# ID 3 → третья
# ID 4 → четвёртая
# ID 5 → пятая
const SPAWN_POSITIONS: Array[Vector2] = [
	Vector2(200, 500),
	Vector2(400, 500),
	Vector2(600, 500),
	Vector2(800, 500),
	Vector2(1000, 500)
]


@onready var players: Node2D = $Multiplayer


func _ready() -> void:

	$Control/Panel/UI/VBoxContainer/CreateButton.pressed.connect(
		_create_host
	)

	$Control/Panel/UI/VBoxContainer/JoinButton.pressed.connect(
		_join_host
	)


# ============================================================
# HOST
# ============================================================

func _create_host() -> void:

	var peer := ENetMultiplayerPeer.new()

	var error := peer.create_server(
		PORT,
		MAX_PLAYERS - 1
	)

	if error != OK:
		print("ОШИБКА СОЗДАНИЯ СЕРВЕРА: ", error)
		return


	multiplayer.multiplayer_peer = peer


	# Сигналы сервера
	if not multiplayer.peer_connected.is_connected(_on_player_connected):
		multiplayer.peer_connected.connect(
			_on_player_connected
		)

	if not multiplayer.peer_disconnected.is_connected(_on_player_disconnected):
		multiplayer.peer_disconnected.connect(
			_on_player_disconnected
		)


	print("")
	print("================================")
	print("       СЕРВЕР ЗАПУЩЕН")
	print("================================")
	print("Мой ID: ", multiplayer.get_unique_id())
	print("================================")
	print("")


	# Сервер всегда ID 1.
	_create_player(
		1,
		get_spawn_position(1)
	)


	# Убираем меню полностью.
	if is_instance_valid($Control):
		$Control.queue_free()


# ============================================================
# JOIN
# ============================================================

func _join_host() -> void:

	var peer := ENetMultiplayerPeer.new()

	var error := peer.create_client(
		SERVER_IP,
		PORT
	)

	if error != OK:
		print("ОШИБКА СОЗДАНИЯ КЛИЕНТА: ", error)
		return


	multiplayer.multiplayer_peer = peer


	if not multiplayer.connected_to_server.is_connected(
		_on_connected_to_server
	):
		multiplayer.connected_to_server.connect(
			_on_connected_to_server
	)


	if not multiplayer.connection_failed.is_connected(
		_on_connection_failed
	):
		multiplayer.connection_failed.connect(
			_on_connection_failed
	)


	print("")
	print("================================")
	print("     ПОДКЛЮЧЕНИЕ К СЕРВЕРУ")
	print("================================")
	print("")


# ============================================================
# CONNECTED
# ============================================================

func _on_connected_to_server() -> void:

	var my_id := multiplayer.get_unique_id()


	print("")
	print("================================")
	print("      ПОДКЛЮЧЕНИЕ УСПЕШНО")
	print("================================")
	print("МОЙ ID: ", my_id)
	print("================================")
	print("")


	# Просим сервер отправить всех игроков.
	request_players.rpc_id(1)


	# Убираем меню.
	if is_instance_valid($Control):
		$Control.queue_free()


# ============================================================
# CONNECTION FAILED
# ============================================================

func _on_connection_failed() -> void:

	print("")
	print("================================")
	print("      ОШИБКА ПОДКЛЮЧЕНИЯ")
	print("================================")
	print("")


# ============================================================
# NEW PLAYER CONNECTED
# ============================================================

func _on_player_connected(id: int) -> void:

	print(
		"Подключился новый игрок. ID = ",
		id
	)


	if not multiplayer.is_server():
		return


	# Определяем место по ID.
	var spawn_position := get_spawn_position(id)


	# Создаём игрока на сервере.
	_create_player(
		id,
		spawn_position
	)


	# Сообщаем остальным компьютерам.
	spawn_player.rpc(
		id,
		spawn_position
	)


# ============================================================
# PLAYER DISCONNECTED
# ============================================================

func _on_player_disconnected(id: int) -> void:

	print(
		"Игрок отключился. ID = ",
		id
	)


	# Удаляем его локально.
	var player_root := players.get_node_or_null(
		str(id)
	)

	if player_root:
		player_root.queue_free()


	# Удаляем у остальных.
	remove_player.rpc(id)


# ============================================================
# CREATE PLAYER
# ============================================================

func _create_player(
	id: int,
	spawn_position: Vector2
) -> void:

	# Уже существует.
	if players.has_node(str(id)):
		return


	# Создаём сцену.
	var player_root := PLAYER_SCENE.instantiate()


	# Имя корневого Node2D = ID.
	player_root.name = str(id)


	# Добавляем в Multiplayer.
	players.add_child(
		player_root,
		true
	)


	# ========================================================
	# ВАЖНО!
	# Player.gd находится на CharacterBody2D,
	# а не на Node2D.
	# ========================================================

	var player_body := player_root.get_node(
		"CharacterBody2D"
	) as CharacterBody2D


	if player_body == null:

		push_error(
			"Не найден CharacterBody2D внутри player.tscn!"
		)

		player_root.queue_free()

		return


	# ========================================================
	# AUTHORITY
	# ========================================================

	player_body.set_multiplayer_authority(
		id,
		true
	)


	# Позиция именно CharacterBody2D.
	player_body.global_position = spawn_position


	print(
		"Создан игрок | ID = ",
		id,
		" | Authority = ",
		player_body.get_multiplayer_authority(),
		" | Local ID = ",
		multiplayer.get_unique_id()
	)


# ============================================================
# SPAWN PLAYER RPC
# ============================================================

@rpc("authority", "call_remote", "reliable")
func spawn_player(
	id: int,
	spawn_position: Vector2
) -> void:

	_create_player(
		id,
		spawn_position
	)


# ============================================================
# REQUEST EXISTING PLAYERS
# ============================================================

@rpc("any_peer", "call_remote", "reliable")
func request_players() -> void:

	if not multiplayer.is_server():
		return


	# Кто попросил список?
	var requester_id := multiplayer.get_remote_sender_id()


	var ids: Array[int] = []
	var positions: Array[Vector2] = []


	for player_root in players.get_children():

		var player_body := player_root.get_node(
			"CharacterBody2D"
		) as CharacterBody2D


		if player_body == null:
			continue


		ids.append(
			int(player_root.name)
		)

		positions.append(
			player_body.global_position
		)


	# Отправляем ТОЛЬКО запросившему клиенту.
	send_players.rpc_id(
		requester_id,
		ids,
		positions
	)


# ============================================================
# RECEIVE EXISTING PLAYERS
# ============================================================

@rpc("authority", "call_remote", "reliable")
func send_players(
	ids: Array[int],
	positions: Array[Vector2]
) -> void:

	print(
		"Получен список игроков: ",
		ids
	)


	for i in range(ids.size()):

		if i >= positions.size():
			break


		var id := ids[i]


		if players.has_node(str(id)):
			continue


		_create_player(
			id,
			positions[i]
		)


# ============================================================
# REMOVE PLAYER
# ============================================================

@rpc("authority", "call_remote", "reliable")
func remove_player(id: int) -> void:

	var player_root := players.get_node_or_null(
		str(id)
	)


	if player_root:
		player_root.queue_free()


	print(
		"Удалён игрок ID = ",
		id
	)


# ============================================================
# SPAWN POSITION
# ============================================================

func get_spawn_position(id: int) -> Vector2:

	var index := (id - 1) % SPAWN_POSITIONS.size()

	return SPAWN_POSITIONS[index]
