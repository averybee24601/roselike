import './style.css'
import { Engine } from 'babylonjs'
import { createScene } from './engine/createScene'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `<canvas id="renderCanvas" aria-label="Game canvas" role="img"></canvas>`

const canvas = document.querySelector<HTMLCanvasElement>('#renderCanvas')!
const engine = new Engine(canvas, true)
const scene = createScene(engine, canvas)

engine.runRenderLoop(() => {
  scene.render()
})

window.addEventListener('resize', () => {
  engine.resize()
})
