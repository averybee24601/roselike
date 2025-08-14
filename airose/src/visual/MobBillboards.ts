import { Color3, DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from 'babylonjs'

function createBillboard(scene: Scene, width: number, height: number): { mesh: Mesh; tex: DynamicTexture; ctx: CanvasRenderingContext2D } {
  const mesh = MeshBuilder.CreatePlane('mob_bb', { width, height }, scene)
  mesh.billboardMode = Mesh.BILLBOARDMODE_ALL
  const mat = new StandardMaterial('mob_bb_mat', scene)
  mat.specularColor = Color3.Black()
  mat.backFaceCulling = false
  const tex = new DynamicTexture('mob_bb_tex', { width: 256, height: 256 }, scene, true)
  const ctx = tex.getContext() as unknown as CanvasRenderingContext2D
  mat.diffuseTexture = tex
  mat.opacityTexture = tex
  mesh.material = mat
  return { mesh, tex, ctx }
}

export function createJellyBillboard(scene: Scene, position: Vector3): Mesh {
  const { mesh, tex, ctx } = createBillboard(scene, 1.4, 1.4)
  mesh.position.copyFrom(position)
  mesh.position.y = 0.7

  const draw = (t: number) => {
    const w = tex.getSize().width, h = tex.getSize().height
    ctx.clearRect(0, 0, w, h)
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.32)'
    ctx.beginPath()
    ctx.ellipse(w / 2, h * 0.78, 46, 20, 0, 0, Math.PI * 2)
    ctx.fill()
    // Body
    const bob = Math.sin(t / 450) * 8
    const g = ctx.createLinearGradient(0, h * 0.2 + bob, 0, h * 0.7 + bob)
    g.addColorStop(0, '#73d65a')
    g.addColorStop(1, '#3e9e2f')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(w / 2, h * 0.58 + bob, 70, 60, 0, 0, Math.PI * 2)
    ctx.fill()
    // Eyes
    ctx.fillStyle = '#111'
    ctx.beginPath()
    ctx.arc(w / 2 - 20, h * 0.54 + bob, 6, 0, Math.PI * 2)
    ctx.arc(w / 2 + 20, h * 0.54 + bob, 6, 0, Math.PI * 2)
    ctx.fill()
    tex.update()
  }

  scene.onBeforeRenderObservable.add(() => draw(performance.now()))
  return mesh
}

export function createChoropyBillboard(scene: Scene, position: Vector3): Mesh {
  const { mesh, tex, ctx } = createBillboard(scene, 1.6, 1.8)
  mesh.position.copyFrom(position)
  mesh.position.y = 0.9

  const draw = (t: number) => {
    const w = tex.getSize().width, h = tex.getSize().height
    ctx.clearRect(0, 0, w, h)
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.30)'
    ctx.beginPath()
    ctx.ellipse(w / 2, h * 0.82, 50, 18, 0, 0, Math.PI * 2)
    ctx.fill()
    const bob = Math.sin(t / 520) * 6
    // Body (leafy orb)
    const g = ctx.createLinearGradient(0, h * 0.28 + bob, 0, h * 0.66 + bob)
    g.addColorStop(0, '#64c27b')
    g.addColorStop(1, '#2f6e3f')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(w / 2, h * 0.62 + bob, 62, 58, 0, 0, Math.PI * 2)
    ctx.fill()
    // Crown leaves
    ctx.fillStyle = '#3da95a'
    for (let i = -2; i <= 2; i += 1) {
      ctx.save()
      ctx.translate(w / 2 + i * 10, h * 0.42 + bob)
      ctx.rotate((i * Math.PI) / 18)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(20, -18, 0, -36)
      ctx.quadraticCurveTo(-20, -18, 0, 0)
      ctx.fill()
      ctx.restore()
    }
    // Eyes
    ctx.fillStyle = '#0f1217'
    ctx.beginPath()
    ctx.arc(w / 2 - 16, h * 0.58 + bob, 6, 0, Math.PI * 2)
    ctx.arc(w / 2 + 16, h * 0.58 + bob, 6, 0, Math.PI * 2)
    ctx.fill()
    tex.update()
  }

  scene.onBeforeRenderObservable.add(() => draw(performance.now()))
  return mesh
}


