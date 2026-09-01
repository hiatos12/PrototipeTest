extends CharacterBody2D

@export_category("Movement")
@export var speed: float = 300.0
@export var acceleration: float = 1800.0
@export var friction: float = 2200.0

@export_category("Jump")
@export var jump_velocity: float = -550.0
@export var gravity: float = 1400.0

@onready var animated_sprite: AnimatedSprite2D = $AnimatedSprite2D


func _physics_process(delta: float) -> void:
	# Управляет только владелeц персонажа
	if not is_multiplayer_authority():
		return

	# ГРАВИТАЦИЯ
	if not is_on_floor():
		velocity.y += gravity * delta

	# УПРАВЛЕНИЕ
	var direction := 0.0
	if Input.is_key_pressed(KEY_A):
		direction -= 1.0
	if Input.is_key_pressed(KEY_D):
		direction += 1.0

	# ДВИЖЕНИЕ
	if direction != 0.0:
		velocity.x = move_toward(velocity.x, direction * speed, acceleration * delta)
		animated_sprite.flip_h = direction < 0.0
	else:
		velocity.x = move_toward(velocity.x, 0.0, friction * delta)

	# ПРЫЖОК
	if Input.is_key_pressed(KEY_SPACE) and is_on_floor():
		velocity.y = jump_velocity

	move_and_slide()
	update_animation()

	# СИНХРОНИЗАЦИЯ С ДРУГИМИ КЛИЕНТАМИ
	sync_player.rpc(global_position, velocity, animated_sprite.flip_h, get_animation_name())


@rpc("any_peer", "unreliable")
func sync_player(
	new_position: Vector2,
	new_velocity: Vector2,
	flip_h: bool,
	animation_name: String
) -> void:
	# Владелец игнорирует входящий RPC о самом себе
	if is_multiplayer_authority():
		return

	global_position = new_position
	velocity = new_velocity
	animated_sprite.flip_h = flip_h

	if animated_sprite.sprite_frames.has_animation(animation_name):
		animated_sprite.play(animation_name)


func update_animation() -> void:
	if not is_on_floor():
		if velocity.y < 0.0:
			animated_sprite.play("Jump")
		else:
			animated_sprite.play("Fall")
	elif abs(velocity.x) > 20.0:
		animated_sprite.play("Walk")
	else:
		animated_sprite.play("Idle")


func get_animation_name() -> String:
	if not is_on_floor():
		return "Jump" if velocity.y < 0.0 else "Fall"
	return "Walk" if abs(velocity.x) > 20.0 else "Idle"
