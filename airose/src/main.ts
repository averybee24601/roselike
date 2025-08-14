import './style.css'
import { Engine } from 'babylonjs'
import { createScene } from './engine/createScene'
import { Hud } from './ui/Hud'
import { bindHudToState, wireWindows } from './systems/uiBindings'
import { wireInteractions } from './systems/interactions'
import { MinimapRenderer } from './ui/Minimap'
import { wireWindowOpeners } from './ui/Windows'

const wrap = document.querySelector<HTMLDivElement>('#game-wrap')!
wrap.innerHTML = `<canvas id="renderCanvas" aria-label="Game canvas" role="img"></canvas>`
const hud = new Hud()

const canvas = document.querySelector<HTMLCanvasElement>('#renderCanvas')!
const engine = new Engine(canvas, true)
const scene = createScene(engine, canvas)

// Hook HUD to player health
const meta: any = scene.metadata || {}
const player = meta.player
if (player) {
  hud.setHealthRatio(player.health / player.maxHealth)
  player.onHealthChanged.add((hp: number) => {
    hud.setHealthRatio(hp / player.maxHealth)
  })
}

// UI bindings
bindHudToState()
wireWindows()
wireInteractions(scene)
wireWindowOpeners()

// Minimap
const minimap = new MinimapRenderer(scene)
engine.runRenderLoop(() => {
  minimap.update()
})

engine.runRenderLoop(() => {
  scene.render()
})

window.addEventListener('resize', () => {
  engine.resize()
})
