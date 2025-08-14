import { ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from 'babylonjs'
import { PlayerController } from './PlayerController'
import { Monster } from './Monster'
// import { Npc } from './Npc'
import { createNpcBillboard } from '../visual/NpcBillboards'
import { integrate2DIntoScene } from './integrate2D'

export function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
  const scene = new Scene(engine)
  scene.clearColor = new Color4(0.86, 0.93, 1.0, 1)

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
  light.intensity = 1.0
  light.diffuse = Color3.FromHexString('#fff1cf')
  light.groundColor = Color3.FromHexString('#dbe7ff')

  const ground = MeshBuilder.CreateGround('ground', { width: 60, height: 60, subdivisions: 16 }, scene)
  ground.receiveShadows = true
  const groundMat = new StandardMaterial('groundMat', scene)
  groundMat.specularColor = Color3.Black()
  groundMat.diffuseColor = new Color3(0.53, 0.74, 0.52)
  ground.material = groundMat

  const player = new PlayerController({ scene })
  camera.lockedTarget = player.mesh

  // Spawn a few themed monsters for first pass
  const spawnAt = [
    new Vector3(3, 0, 3),
    new Vector3(-4, 0, 6),
    new Vector3(6, 0, -2),
    new Vector3(-6, 0, -5),
  ]
  const monsters: Monster[] = []
  spawnAt.forEach((p, i) => {
    // Alternate kinds for variety
    const kind = i % 2 === 0 ? 'choropy' : 'jellybean'
    const m = new Monster({ scene, kind, position: p })
    monsters.push(m)
  })

  // Place essential NPCs near origin
  const npcs = [
    { kind: 'signpost', mesh: createNpcBillboard(scene, 'signpost', new Vector3(0, 0, -3)) },
    { kind: 'merchant', mesh: createNpcBillboard(scene, 'merchant', new Vector3(2.5, 0, -2)) },
    { kind: 'trainer', mesh: createNpcBillboard(scene, 'trainer', new Vector3(-2.5, 0, -2)) },
    { kind: 'storage', mesh: createNpcBillboard(scene, 'storage', new Vector3(4, 0, 0)) },
    { kind: 'cartmaster', mesh: createNpcBillboard(scene, 'cartmaster', new Vector3(-4, 0, 0)) },
  ]

  // Expose monsters to scene metadata for simple interactions
  ;(scene.metadata as any) = { ...(scene.metadata || {}), monsters, npcs, player }

  // Integrate the 2D game as a diegetic screen in-world and optionally map onto the ground
  integrate2DIntoScene(scene, ground).catch((e) => console.warn('2D integration failed', e))

  return scene
}


