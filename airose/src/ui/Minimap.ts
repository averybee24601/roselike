import { Scene, Vector3 } from 'babylonjs'

export class MinimapRenderer {
  private readonly ctx: CanvasRenderingContext2D | null
  private readonly label: HTMLElement | null
  private readonly scene: Scene
  private readonly scale: number

  constructor(scene: Scene) {
    this.scene = scene
    this.scale = 3.5 // pixels per meter
    const canvas = document.getElementById('minimap') as HTMLCanvasElement
    this.ctx = canvas?.getContext('2d') || null
    this.label = document.getElementById('minimapLabel')
  }

  public update(): void {
    if (!this.ctx) return
    const ctx = this.ctx
    const meta: any = this.scene.metadata || {}
    const player = meta.player as { mesh: { position: Vector3 } } | undefined
    const npcs: Array<{ mesh: { position: Vector3 }; kind: string }> = meta.npcs || []
    const monsters: Array<{ mesh: { position: Vector3 } }> = meta.monsters || []
    if (!player) return

    const w = (ctx.canvas.width = ctx.canvas.clientWidth)
    const h = (ctx.canvas.height = ctx.canvas.clientHeight)
    ctx.clearRect(0, 0, w, h)

    // Center on player
    const toView = (pos: Vector3) => {
      const dx = (pos.x - player.mesh.position.x) * this.scale
      const dz = (pos.z - player.mesh.position.z) * this.scale
      return { x: w / 2 + dx, y: h / 2 + dz }
    }

    // Draw ground ring
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(4, 4, w - 8, h - 8, 8)
    ctx.fill()
    ctx.stroke()

    // NPCs
    ctx.fillStyle = '#6cf'
    for (const n of npcs) {
      const v = toView(n.mesh.position)
      ctx.fillRect(v.x - 2, v.y - 2, 4, 4)
    }

    // Monsters
    ctx.fillStyle = '#ff7aa2'
    for (const m of monsters) {
      const v = toView(m.mesh.position)
      ctx.fillRect(v.x - 1.5, v.y - 1.5, 3, 3)
    }

    // Player
    ctx.fillStyle = '#71e6a2'
    const pv = toView(player.mesh.position)
    ctx.beginPath()
    ctx.arc(pv.x, pv.y, 3, 0, Math.PI * 2)
    ctx.fill()

    if (this.label) this.label.textContent = 'Adventure Plains'
  }
}


