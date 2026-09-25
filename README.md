# BaZi / 四柱 Reference Tables

Deterministic reference tables for **BaZi (八字, Four Pillars)** and Chinese astrology software — the lookup data every chart calculator needs, open and cross-verified.

Anything that computes 十神 / 藏干 / 十二长生 / 地支关系 ends up hardcoding these somewhere. This repo is that data, in plain JSON, with the derivation and the verification stated up front.

## Why this exists

While building [依理排盤 (yilibazi.com)](https://www.yilibazi.com/), we needed these tables to be **provably** correct, not copied from a forum post. So:

| Table | How it was produced | How it was verified |
|---|---|---|
| 十神 Ten Gods | Computed cell-by-cell from a working engine (10 日主 × 10 天干 = 100 cells) | Re-derived independently at publish time; mismatch fails the build |
| 藏干 Hidden Stems | Taken from the same engine the chart tool uses | — (fixed classical table) |
| 十二长生 Twelve Stages | Derived from 长生位 + 阳顺阴逆 rule (not hand-typed) | Compared cell-by-cell against [`lunar-javascript`](https://github.com/6tail/lunar-javascript)'s `CHANG_SHENG` table — **120/120 match**; deliberately corrupting one offset produces 12 mismatches, so the check has teeth |
| 地支关系 Branch Relations | Classical six relations | Cross-checked against published rule text |
| 繁简 Term Fixes | Our own bug log | See below — this one's the interesting part |

## Files

```
data/ten-gods.json                    十神 (day master × target stem)
data/ten-gods.csv                     same, spreadsheet-friendly
data/hidden-stems.json                藏干 (本气/中气/余气 order preserved)
data/twelve-stages.json               十二长生
data/branch-relations.json            六合/三合/三会/六冲/相刑/相害 + pairwise lookup
data/stems-and-branches.json          天干地支 五行/阴阳
data/simplified-traditional-fixes.json  繁简 conversion fixes for astrology terms
```

## Usage

```js
import tenGods from './data/ten-gods.json' with { type: 'json' }
import hidden from './data/hidden-stems.json' with { type: 'json' }

tenGods.data['甲']['庚']        // "七杀"
hidden['丑'].stems              // ["己","癸","辛"]  → 本气, 中气, 余气
```

```python
import json
t = json.load(open('data/ten-gods.json'))['data']
t['甲']['庚']                   # '七杀'
```

## ⚠️ The 繁简 pitfall (worth reading even if you skip the rest)

If you convert Simplified → Traditional Chinese with a general-purpose converter (`opencc` et al.), **it will silently corrupt astrology terminology**. Every one of these was a real bug we shipped and then caught:

| Converter output | Correct | Why |
|---|---|---|
| `藏幹` | **藏干** | 干支's 干 = heavenly *stem*, not 幹 (trunk/cadre) |
| `年乾` | **年干** | converter produces 乾 (as in 乾坤) — and it's *inconsistent*: it gets `日干` right but `年干` wrong |
| `刑衝` | **刑沖** | astrological usage is always 沖 (相沖/沖剋), never 衝 |
| `醜` | **丑** | the earthly branch 丑 is not 醜 (ugly). **Worst one** — it hits 丑未沖 / 子丑合 / 丑戌未三刑 / 巳酉丑三合金局 |

Fixes shipped in `data/simplified-traditional-fixes.json`:

```js
s = s.replace(/幹/g, '干')                        // global: no legitimate 幹 in this domain
     .replace(/衝/g, '沖')                        // global: this domain never means 衝撞
     .replace(/乾(?!造|坤|燥|脆|旱|隆|卦)/g, '干')   // global, but keep 乾造/乾坤/乾燥/乾卦
     .replace(/醜/g, '丑')
```

**How we found them**: not by checking "the errors we already knew about" — that approach missed 醜→丑 entirely. We ran the **entire domain glossary** (194 terms) through the converter and reviewed every single change (71 of them; 70 were correct). If you maintain a domain-specific converter rule set, audit it that way.

## Data provenance & license

Generated from the engine that powers [yilibazi.com](https://www.yilibazi.com/) (a free BaZi / 紫微斗數 chart tool, available in English, Simplified and Traditional Chinese). Regeneration is scripted, not hand-edited — hand-editing a table is how tables drift.

MIT licensed. Use it in your own tool, no attribution required (a link is appreciated, not a condition).
