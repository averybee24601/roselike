import { KeyboardEventTypes, Mesh, Observable, Scene, Vector3 } from 'babylonjs'
import { spawnDamageText } from '../ui/CombatText'
import { createPlayerBillboard } from '../visual/PlayerBillboard'

type PlayerControllerOptions = {
  scene: Scene
}

export class PlayerController {
  public readonly mesh: Mesh
  public readonly onHealthChanged: Observable<number>
  public maxHealth: number
  public health: number

  private readonly scene: Scene
  private readonly pressedKeys: Set<string>
  private moveSpeedMetersPerSecond: number
  private lastAttackTimestampMs: number

  constructor(options: PlayerControllerOptions) {
    const { scene } = options
    this.scene = scene
    this.pressedKeys = new Set<string>()
    this.moveSpeedMetersPerSecond = 4.25
    this.onHealthChanged = new Observable<number>()
    this.lastAttackTimestampMs = 0

    // Body billboard
    const body = createPlayerBillboard(scene, new Vector3(0, 0.9, 0))
    this.mesh = body

    // Stats
    this.maxHealth = 100
    this.health = this.maxHealth

    // Input handling
    scene.onKeyboardObservable.add((kbInfo) => {
      const key = kbInfo.event.key.toLowerCase()
      if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
        this.pressedKeys.add(key)
        if (key === ' ') this.tryAttack()
      } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
        this.pressedKeys.delete(key)
      }
    })

    // Per-frame update
    scene.onBeforeRenderObservable.add(() => {
      const dt = scene.getEngine().getDeltaTime() / 1000
      this.update(dt)
    })
  }

  public applyDamage(amount: number): void {
    this.health = Math.max(0, Math.min(this.maxHealth, this.health - Math.abs(amount)))
    this.onHealthChanged.notifyObservers(this.health)
  }

  private update(deltaSeconds: number): void {
    let speed = this.moveSpeedMetersPerSecond
    if (this.pressedKeys.has('shift')) speed *= 1.6

    // World-axis movement for first pass (W: +Z, S: -Z, A: -X, D: +X)
    const moveDirection = new Vector3(0, 0, 0)
    if (this.pressedKeys.has('w')) moveDirection.z += 1
    if (this.pressedKeys.has('s')) moveDirection.z -= 1
    if (this.pressedKeys.has('a')) moveDirection.x -= 1
    if (this.pressedKeys.has('d')) moveDirection.x += 1

    if (moveDirection.lengthSquared() > 0) {
      moveDirection.normalize()
      const displacement = moveDirection.scale(speed * deltaSeconds)
      this.mesh.position.addInPlace(displacement)
    }

    // Keep grounded on Y
    if (this.mesh.position.y !== 0.8) this.mesh.position.y = 0.8
  }

  private tryAttack(): void {
    const nowMs = performance.now()
    // simple cooldown ~350ms
    if (nowMs - this.lastAttackTimestampMs < 350) return
    this.lastAttackTimestampMs = nowMs

    const gameMonsters: Array<{ mesh: Mesh; applyDamage: (amount: number) => void }> | undefined =
      (this.scene.metadata && (this.scene.metadata as any).monsters) || undefined
    if (!gameMonsters || gameMonsters.length === 0) return

    // find nearest within 2.5m
    let closest: { mesh: Mesh; applyDamage: (amount: number) => void } | null = null
    let closestDist = Number.POSITIVE_INFINITY
    for (const m of gameMonsters) {
      const d = Vector3.DistanceSquared(m.mesh.position, this.mesh.position)
      if (d < closestDist) {
        closestDist = d
        closest = m
      }
    }
    if (!closest) return
    const range = 2.5
    if (closestDist <= range * range) {
      closest.applyDamage(10)
      spawnDamageText(this.scene, closest.mesh.position.add(new Vector3(0, 1, 0)), '10')
    }
  }
}


