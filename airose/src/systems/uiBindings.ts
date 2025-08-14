import { useGameState } from './state'

export function bindHudToState(): void {
  const goldEl = document.getElementById('gold')
  const nameEl = document.getElementById('pname')
  const jobEl = document.getElementById('job')
  const lvEl = document.getElementById('lv')
  const invCountEl = document.getElementById('invCount')
  const xpEl = document.getElementById('xp') as HTMLElement | null
  const nextXpEl = document.getElementById('nextxp')
  const questLine = document.getElementById('quest-line')
  const questProg = document.getElementById('quest-progress')
  const questReward = document.getElementById('quest-reward')

  const render = () => {
    const s = useGameState.getState()
    if (goldEl) goldEl.textContent = String(s.player.gold)
    if (nameEl) nameEl.textContent = s.player.name
    if (jobEl) jobEl.textContent = 'Visitor'
    if (lvEl) lvEl.textContent = String(s.player.level)
    if (invCountEl) invCountEl.textContent = String(s.player.inventory.length)
    if (xpEl) xpEl.style.width = `${(s.player.exp / s.player.nextLevelExp) * 100}%`
    if (nextXpEl) nextXpEl.textContent = String(s.player.nextLevelExp - s.player.exp)
    if (questLine) questLine.textContent = useGameState.getState().quest.title
    if (questProg) questProg.textContent = `Progress: ${s.quest.progress} / ${s.quest.target}`
    if (questReward) questReward.textContent = s.quest.completed ? `Completed! Claim at signpost (+${s.quest.rewardGold} ✦)` : ''
  }
  render()
  useGameState.subscribe(render)
}

export function wireWindows(): void {
  const invWin = document.getElementById('invWin') as HTMLElement
  const shopWin = document.getElementById('shopWin') as HTMLElement
  const storageWin = document.getElementById('storageWin') as HTMLElement

  const invClose = document.getElementById('invClose') as HTMLElement
  const shopClose = document.getElementById('shopClose') as HTMLElement
  const storageClose = document.getElementById('storageClose') as HTMLElement

  const show = (el?: HTMLElement) => {
    ;[invWin, shopWin, storageWin].forEach((w) => w && (w.style.display = 'none'))
    if (el) el.style.display = 'block'
  }

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'i') show(invWin)
    if (e.key.toLowerCase() === 'm' && e.altKey) show(shopWin)
    if (e.key.toLowerCase() === 'l' && e.altKey) show(storageWin)
  })

  invClose?.addEventListener('click', () => show())
  shopClose?.addEventListener('click', () => show())
  storageClose?.addEventListener('click', () => show())
}


