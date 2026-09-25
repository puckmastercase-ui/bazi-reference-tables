/**
 * Minimal reader for the reference tables.
 * No dependencies; the JSON files are the source of truth.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const DIR = join(dirname(fileURLToPath(import.meta.url)), 'data')
const load = (f) => JSON.parse(readFileSync(join(DIR, f), 'utf-8'))

export const tenGods = Object.freeze(load('ten-gods.json').data)
export const hiddenStems = Object.freeze(load('hidden-stems.json').data)
export const twelveStages = Object.freeze(load('twelve-stages.json').data)
export const branchRelations = Object.freeze(load('branch-relations.json'))
export const simplifiedTraditionalFixes = Object.freeze(load('simplified-traditional-fixes.json'))

/** 十神：日主天干 × 目标天干 */
export const getTenGod = (dayMaster, otherStem) => tenGods[dayMaster]?.[otherStem] ?? null

/** 藏干：返回 [本气, 中气, 余气]（地支无余气时数组更短） */
export const getHiddenStems = (branch) => hiddenStems[branch]?.stems ?? null

/** 十二长生：某天干在某地支的阶段 */
export const getTwelveStage = (stem, branch) => twelveStages[stem]?.[branch] ?? null

/** 地支关系：返回 [{relation, group, meaning}, ...]（无关系时为空数组） */
export const getBranchRelations = (a, b) => branchRelations.lookup[`${a}${b}`] ?? []

export default { tenGods, hiddenStems, twelveStages, branchRelations, getTenGod, getHiddenStems, getTwelveStage, getBranchRelations }
