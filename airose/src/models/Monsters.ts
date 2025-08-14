import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from 'babylonjs'

export function createChoropy(scene: Scene, position: Vector3): Mesh {
  const root = new TransformNode('choropy_root', scene)

  // Body
  const bodyMat = new StandardMaterial('choropy_body_mat', scene)
  bodyMat.diffuseColor = Color3.FromHexString('#64c27b')
  bodyMat.specularColor = Color3.Black()
  const body = MeshBuilder.CreateSphere('choropy_body', { diameter: 1.3, segments: 12 }, scene)
  body.material = bodyMat
  body.parent = root
  body.position.set(0, 0.65, 0)

  // Leaves crown
  const leafMat = new StandardMaterial('choropy_leaf_mat', scene)
  leafMat.diffuseColor = Color3.FromHexString('#3da95a')
  leafMat.specularColor = Color3.Black()
  for (let i = 0; i < 5; i += 1) {
    const leaf = MeshBuilder.CreateCylinder(
      `choropy_leaf_${i}`,
      { height: 0.6, diameterTop: 0, diameterBottom: 0.25, tessellation: 6 },
      scene,
    )
    leaf.material = leafMat
    leaf.rotation.z = Math.PI / 2.2
    leaf.position.set(0.1 + i * 0.02, 1.25 + i * 0.02, -0.1 + (i % 2) * 0.06)
    leaf.parent = root
  }

  // Eyes (simple readable)
  const eyeMat = new StandardMaterial('choropy_eye_mat', scene)
  eyeMat.diffuseColor = Color3.Black()
  const eyeL = MeshBuilder.CreateSphere('choropy_eye_l', { diameter: 0.08 }, scene)
  const eyeR = eyeL.clone('choropy_eye_r')!
  eyeL.material = eyeMat
  eyeR.material = eyeMat
  eyeL.parent = root
  eyeR.parent = root
  eyeL.position.set(-0.18, 0.78, 0.62)
  eyeR.position.set(0.18, 0.78, 0.62)

  root.position.copyFrom(position)
  const childParts = root.getChildMeshes(false).filter((m): m is Mesh => m instanceof Mesh)
  const baked = Mesh.MergeMeshes(childParts, true, true, undefined, false, true) as Mesh
  baked.name = 'choropy'
  baked.position.copyFrom(position)
  root.dispose()
  return baked
}

export function createJellyBean(scene: Scene, position: Vector3): Mesh {
  const root = new TransformNode('jelly_root', scene)
  const mat = new StandardMaterial('jelly_mat', scene)
  mat.diffuseColor = Color3.FromHexString('#ff7aa2')
  mat.specularColor = Color3.Black()
  const body = MeshBuilder.CreateCapsule('jelly_body', { height: 1.1, radius: 0.5, tessellation: 10 }, scene)
  body.material = mat
  body.parent = root
  body.position.set(0, 0.55, 0)

  const eyeMat = new StandardMaterial('jelly_eye_mat', scene)
  eyeMat.diffuseColor = Color3.Black()
  const eyeL = MeshBuilder.CreateSphere('jelly_eye_l', { diameter: 0.08 }, scene)
  const eyeR = eyeL.clone('jelly_eye_r')!
  eyeL.material = eyeMat
  eyeR.material = eyeMat
  eyeL.parent = root
  eyeR.parent = root
  eyeL.position.set(-0.16, 0.75, 0.5)
  eyeR.position.set(0.16, 0.75, 0.5)

  root.position.copyFrom(position)
  const childParts = root.getChildMeshes(false).filter((m): m is Mesh => m instanceof Mesh)
  const baked = Mesh.MergeMeshes(childParts, true, true, undefined, false, true) as Mesh
  baked.name = 'jellybean'
  baked.position.copyFrom(position)
  root.dispose()
  return baked
}


