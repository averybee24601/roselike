import { Matrix, Scene, Vector3 } from 'babylonjs'

function worldToScreen(scene: Scene, world: Vector3): { x: number; y: number } | null {
  const cam = scene.activeCamera
  if (!cam) return null
  const engine = scene.getEngine()
  const vp = cam.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
  const p = Vector3.Project(world, Matrix.IdentityReadOnly, scene.getTransformMatrix(), vp)
  return { x: p.x, y: p.y }
}

export function spawnDamageText(scene: Scene, world: Vector3, text: string, color = '#ffd166') {
  const screen = worldToScreen(scene, world)
  if (!screen) return
  const el = document.createElement('div')
  el.textContent = text
  el.style.position = 'fixed'
  el.style.left = `${screen.x}px`
  el.style.top = `${screen.y}px`
  el.style.transform = 'translate(-50%, -50%)'
  el.style.pointerEvents = 'none'
  el.style.color = color
  el.style.fontWeight = '700'
  el.style.textShadow = '0 2px 6px rgba(0,0,0,.6)'
  el.style.transition = 'transform 600ms ease-out, opacity 600ms ease-out'
  document.body.appendChild(el)
  // animate up and fade
  requestAnimationFrame(() => {
    el.style.transform = 'translate(-50%, -80%)'
    el.style.opacity = '0'
  })
  setTimeout(() => el.remove(), 650)
}


