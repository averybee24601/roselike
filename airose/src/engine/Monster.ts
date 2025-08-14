import { Mesh, Observable, Scene, Vector3 } from 'babylonjs'
import { createChoropyBillboard, createJellyBillboard } from '../visual/MobBillboards'
import { useGameState } from '../systems/state'

export type MonsterKind = 'choropy' | 'jellybean'

export type MonsterOptions = {
  scene: Scene
  kind: MonsterKind
  position: Vector3
}

export class Monster {
  public readonly mesh: Mesh
  public readonly onDefeated: Observable<Monster>
  public maxHealth: number
  public health: number
  public readonly kind: MonsterKind

  private readonly scene: Scene
  private readonly homePosition: Vector3
  private readonly roamRadius: number
  private readonly moveSpeed: number
  private targetPoint: Vector3 | null
  private contactDamageCooldownMs: number
  private lastContactHitMs: number

  constructor(options: MonsterOptions) {
    const { scene, kind, position } = options
    this.scene = scene
    this.kind = kind
    this.homePosition = position.clone()
    this.roamRadius = 6
    this.moveSpeed = 1.6
    this.onDefeated = new Observable<Monster>()
    this.contactDamageCooldownMs = 600
    this.lastContactHitMs = 0
    this.targetPoint = null

    // Stylized readable models
    this.mesh = kind === 'choropy' ? createChoropyBillboard(scene, position) : createJellyBillboard(scene, position)

    this.maxHealth = 20
    this.health = this.maxHealth

    scene.onBeforeRenderObservable.add(() => this.update(scene.getEngine().getDeltaTime() / 1000))
  }

  public applyDamage(amount: number): void {
    this.health = Math.max(0, Math.min(this.maxHealth, this.health - Math.abs(amount)))
    if (this.health === 0) {
      this.onDefeated.notifyObservers(this)
      // Reward and respawn
      const gs = useGameState.getState()
      gs.addExp(8)
      gs.addQuestProgress(1)
      gs.earnGold(2)
      // simple respawn timer
      const where = this.homePosition.clone()
      setTimeout(() => {
        this.health = this.maxHealth
        this.mesh.position.copyFrom(where)
      }, 2500)
    }
  }

  private update(deltaSeconds: number): void {
    if (!this.targetPoint || this.mesh.position.subtract(this.targetPoint).length() < 0.25) {
      // Pick a new target within roam radius
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * this.roamRadius
      this.targetPoint = this.homePosition.add(new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }

    const direction = this.targetPoint.subtract(this.mesh.position)
    direction.y = 0
    const dist = direction.length()
    if (dist > 0.0001) {
      direction.normalize()
      const step = Math.min(dist, this.moveSpeed * deltaSeconds)
      this.mesh.position.addInPlace(direction.scale(step))
      this.mesh.position.y = 0.55
    }

    // Basic contact damage to player if close
    const meta: any = this.scene.metadata || {}
    const player = meta.player as { mesh: Mesh; applyDamage: (amount: number) => void } | undefined
    if (player) {
      const now = performance.now()
      const distSq = Vector3.DistanceSquared(player.mesh.position, this.mesh.position)
      if (distSq < 1.1 * 1.1 && now - this.lastContactHitMs > this.contactDamageCooldownMs) {
        player.applyDamage(5)
        this.lastContactHitMs = now
      }
    }
  }
}


