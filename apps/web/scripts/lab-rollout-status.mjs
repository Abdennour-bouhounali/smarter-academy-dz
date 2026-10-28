#!/usr/bin/env node
/**
 * L'ÉTAT du déploiement du prototype de labo (docs/reports/LAB_PROTOTYPE_ROLLOUT.md) — à lancer au début de chaque session, au lieu
 * d'explorer le code : il dit, leçon par leçon et labo par labo, ce qui est déjà fait.
 *
 *   node apps/web/scripts/lab-rollout-status.mjs              # le résumé des lots
 *   node apps/web/scripts/lab-rollout-status.mjs --batch 2    # le détail du lot 2 (20 leçons)
 *   node apps/web/scripts/lab-rollout-status.mjs --lesson <id>
 *   node apps/web/scripts/lab-rollout-status.mjs --json
 *
 * Les LOTS : les 112 leçons construites (lessonIndex.generated.json), triées par année (1AM → 4AM) puis par dossier (donc par unité),
 * par paquets de 20. L'ordre est stable tant qu'aucune leçon n'est ajoutée ; une leçon ajoutée va au DERNIER lot.
 *
 * Ce qui est détecté (marqueurs de code, pas de jugement : l'audit et le navigateur restent obligatoires) :
 *   labo   : cp = useLabCheckpoint · step = LabStepper · party = useStepCelebration · sfx = playSfx · teacher = useLabCheckpointSettings
 *   leçon  : cards = pieds de module <KnowledgeSnapshot moduleNumber> · memo = ceux en variant="memo" · items = connaissances de
 *            knowledge.jsx · withMemo = items avec `memo:` · withQuiz = items avec `quiz:` dans leur memo
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LESSONS = path.join(WEB, 'src/lessons');
const MANIP = path.join(LESSONS, 'common/manipulations');
const BATCH = 20;
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };

const idx = JSON.parse(fs.readFileSync(path.join(LESSONS, 'lessonIndex.generated.json'), 'utf8')).lessons;
const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name === 'lesson.config.js') out.push(p);
  }
  return out;
};
const dirOf = {};
for (const c of walk(path.join(LESSONS, 'moyen'))) {
  const m = /^\s*id:\s*'([^']+)'/m.exec(fs.readFileSync(c, 'utf8'));
  if (m) dirOf[m[1]] = path.dirname(c);
}

const reg = fs.readFileSync(path.join(MANIP, 'manipulationRegistry.js'), 'utf8');
const types = [...reg.matchAll(/^\s*'([a-z0-9-]+)':\s*lazy\(\(\) => import\('\.\/([^']+)'\)\)/gm)].map((m) => ({ type: m[1], file: m[2] }));
const typeByComp = Object.fromEntries(types.map((t) => [path.basename(t.file), t.type]));
const labFile = (type) => {
  const t = types.find((x) => x.type === type);
  for (const ext of ['.jsx', '.js']) { const p = path.join(MANIP, t.file + ext); if (fs.existsSync(p)) return p; }
  return null;
};
const labState = {};
for (const t of types) {
  const f = labFile(t.type);
  const src = f ? fs.readFileSync(f, 'utf8') : '';
  labState[t.type] = {
    file: f ? path.relative(path.join(WEB, '..', '..'), f) : null,
    cp: src.includes('useLabCheckpoint('), step: src.includes('<LabStepper'), party: src.includes('useStepCelebration('),
    sfx: src.includes('playSfx('), teacher: src.includes('useLabCheckpointSettings('),
  };
}

const order = ['1am', '2am', '3am', '4am'];
const rows = idx.map((l) => {
  const dir = dirOf[l.id];
  const mdir = path.join(dir, 'modules');
  const labs = new Set(); let cards = 0; let memoCards = 0;
  for (const f of fs.readdirSync(mdir).filter((x) => x.endsWith('.jsx'))) {
    const src = fs.readFileSync(path.join(mdir, f), 'utf8');
    for (const m of src.matchAll(/type="([a-z0-9-]+)"/g)) if (labState[m[1]]) labs.add(m[1]);
    for (const m of src.matchAll(/manipulations\/[a-zA-Z/]*\/([A-Z][A-Za-z0-9]+)'/g)) if (typeByComp[m[1]]) labs.add(typeByComp[m[1]]);
    cards += (src.match(/<KnowledgeSnapshot moduleNumber/g) || []).length;
    memoCards += (src.match(/<KnowledgeSnapshot moduleNumber=\{\d+\} variant="memo"/g) || []).length;
  }
  const kn = path.join(dir, 'knowledge.jsx');
  const ksrc = fs.existsSync(kn) ? fs.readFileSync(kn, 'utf8') : '';
  return {
    id: l.id, grade: l.grade, dir: path.relative(path.join(WEB, '..', '..'), dir), modules: l.modules.length, labs: [...labs],
    cards, memoCards, items: (ksrc.match(/\bid: '[^']+', type: '/g) || []).length,
    withMemo: (ksrc.match(/^\s+memo: \{/gm) || []).length, withQuiz: (ksrc.match(/^\s+quiz: \[/gm) || []).length,
  };
}).sort((a, b) => order.indexOf(a.grade) - order.indexOf(b.grade) || a.dir.localeCompare(b.dir));
rows.forEach((r, i) => { r.batch = Math.floor(i / BATCH) + 1; });

const labDone = (t) => { const s = labState[t]; return s.cp && s.step && s.party && s.sfx && s.teacher; };
const lessonDone = (r) => r.labs.every(labDone) && r.cards === r.memoCards && r.items > 0 && r.withMemo === r.items && r.withQuiz === r.items;
const mark = (b) => (b ? '✓' : '·');

if (args.includes('--json')) {
  console.log(JSON.stringify({ rows, labState }, null, 1));
} else if (opt('--batch') || opt('--lesson')) {
  const pick = opt('--lesson') ? rows.filter((r) => r.id === opt('--lesson')) : rows.filter((r) => r.batch === Number(opt('--batch')));
  for (const r of pick) {
    console.log(`\n${lessonDone(r) ? '✅' : '⬜'} [lot ${r.batch}] ${r.id} (${r.grade}) — ${r.dir}`);
    console.log(`   cartes de fin de module : ${r.memoCards}/${r.cards} en memo · connaissances : ${r.items} · memo ${r.withMemo}/${r.items} · quiz ${r.withQuiz}/${r.items}`);
    for (const t of r.labs) {
      const s = labState[t];
      console.log(`   labo ${t.padEnd(26)} cp ${mark(s.cp)} step ${mark(s.step)} party ${mark(s.party)} sfx ${mark(s.sfx)} teacher ${mark(s.teacher)}  ${s.file}`);
    }
    if (r.labs.length === 0) console.log('   (aucun labo : seulement les cartes de fin de module)');
  }
} else {
  const batches = [...new Set(rows.map((r) => r.batch))];
  for (const b of batches) {
    const rs = rows.filter((r) => r.batch === b);
    console.log(`lot ${b} : ${rs.filter(lessonDone).length}/${rs.length} leçons faites — ${rs[0].grade} ${rs[0].id} … ${rs[rs.length - 1].grade} ${rs[rs.length - 1].id}`);
  }
  const used = Object.keys(labState).filter((t) => rows.some((r) => r.labs.includes(t)));
  console.log(`labos : ${used.filter(labDone).length}/${used.length} faits · leçons : ${rows.filter(lessonDone).length}/${rows.length} faites`);
}
