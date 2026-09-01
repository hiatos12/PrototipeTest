extends Node

var socket := WebSocketPeer.new()

var server_url := "ws://127.0.0.1:8080"

var connected := false
var player_id := ""

var room_code := ""
var player_name := ""

var last_socket_state := -1


signal room_created(code)
signal room_joined(code)
signal player_joined(id, name, position)
signal player_left(id)
signal player_moved(id, position)
signal server_error(message)


func connect_to_server() -> void:
	var error := socket.connect_to_url(server_url)

	if error != OK:
		print("Connection error: ", error)
		return

	print("Connecting...")


func _process(_delta: float) -> void:
	socket.poll()

	var state := socket.get_ready_state()

	# Выводим состояние ТОЛЬКО когда оно изменилось
	if state != last_socket_state:
		last_socket_state = state

		match state:
			WebSocketPeer.STATE_CONNECTING:
				print("WebSocket: CONNECTING")

			WebSocketPeer.STATE_OPEN:
				print("WebSocket: CONNECTED")
				connected = true

			WebSocketPeer.STATE_CLOSING:
				print("WebSocket: CLOSING")

			WebSocketPeer.STATE_CLOSED:
				print(
					"WebSocket: CLOSED | code = ",
					socket.get_close_code(),
					" | reason = ",
					socket.get_close_reason()
				)

				connected = false

	# Получаем сообщения от сервера
	if state == WebSocketPeer.STATE_OPEN:

		while socket.get_available_packet_count() > 0:
			var packet := socket.get_packet()
			var text := packet.get_string_from_utf8()

			print("SERVER -> ", text)

			handle_message(text)


func send_message(data: Dictionary) -> void:
	if socket.get_ready_state() != WebSocketPeer.STATE_OPEN:
		print("Can't send message: WebSocket is not connected")
		return

	socket.send_text(JSON.stringify(data))


func create_room(name: String) -> void:
	player_name = name

	send_message({
		"type": "create_room",
		"name": name
	})


func join_room(code: String, name: String) -> void:
	player_name = name

	send_message({
		"type": "join_room",
		"room": code.to_upper(),
		"name": name
	})


func send_position(position: Vector2) -> void:
	send_message({
		"type": "move",
		"x": position.x,
		"y": position.y
	})


func handle_message(text: String) -> void:
	var data = JSON.parse_string(text)

	if data == null:
		print("Invalid server message: ", text)
		return

	if not data is Dictionary:
		return

	match data.get("type", ""):

		"connected":
			print("Server accepted connection")


		"room_created":
			room_code = str(data.get("room", ""))
			player_id = str(data.get("id", ""))

			print("Created room: ", room_code)

			room_created.emit(room_code)


		"room_joined":
			room_code = str(data.get("room", ""))
			player_id = str(data.get("id", ""))

			print("Joined room: ", room_code)

			room_joined.emit(room_code)


		"player_joined":
			var id := str(data.get("id", ""))
			var name := str(data.get("name", ""))

			var position := Vector2(
				float(data.get("x", 0)),
				float(data.get("y", 0))
			)

			print(
				"Player joined: ",
				name,
				" [",
				id,
				"]"
			)

			player_joined.emit(
				id,
				name,
				position
			)


		"player_left":
			var id := str(data.get("id", ""))

			print("Player left: ", id)

			player_left.emit(id)


		"player_move":
			var id := str(data.get("id", ""))

			var position := Vector2(
				float(data.get("x", 0)),
				float(data.get("y", 0))
			)

			player_moved.emit(
				id,
				position
			)


		"error":
			var message := str(
				data.get(
					"message",
					"Unknown server error"
				)
			)

			print("Server error: ", message)

			server_error.emit(message)
