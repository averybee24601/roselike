import { DynamicTexture, Scene, StandardMaterial, Mesh, MeshBuilder, Color3, Vector3 } from 'babylonjs'

type NpcDef = { base: string; glyph: string; label: string }

const NPC_SPRITES: Record<string, NpcDef> = {
  signpost: { base: '#3a4b5f', glyph: 'ℹ️', label: 'Quest' },
  merchant: { base: '#3a5f3a', glyph: '🛒', label: 'Merchant' },
  trainer: { base: '#5b3a5f', glyph: '★', label: 'Trainer' },
  storage: { base: '#3a3f5f', glyph: '🧳', label: 'Storage' },
  cartmaster: { base: '#5f4a2a', glyph: '🛞', label: 'Cart Master' },
}

export function createNpcBillboard(scene: Scene, kind: string, position: Vector3): Mesh {
  const plane = MeshBuilder.CreatePlane(`npc_${kind}_bb`, { width: 1.2, height: 1.6 }, scene)
  plane.billboardMode = Mesh.BILLBOARDMODE_ALL
  plane.position.copyFrom(position)
  plane.position.y = 0.8

  const mat = new StandardMaterial(`npc_${kind}_mat`, scene)
  mat.specularColor = Color3.Black()
  mat.backFaceCulling = false

  const tex = new DynamicTexture(`npc_${kind}_tex`, { width: 256, height: 384 }, scene, true)
  const ctx = tex.getContext() as unknown as CanvasRenderingContext2D
  const def = NPC_SPRITES[kind] || { base: '#3a4b5f', glyph: '?' }
  // background rounded panel
  ctx.fillStyle = def.base
  ctx.fillRect(32, 80, 192, 224)
  // glyph
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '120px Segoe UI Emoji'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(def.glyph, 128, 180)
  // label
  ctx.font = '28px system-ui'
  ctx.fillStyle = '#cfe'
  ctx.fillText(def.label || kind, 128, 300)
  tex.update()

  mat.diffuseTexture = tex
  mat.opacityTexture = tex
  plane.material = mat
  return plane
}


