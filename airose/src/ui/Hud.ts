export class Hud {
  private readonly hpEl: HTMLElement | null

  constructor() {
    this.hpEl = document.getElementById('hp')
  }

  public setHealthRatio(ratio0to1: number): void {
    const r = Math.max(0, Math.min(1, ratio0to1))
    if (this.hpEl) (this.hpEl as HTMLElement).style.width = `${r * 100}%`
  }
}


