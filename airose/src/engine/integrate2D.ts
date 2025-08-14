import { Color3, DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from 'babylonjs'

type Loaded2D = {
  iframe: HTMLIFrameElement
  canvas: HTMLCanvasElement
}

function ensureIframeHost(): HTMLElement {
  let host = document.getElementById('twod-host') as HTMLElement | null
  if (!host) {
    host = document.createElement('div')
    host.id = 'twod-host'
    host.style.position = 'fixed'
    host.style.left = '-100000px'
    host.style.top = '-100000px'
    host.style.width = '1280px'
    host.style.height = '720px'
    host.style.overflow = 'hidden'
    document.body.appendChild(host)
  }
  return host
}

function tryLoad2D(url: string): Promise<Loaded2D> {
  return new Promise((resolve, reject) => {
    const host = ensureIframeHost()
    const iframe = document.createElement('iframe')
    iframe.setAttribute('loading', 'eager')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.width = '1280px'
    iframe.style.height = '720px'
    iframe.style.border = '0'
    iframe.src = url
    iframe.onload = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) throw new Error('no iframe document')
        const canvas = doc.getElementById('game') as HTMLCanvasElement | null
        if (!canvas) throw new Error('2D canvas #game not found')
        resolve({ iframe, canvas })
      } catch (err) {
        reject(err)
      }
    }
    iframe.onerror = (e) => reject(e)
    host.appendChild(iframe)
  })
}

export async function integrate2DIntoScene(scene: Scene, applyToGround?: Mesh): Promise<{ plane: Mesh; texture: DynamicTexture } | null> {
  // Attempt a few candidate URLs where the legacy 2D game may live
  const candidates = [
    // Prefer direct file-system serve via Vite /@fs when allowed
    '/@fs/C:/Users/avery/OneDrive/Documents/roselike/index.html',
    // Fallbacks if server exposes parent
    '/index.html',
    '../index.html',
    '../../index.html',
  ]
  let loaded: Loaded2D | null = null
  for (const url of candidates) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await tryLoad2D(url)
      loaded = res
      break
    } catch {
      // continue
    }
  }
  if (!loaded) {
    console.warn('[integration] Could not locate 2D game index.html in expected locations')
    return null
  }

  const { canvas: srcCanvas } = loaded

  // Create a dynamic texture mirroring the 2D canvas each frame
  const dt = new DynamicTexture('tex_2d_world', { width: 1024, height: 1024 }, scene, true)
  const ctx = dt.getContext() as unknown as CanvasRenderingContext2D
  let warnedOnce = false
  const draw = () => {
    const w = dt.getSize().width
    const h = dt.getSize().height
    const sw = srcCanvas.width || srcCanvas.clientWidth
    const sh = srcCanvas.height || srcCanvas.clientHeight
    if (sw && sh) {
      // letterbox into square to preserve aspect
      const scale = Math.min(w / sw, h / sh)
      const dw = Math.floor(sw * scale)
      const dh = Math.floor(sh * scale)
      const dx = Math.floor((w - dw) / 2)
      const dy = Math.floor((h - dh) / 2)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#091116'
      ctx.fillRect(0, 0, w, h)
      try {
        ctx.drawImage(srcCanvas, 0, 0, sw, sh, dx, dy, dw, dh)
        dt.update()
      } catch (err) {
        if (!warnedOnce) {
          console.warn('[integration] drawImage from 2D canvas failed (tainted or cross-origin assets?):', err)
          warnedOnce = true
        }
      }
    }
  }
  scene.onBeforeRenderObservable.add(draw)

  // World surface to display the 2D game: a large vertical screen
  const plane = MeshBuilder.CreatePlane('screen_2d', { width: 18, height: 10 }, scene)
  plane.position = new Vector3(0, 5.2, -10)

  const mat = new StandardMaterial('mat_2d_screen', scene)
  mat.diffuseColor = Color3.White()
  mat.specularColor = Color3.Black()
  mat.backFaceCulling = false
  mat.diffuseTexture = dt
  mat.opacityTexture = dt
  plane.material = mat

  // Optionally apply the texture onto an existing ground
  if (applyToGround && applyToGround.material && applyToGround.material instanceof StandardMaterial) {
    const gm = applyToGround.material as StandardMaterial
    gm.diffuseTexture = dt
    gm.opacityTexture = undefined
    gm.specularColor = Color3.Black()
  }

  return { plane, texture: dt }
}


