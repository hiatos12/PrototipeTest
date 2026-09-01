extends Node2D

const PORT: int = 25565
const SERVER_IP: String = "127.0.0.1"

const PLAYER_SCENE: PackedScene = preload("res://player.tscn")

const SPAWN_POSITIONS: Array[Vector2] = [
	Vector2(200, 400),
	Vector2(400, 400),
	Vector2(600, 400),
	Vector2(800, 400),
	Vector2(1000, 400)
]

@onready var players: Node = $Multiplayer


func _ready() -> void:
	$Control/Panel/UI/VBoxContainer/CreateButton.pressed.connect(_create_host)
	$Control/Panel/UI/VBoxContainer/JoinButton.pressed.connect(_join_host)


# ============================================================
# HOST
# ============================================================

func _create_host() -> void:
	var peer := ENetMultiplayerPeer.new()

	var error := peer.create_server(PORT, 5)

	if error != OK:
		print("Ошибка сервера: ", error)
		return

	multiplayer.multiplayer_peer = peer

	multiplayer.peer_connected.connect(_on_player_connected)
	multiplayer.peer_disconnected.connect(_on_player_disconnected)

	print("================================")
	print("СЕРВЕР ЗАПУЩЕН")
	print("МОЙ ID: ", multiplayer.get_unique_id())
	print("================================")

	# Создаём игрока хоста
	_create_player(
		multiplayer.get_unique_id(),
		get_spawn_position(multiplayer.get_unique_id())
	)

	# Убираем меню
	$Control.queue_free()


# ============================================================
# JOIN
# ============================================================

func _join_host() -> void:
	var peer := ENetMultiplayerPeer.new()

	var error := peer.create_client(SERVER_IP, PORT)

	if error != OK:
		print("Ошибка клиента: ", error)
		return

	multiplayer.multiplayer_peer = peer

	multiplayer.connected_to_server.connect(_on_connected_to_server)
	multiplayer.connection_failed.connect(_on_connection_failed)

	print("Подключение...")


func _on_connected_to_server() -> void:
	var my_id := multiplayer.get_unique_id()

	print("================================")
	print("ПОДКЛЮЧИЛСЯ")
	print("МОЙ ID: ", my_id)
	print("================================")

	# Просим сервер прислать игроков
	request_players.rpc_id(1)

	$Control.queue_free()


func _on_connection_failed() -> void:
	print("ОШИБКА ПОДКЛЮЧЕНИЯ")


# ============================================================
# PLAYER CONNECTED
# ============================================================

func _on_player_connected(id: int) -> void:
	print("Новый игрок подключился. ID: ", id)

	if not multiplayer.is_server():
		return

	# Создаём нового игрока на сервере
	var spawn_position := get_spawn_position(id)

	_create_player(id, spawn_position)

	# Рассылаем всем информацию о новом игроке
	spawn_player.rpc(id, spawn_position)


# ============================================================
# PLAYER DISCONNECTED
# ============================================================

func _on_player_disconnected(id: int) -> void:
	print("Игрок отключился. ID: ", id)

	var player := players.get_node_or_null(str(id))

	if player:
		player.queue_free()

	remove_player.rpc(id)


# ============================================================
# CREATE LOCAL PLAYER
# ============================================================

func _create_player(
	id: int,
	spawn_position: Vector2
) -> void:

	if players.has_node(str(id)):
		return

	var player := PLAYER_SCENE.instantiate()

	player.name = str(id)

	# ВОТ ЭТО ОЧЕНЬ ВАЖНО
	player.set_multiplayer_authority(id)

	player.position = spawn_position

	players.add_child(player, true)

	print(
		"Создан Player ",
		id,
		" | authority = ",
		player.get_multiplayer_authority()
	)


# ============================================================
# SPAWN NEW PLAYER
# ============================================================

@rpc("authority", "call_remote", "reliable")
func spawn_player(
	id: int,
	spawn_position: Vector2
) -> void:

	_create_player(id, spawn_position)


# ============================================================
# REQUEST ALL PLAYERS
# ============================================================

@rpc("any_peer", "call_remote", "reliable")
func request_players() -> void:

	if not multiplayer.is_server():
		return

	var requester := multiplayer.get_remote_sender_id()

	var ids: Array[int] = []
	var positions: Array[Vector2] = []

	for player in players.get_children():

		ids.append(int(player.name))
		positions.append(player.global_position)

	send_players.rpc_id(
		requester,
		ids,
		positions
	)


# ============================================================
# RECEIVE ALL PLAYERS
# ============================================================

@rpc("authority", "call_remote", "reliable")
func send_players(
	ids: Array[int],
	positions: Array[Vector2]
) -> void:

	for i in range(ids.size()):

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

	var player := players.get_node_or_null(str(id))

	if player:
		player.queue_free()


# ============================================================
# SPAWN POSITION
# ============================================================

func get_spawn_position(id: int) -> Vector2:

	var index := (id - 1) % SPAWN_POSITIONS.size()

	return SPAWN_POSITIONS[index]
