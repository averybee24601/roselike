Adventure Plains — Top‑Down Blockout Plan

Scope
- This is the engine‑agnostic blockout for roads, rivers, bridges, coastline, town footprint, hills, and caves. Do not dress or add monsters until all shapes are verified against references.

Coordinate frame
- Origin: town square center.
- Axes: X east/right, Y north/up.
- Unit: 1 tile = planned 4–6 meters (final tuning later). In the current single‑file demo, 1 tile = 56 px.
- Store all annotated images in `airose/docs/reference/`.

Blockout layers (order)
1) Coastline and water bodies
   - Trace coastline, bays, and inlets per reference. Mark any offshore islet.
   - Rivers: split that forms a central island; annotate widths and curvature.
2) Town footprint
   - Rectangle/oval bounds of the town at the southeast coast; draw central square and building ring.
   - Exits: NW main, W farm, NNE coast/cave road.
3) Primary roads
   - Loop around the central island; spurs to coast, farms, and cave.
   - Road widths: main 2–3 tiles, spurs 1–2 tiles.
4) Bridges
   - Place spans exactly where roads cross water; record count and approximate lengths. Label B1..Bn.
5) Hills & Flaenaes hill
   - Place the Flaenaes hill as a mound with a flat-ish top; mark radius and height tiers.
6) Caves & landmarks
   - Goblin Cave entrance in NE quadrant near cliffs; add signposts, fences, windmill, carts.
7) Safe‑zone rings
   - Town protection radius and no‑spawn buffers per distance from town.

Verification checkboxes (fill from reference deck)
- [ ] Coastline traced; offshore islet position noted.
- [ ] River split paths/widths captured.
- [ ] Town bounds and all exits match reference.
- [ ] Primary loop and all secondary spurs mirrored.
- [ ] Bridge count/positions match reference; B1..Bn labeled on screenshots.
- [ ] Flaenaes hill center, radius, and approach roads marked.
- [ ] Goblin Cave location marked; other landmarks placed.

Deliverables from this phase
- `ap_blockout_v1.png`: top‑down linework with labels.
- `ap_bridges_v1.png`: close‑ups of each bridge with labels.
- `ap_flaenae_hill_v1.png`: silhouette and top view with dimensions.

Implementation handoff notes
- No portals in Plains for now. Travel is disabled in this zone; mini‑map must not show portals.
- Player should be able to walk the full loop; avoid tile edges that cause snapping.
- Bridges render as road‑colored planks with railings in dressing pass, but blockout uses simple rectangles.


