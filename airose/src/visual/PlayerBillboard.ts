import { Color3, DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from 'babylonjs'

export function createPlayerBillboard(scene: Scene, position: Vector3): Mesh {
  const plane = MeshBuilder.CreatePlane('player_bb', { width: 1.2, height: 1.8 }, scene)
  plane.billboardMode = Mesh.BILLBOARDMODE_ALL
  plane.position.copyFrom(position)
  plane.position.y = 0.9

  const mat = new StandardMaterial('player_bb_mat', scene)
  mat.specularColor = Color3.Black()
  mat.backFaceCulling = false
  const tex = new DynamicTexture('player_bb_tex', { width: 256, height: 384 }, scene, true)
  const ctx = tex.getContext() as unknown as CanvasRenderingContext2D

  const draw = (t: number) => {
    const w = tex.getSize().width, h = tex.getSize().height
    ctx.clearRect(0, 0, w, h)
    const bob = Math.sin(t / 520) * 4
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    ctx.beginPath()
    ctx.ellipse(w / 2, h * 0.78, 44, 16, 0, 0, Math.PI * 2)
    ctx.fill()
    // Outfit & body (visitor outfit)
    const outfit = ctx.createLinearGradient(0, h * 0.28 + bob, 0, h * 0.66 + bob)
    outfit.addColorStop(0, '#2a3e54')
    outfit.addColorStop(1, '#182533')
    ctx.fillStyle = outfit
    ctx.beginPath()
    ctx.roundRect(w / 2 - 20, h * 0.46 + bob, 40, 56, 8)
    ctx.fill()
    // Head
    ctx.fillStyle = '#e6d2b5'
    ctx.beginPath()
    ctx.arc(w / 2, h * 0.44 + bob, 14, 0, Math.PI * 2)
    ctx.fill()
    // Eyes
    ctx.fillStyle = '#0f1217'
    ctx.beginPath()
    ctx.arc(w / 2 - 5, h * 0.44 + bob, 2.2, 0, Math.PI * 2)
    ctx.arc(w / 2 + 5, h * 0.44 + bob, 2.2, 0, Math.PI * 2)
    ctx.fill()
    // Arms
    ctx.fillStyle = '#e6d2b5'
    ctx.fillRect(w / 2 - 26, h * 0.52 + bob, 10, 18)
    ctx.fillRect(w / 2 + 16, h * 0.52 + bob, 10, 18)
    // Legs
    ctx.fillStyle = '#1b2a38'
    ctx.fillRect(w / 2 - 16, h * 0.64 + bob, 12, 22)
    ctx.fillRect(w / 2 + 4, h * 0.64 + bob, 12, 22)

    tex.update()
  }
  scene.onBeforeRenderObservable.add(() => draw(performance.now()))

  mat.diffuseTexture = tex
  mat.opacityTexture = tex
  plane.material = mat
  return plane
}


