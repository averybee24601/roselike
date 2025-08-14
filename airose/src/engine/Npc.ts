import { Mesh, MeshBuilder, Scene, StandardMaterial, Color3, Vector3 } from 'babylonjs'

export type NpcKind = 'merchant' | 'trainer' | 'storage' | 'cartmaster' | 'signpost'

export type NpcOptions = {
  scene: Scene
  kind: NpcKind
  position: Vector3
}

export class Npc {
  public readonly mesh: Mesh
  public readonly kind: NpcKind

  constructor(options: NpcOptions) {
    const { scene, kind, position } = options
    this.kind = kind
    const mat = new StandardMaterial(`npc_${kind}_mat`, scene)
    mat.diffuseColor = colorFor(kind)
    mat.specularColor = Color3.Black()
    const m = MeshBuilder.CreateCylinder(`npc_${kind}`, { height: 1.4, diameter: 0.8 }, scene)
    m.material = mat
    m.position.copyFrom(position)
    m.position.y = 0.7
    this.mesh = m
  }
}

function colorFor(kind: NpcKind): Color3 {
  switch (kind) {
    case 'merchant':
      return Color3.FromHexString('#6cf')
    case 'trainer':
      return Color3.FromHexString('#ffcc66')
    case 'storage':
      return Color3.FromHexString('#cfa2ff')
    case 'cartmaster':
      return Color3.FromHexString('#71e6a2')
    case 'signpost':
    default:
      return Color3.FromHexString('#ffffff')
  }
}


