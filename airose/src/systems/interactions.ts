import { Scene, Vector3 } from 'babylonjs'
import { useGameState } from './state'

export function wireInteractions(scene: Scene): void {
  const meta: any = scene.metadata || {}
  const player = meta.player as { mesh: { position: Vector3 } } | undefined
  const npcs: Array<{ kind: string; mesh: { position: Vector3 } }> = meta.npcs || []
  if (!player || npcs.length === 0) return

  const hint = document.getElementById('hint')

  scene.onBeforeRenderObservable.add(() => {
    let nearbyKind: string | null = null
    for (const n of npcs) {
      const d2 = Vector3.DistanceSquared(player.mesh.position, n.mesh.position)
      if (d2 < 2.2 * 2.2) {
        nearbyKind = n.kind
        break
      }
    }
    if (hint) hint.style.display = nearbyKind ? 'block' : 'none'
  })

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'e') return
    // Find closest npc within range
    let closest: { kind: string; mesh: { position: Vector3 } } | null = null
    let best = Infinity
    for (const n of npcs) {
      const d2 = Vector3.DistanceSquared(player.mesh.position, n.mesh.position)
      if (d2 < best) {
        best = d2
        closest = n as any
      }
    }
    if (!closest || best > 2.2 * 2.2) return
    openNpc(closest.kind)
  })
}

function openNpc(kind: string) {
  const show = (id: string) => {
    const w = document.getElementById(id) as HTMLElement
    if (w) w.style.display = 'block'
  }
  if (kind === 'merchant') show('shopWin')
  else if (kind === 'storage') show('storageWin')
  else if (kind === 'trainer') show('jobWin')
  else if (kind === 'signpost') {
    const gs = useGameState.getState()
    if (gs.quest.completed) {
      useGameState.getState().earnGold(gs.quest.rewardGold)
      ;(useGameState as any).setState({ quest: { ...gs.quest, progress: 0, completed: false } })
    }
  }
}


