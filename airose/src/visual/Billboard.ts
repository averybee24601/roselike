import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Texture } from 'babylonjs'

export type Billboard = {
  mesh: Mesh
  material: StandardMaterial
  texture: Texture
}

export function createBillboard(scene: Scene, width = 1.6, height = 1.8): Billboard {
  const mesh = MeshBuilder.CreatePlane('billboard', { width, height }, scene)
  mesh.billboardMode = Mesh.BILLBOARDMODE_ALL

  const material = new StandardMaterial('billboard_mat', scene)
  material.diffuseColor = Color3.White()
  material.specularColor = Color3.Black()
  material.backFaceCulling = false
  material.alpha = 1

  const texture = new Texture('', scene)
  material.diffuseTexture = texture
  material.opacityTexture = texture

  mesh.material = material

  return { mesh, material, texture }
}


