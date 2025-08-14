import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from 'babylonjs'

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine)

  const camera = new ArcRotateCamera(
    'camera',
    Math.PI / 4,
    Math.PI / 3,
    12,
    new Vector3(0, 1, 0),
    scene,
  )
  camera.attachControl(canvas, true)

  const light = new HemisphericLight('light', new Vector3(0.2, 1, 0.2), scene)
  light.intensity = 0.9

  const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20, subdivisions: 2 }, scene)
  ground.receiveShadows = true

  const sphere = MeshBuilder.CreateSphere('hero_placeholder', { diameter: 1.5 }, scene)
  sphere.position.y = 1

  return scene
}


