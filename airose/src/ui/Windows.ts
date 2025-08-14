import { useGameState } from '../systems/state'

function clear(el: HTMLElement) {
  while (el.firstChild) el.removeChild(el.firstChild)
}

export function renderInventory(): void {
  const list = document.getElementById('invList') as HTMLElement
  if (!list) return
  clear(list)
  const s = useGameState.getState()
  s.player.inventory.forEach((item) => {
    const row = document.createElement('div')
    row.className = 'item'
    row.innerHTML = `<div>${item.name}</div><div><button data-id="${item.id}">Equip</button></div>`
    const btn = row.querySelector('button') as HTMLButtonElement
    btn.addEventListener('click', () => {
      // Demo: equip weapon sets as equipped
      if (item.kind === 'weapon')
        (useGameState as any).setState({ player: { ...s.player, equippedWeapon: item } })
    })
    list.appendChild(row)
  })
}

export function renderShop(): void {
  const list = document.getElementById('shopList') as HTMLElement
  if (!list) return
  clear(list)
  const s = useGameState.getState()
  s.shop.forEach((entry) => {
    const row = document.createElement('div')
    row.className = 'item'
    row.innerHTML = `<div>${entry.item.name}</div><div><button data-id="${entry.item.id}">Buy (${entry.price} ✦)</button></div>`
    const btn = row.querySelector('button') as HTMLButtonElement
    btn.addEventListener('click', () => {
      if (useGameState.getState().buyItem(entry.item.id)) {
        renderInventory()
        updateCounters()
      }
    })
    list.appendChild(row)
  })
}

export function renderStorage(): void {
  const invList = document.getElementById('storInvList') as HTMLElement
  const boxList = document.getElementById('storBoxList') as HTMLElement
  if (!invList || !boxList) return
  clear(invList)
  clear(boxList)
  const s = useGameState.getState()
  s.player.inventory.forEach((item) => {
    const row = document.createElement('div')
    row.className = 'item'
    row.innerHTML = `<div>${item.name}</div><div><button data-id="${item.id}">Store</button></div>`
    row.querySelector('button')?.addEventListener('click', () => {
      useGameState.getState().moveToStorage(item.id)
      renderStorage()
      renderInventory()
      updateCounters()
    })
    invList.appendChild(row)
  })
  s.storage.forEach((item) => {
    const row = document.createElement('div')
    row.className = 'item'
    row.innerHTML = `<div>${item.name}</div><div><button data-id="${item.id}">Retrieve</button></div>`
    row.querySelector('button')?.addEventListener('click', () => {
      useGameState.getState().moveToInventory(item.id)
      renderStorage()
      renderInventory()
      updateCounters()
    })
    boxList.appendChild(row)
  })
}

export function updateCounters(): void {
  const invCountEl = document.getElementById('invCount')
  const goldEl = document.getElementById('gold')
  const s = useGameState.getState()
  if (invCountEl) invCountEl.textContent = String(s.player.inventory.length)
  if (goldEl) goldEl.textContent = String(s.player.gold)
}

export function wireWindowOpeners(): void {
  const invWin = document.getElementById('invWin') as HTMLElement
  const shopWin = document.getElementById('shopWin') as HTMLElement
  const storageWin = document.getElementById('storageWin') as HTMLElement
  const show = (w?: HTMLElement) => {
    ;[invWin, shopWin, storageWin].forEach((el) => el && (el.style.display = 'none'))
    if (w) w.style.display = 'block'
  }
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'i') {
      renderInventory()
      show(invWin)
    }
    if (e.key.toLowerCase() === 'm' && e.altKey) {
      renderShop()
      show(shopWin)
    }
    if (e.key.toLowerCase() === 'l' && e.altKey) {
      renderStorage()
      show(storageWin)
    }
  })
}


