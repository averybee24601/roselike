import { create } from 'zustand'

export type Item = {
  id: string
  name: string
  kind: 'weapon' | 'potion' | 'material' | 'quest'
  power?: number
}

export type ShopEntry = {
  item: Item
  price: number
}

export type PlayerState = {
  name: string
  level: number
  exp: number
  nextLevelExp: number
  gold: number
  inventory: Item[]
  equippedWeapon?: Item
  job: 'Visitor' | 'Soldier' | 'Muse' | 'Hawker' | 'Dealer'
}

export type GameState = {
  player: PlayerState
  storage: Item[]
  quest: { id: string; title: string; target: number; progress: number; rewardGold: number; completed: boolean }
  shop: ShopEntry[]
  addItem: (item: Item) => void
  moveToStorage: (itemId: string) => void
  moveToInventory: (itemId: string) => void
  spendGold: (amount: number) => boolean
  earnGold: (amount: number) => void
  buyItem: (itemId: string) => boolean
  addExp: (amount: number) => void
  addQuestProgress: (n: number) => void
}

export const useGameState = create<GameState>((set, get) => ({
  player: {
    name: 'Visitor',
    level: 1,
    exp: 0,
    nextLevelExp: 50,
    gold: 0,
    inventory: [],
    equippedWeapon: undefined,
    job: 'Visitor',
  },
  storage: [],
  quest: { id: 'ap_kills_1', title: 'Clear the path: Defeat monsters', target: 3, progress: 0, rewardGold: 30, completed: false },
  shop: [
    { item: { id: 'wpn_sword_1', name: 'Bronze Sword', kind: 'weapon', power: 4 }, price: 40 },
    { item: { id: 'pot_small', name: 'Small Potion', kind: 'potion' }, price: 8 },
  ],
  addItem: (item) => set((s) => ({ player: { ...s.player, inventory: [...s.player.inventory, item] } })),
  moveToStorage: (itemId) => set((s) => {
    const idx = s.player.inventory.findIndex((i) => i.id === itemId)
    if (idx === -1) return s
    const item = s.player.inventory[idx]
    const inv = [...s.player.inventory]
    inv.splice(idx, 1)
    return { player: { ...s.player, inventory: inv }, storage: [...s.storage, item] }
  }),
  moveToInventory: (itemId) => set((s) => {
    const idx = s.storage.findIndex((i) => i.id === itemId)
    if (idx === -1) return s
    const item = s.storage[idx]
    const box = [...s.storage]
    box.splice(idx, 1)
    return { player: { ...s.player, inventory: [...s.player.inventory, item] }, storage: box }
  }),
  spendGold: (amount) => {
    const p = get().player
    if (p.gold < amount) return false
    set({ player: { ...p, gold: p.gold - amount } })
    return true
  },
  earnGold: (amount) => set((s) => ({ player: { ...s.player, gold: s.player.gold + amount } })),
  buyItem: (itemId) => {
    const { shop, spendGold, addItem } = get()
    const entry = shop.find((e) => e.item.id === itemId)
    if (!entry) return false
    if (!spendGold(entry.price)) return false
    addItem(entry.item)
    return true
  },
  addExp: (amount) => set((s) => {
    let { level, exp, nextLevelExp } = s.player
    exp += amount
    const player = { ...s.player }
    while (exp >= nextLevelExp) {
      exp -= nextLevelExp
      level += 1
      nextLevelExp = Math.floor(nextLevelExp * 1.4)
    }
    player.level = level
    player.exp = exp
    player.nextLevelExp = nextLevelExp
    return { player }
  }),
  addQuestProgress: (n) => set((s) => {
    if (s.quest.completed) return s
    const progress = Math.min(s.quest.target, s.quest.progress + n)
    const completed = progress >= s.quest.target
    const next = { ...s.quest, progress, completed }
    return { quest: next }
  }),
}))


