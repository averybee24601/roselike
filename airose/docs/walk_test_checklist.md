Adventure Plains — Walking Test Checklist (No disappearing ground)

Route coverage
- [ ] Start at town square; clockwise loop covering every road segment and spur.
- [ ] Counter‑clockwise loop.
- [ ] All bridge approaches and crossings.
- [ ] Perimeter stroll along coastline where accessible.
- [ ] Flaenaes hill: approach from all roads; circle summit.
- [ ] Cave approach road and back.

What to watch for
- [ ] Any ground tile popping/disappearing.
- [ ] Gaps at tile seams on camera pan.
- [ ] Bridges z‑fighting or flicker.
- [ ] Snagging on invisible barriers.
- [ ] Camera jitter or scroll stalls.

If any issue occurs
1) Repro details: position screenshot, camera size, device DPR, browser.
2) Toggle renderer flag to Canvas: set `localStorage['ap-graphics']={"renderer":"canvas"}` and reload; retest.
3) Reduce post/shadow flags via in‑game menu if present; retest.
4) Verify tile bounds and safe‑zone masks at the failure location.
5) Fix until non‑reproducible across 3 full loops.

Sign‑off
- [ ] 3 consecutive full loops (both directions) with 0 ground pop/flicker.
- [ ] Bridges stable from all angles.
- [ ] Mini‑map path legible and aligned with roads.


