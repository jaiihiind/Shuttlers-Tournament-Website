# Graph Report - .  (2026-08-12)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 4946 nodes · 4926 edges · 107 communities (81 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 82 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- 80916-a4313adf998dfb80.mjs
- 1699-21ee673e80c3e2da.mjs
- 9481-89afa061f1d6c7ab.mjs
- index-ec54f9e8bbe0f547.mjs
- s
- 52611-80355ccc70e8a9c8.mjs
- 50428-9f3c71b78f309b0e.mjs
- 60231-9bb47f2459c9cc58.mjs
- 32067-6d33ed7d91c483d3.mjs
- devDependencies
- 6434-20e22d3575515352.mjs
- 94691-ca2edc2582a12571.mjs
- 573-f652814ed406fa73.mjs
- 47143-3b5afe784f81c808.mjs
- 69565-14bc0af7db8ffce9.mjs
- compilerOptions
- 36281-2806ee67fb4cac72.mjs
- 95349-a4756e9d0bd9a428.mjs
- 1532-69cd3941fbc3fedd.mjs
- 82964-7a3765859c3232ca.mjs
- 1239-bef3d12a93412216.mjs
- 15393-c90b5cfc1d60c4fb.mjs
- app/page.tsx
- 21636-c971499b227305d7.mjs
- Grainient.tsx
- 85254-b848475a42c1454a.mjs
- layout.tsx
- 27633-aa5e1306b8a8ff7b.mjs
- PinVideoWithVisibilityWrapper-6545011f95695f98.mjs
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `s()` - 83 edges
2. `compilerOptions` - 16 edges
3. `include` - 7 edges
4. `scripts` - 5 edges
5. `Grainient()` - 4 edges
6. `lib` - 4 edges
7. `620814()` - 2 edges
8. `602774()` - 2 edges
9. `768219()` - 2 edges
10. `829597()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `620814()` --indirect_call--> `s()`  [INFERRED]
  public/logo_files/80916-a4313adf998dfb80.mjs → public/logo_files/runtime-7fb76ec2df851b0d.mjs
- `602774()` --indirect_call--> `s()`  [INFERRED]
  public/logo_files/1699-21ee673e80c3e2da.mjs → public/logo_files/runtime-7fb76ec2df851b0d.mjs
- `768219()` --indirect_call--> `s()`  [INFERRED]
  public/logo_files/9481-89afa061f1d6c7ab.mjs → public/logo_files/runtime-7fb76ec2df851b0d.mjs
- `829597()` --indirect_call--> `s()`  [INFERRED]
  public/logo_files/9481-89afa061f1d6c7ab.mjs → public/logo_files/runtime-7fb76ec2df851b0d.mjs
- `371124()` --indirect_call--> `s()`  [INFERRED]
  public/logo_files/index-ec54f9e8bbe0f547.mjs → public/logo_files/runtime-7fb76ec2df851b0d.mjs

## Import Cycles
- None detected.

## Communities (107 total, 26 thin omitted)

### Community 20 - "s"
Cohesion: 0.03
Nodes (57): 898609(), 768219(), 829597(), 647007(), 183309(), 92577(), 531363(), 829597() (+49 more)

### Community 26 - "devDependencies"
Cohesion: 0.05
Nodes (40): eslint, eslint-config-next, framer-motion, @lottiefiles/dotlottie-react, lucide-react, next, ogl, dependencies (+32 more)

### Community 44 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 75 - "app/page.tsx"
Cohesion: 0.21
Nodes (5): bubbleFont, AnalyticsLottie(), ContactModalButton(), FeatureCardProps, FeaturesSection()

### Community 86 - "Grainient.tsx"
Cohesion: 0.31
Nodes (4): ctxMap, Grainient(), GrainientProps, hexToRgb()

### Community 90 - "layout.tsx"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, luckiestGuy, metadata

## Knowledge Gaps
- **57 isolated node(s):** `FeatureCardProps`, `GrainientProps`, `name`, `private`, `build` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `s()` connect `s` to `80916-a4313adf998dfb80.mjs`, `1699-21ee673e80c3e2da.mjs`, `9481-89afa061f1d6c7ab.mjs`, `index-ec54f9e8bbe0f547.mjs`, `52611-80355ccc70e8a9c8.mjs`, `50428-9f3c71b78f309b0e.mjs`, `60231-9bb47f2459c9cc58.mjs`, `32067-6d33ed7d91c483d3.mjs`, `6434-20e22d3575515352.mjs`, `94691-ca2edc2582a12571.mjs`, `573-f652814ed406fa73.mjs`, `47143-3b5afe784f81c808.mjs`, `69565-14bc0af7db8ffce9.mjs`, `36281-2806ee67fb4cac72.mjs`, `95349-a4756e9d0bd9a428.mjs`, `1532-69cd3941fbc3fedd.mjs`, `82964-7a3765859c3232ca.mjs`, `1239-bef3d12a93412216.mjs`, `15393-c90b5cfc1d60c4fb.mjs`, `21636-c971499b227305d7.mjs`, `85254-b848475a42c1454a.mjs`, `27633-aa5e1306b8a8ff7b.mjs`, `PinVideoWithVisibilityWrapper-6545011f95695f98.mjs`?**
  _High betweenness centrality (0.422) - this node is a cross-community bridge._
- **Why does `183309()` connect `s` to `_client-1df416717d45c0d0.mjs`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `92577()` connect `s` to `_client-1df416717d45c0d0.mjs`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Are the 82 inferred relationships involving `s()` (e.g. with `53579()` and `348888()`) actually correct?**
  _`s()` has 82 INFERRED edges - model-reasoned connections that need verification._
- **What connects `FeatureCardProps`, `GrainientProps`, `name` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `[slug]-239ece8a44e691f8.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005208333333333333 - nodes in this community are weakly interconnected._
- **Should `[scope]-b07e8f5c7d5c0a06.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005988023952095809 - nodes in this community are weakly interconnected._