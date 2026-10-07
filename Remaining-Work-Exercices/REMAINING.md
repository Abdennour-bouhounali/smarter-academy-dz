# What remains — 34 lessons (units 8 → 14)

Order to keep (owner, 2026-10-06): one lesson at a time, oldest lesson on the platform first =
`content/practice/active.json` order. Each lesson: 50 sheets rewritten in place (ids kept), level 5 = 10 new
« الوضعية الإدماجية (08 ن) », official papers word for word with the official solution, « على منوال BEM <year> »
for the rest.

## Lessons still on the classic practice page

| # | Unit | Lesson | Official annals it owns (session · ن · exam page · solution pages) |
|---|---|---|---|
| 1 | 8 الإحصاء | takrar-mujamma | — |
| 2 | 8 | mada-wasit-mutawassit | — |
| 3 | 8 | majdulat-ihsaiya | — |
| 4 | 8 | qiraat-wadiyat-ihsaiya | — |
| 5 | 8 | wadiya-idmajiya-ihsa | — |
| 6 | 9 خاصية طالس | talis-hisab-atwal | 2008 I-3 (03) 1R→1L · 5–7; 2010 I-4 (03) 2R · 12–13; 2013 I-3 (02) 3R · 21–24; 2020 I-3 (03) 5L · 48–49; 2023 I-3 (03) 6L · 55–57 |
| 7 | 9 | aksiya-talis | 2007 I-4 (03,5) 1R · 1–4; 2015 I-4 (02,5) 4R · 29–31; 2017 I-4 (02) 4L · 36–39; 2018 I-3 (03) 5R · 40–43 |
| 8 | 9 | inshaat-talis | — |
| 9 | 9 | wadiya-idmajiya-talis | 2016 II (08) 4L · 32–35 |
| 10 | 10 حساب المثلثات | nisab-muthallathiya | 2011 I-3 (03) 2L · 14–16; 2018 I-4 (03) 5R · 40–43; 2019 I-3 (03) 5L · 44–47; 2021 I-3 (03) 6R · 50–52 |
| 11 | 10 | hasiba-muthallathiya | — |
| 12 | 10 | alaqat-muthallathiya | — |
| 13 | 10 | tarrid-muthallathiya | 2010 II (08) 2R · 12–13; 2014 I-3 (03) 3L · 25–28 |
| 14 | 10 | wadiya-idmajiya-muthallathat | 2025 II (08) 7L→8 · 61–62 |
| 15 | 11 الأشعة والانسحاب | insihab-shuaa | — |
| 16 | 11 | shuaayn-mutasawiyayn | — |
| 17 | 11 | majmu-shuaayn | — |
| 18 | 11 | barahin-ashia | 2016 I-4 (03,5) 4R→4L · 32–35 |
| 19 | 11 | wadiya-idmajiya-ashia | — |
| 20 | 12 الأشعة في معلم | murakkibata-shuaa | — |
| 21 | 12 | hisab-murakkibatay | 2013 I-4 (03,5) 3R · 21–24; 2020 I-4 (03,5) 5L · 48–49; 2021 I-4 (03) 6R · 50–52 |
| 22 | 12 | muntasaf-masafa | 2014 I-4 (03) 3L · 25–28; 2017 I-3 (04) 4L · 36–39; 2019 I-4 (03,5) 5L · 44–47; 2024 I-3 (03) 7R · 58–60; 2025 I-3 (03) 7L · 61–62 |
| 23 | 12 | ithbat-khawas-maalam | 2010 I-3 (03) 2R · 12–13; 2011 I-4 (03) 2L · 14–16; 2012 I-4 (03) 2L · 17–20; 2022 I-4 (03) 6L · 53–54 |
| 24 | 12 | wadiya-idmajiya-maalam | — |
| 25 | 13 الدوران والزوايا والمضلّعات | mafhum-dawaran | 2009 I-3 (02,5) 1L · 8–11 |
| 26 | 13 | khawas-dawaran | — |
| 27 | 13 | zawiya-muhitiya | 2012 I-3 (03) 2L · 17–20; 2015 I-3 (03) 4R · 29–31 |
| 28 | 13 | mudalaat-muntazama | — |
| 29 | 13 | wadiya-idmajiya-dawaran | — |
| 30 | 14 الهندسة في الفضاء | kura-julla | — |
| 31 | 14 | misaha-hajm-kura | — |
| 32 | 14 | maqati-mustawiya | — |
| 33 | 14 | takbir-tasghir | — |
| 34 | 14 | wadiya-idmajiya-fada | — |

Full index: `docs/sources/4am/bem-practice/annals-index.md`. Units 8 and 14 own no annals at all (statistics and
space geometry never appear in BEM 2007–2025): only « على منوال » + adapted sheets; the badge names the
session whose FORMAT is copied (decide with the owner if a different label is wanted for those two units).
Units 9–13 are geometry: most official papers have a FIGURE to redraw as `statement.figure` (GeoFigure,
`validateGeoFigure` + `figureQuality`, memory rule « figures du manuel : analyser puis redessiner »).

## Next step when resuming

1. Write `docs/sources/4am/bem-practice/rollout/unit8/brief-authors.md` (same pattern as `unit6` / `unit7`).
2. Lesson by lesson: one author agent (prompt pattern = unit 7), then the audit:
   ```bash
   node scripts/validate-exercises.mjs            # regenerate index.generated.json
   npx vitest run --dir scripts                   # answer oracle
   node scripts/check-textbook-coverage.mjs       # must stay 0 ✗
   Remaining-Work-Exercices/tools/switch.sh <lesson>   # exam-style.json + registry + cache + student e2e
   ```
   `switch.sh` needs a student token in `$QA_DIR/tok` (qa-eleve; create with tinker, revoke after:
   tokens named `e2e-bem-*`). `tools/teacher-sheets.mjs` and `tools/one-sheet.mjs` take screenshots through the
   teacher view (token of qa-prof).
3. Update the status table in `docs/architecture/EXERCISE_CONTRACT.md` when a unit is finished.

## Owner answers (2026-10-07) — done

1. **qasim-adad-tabii published** (local DB `publication_status = published`); student e2e 108/108.
2. **Textbook exercise 21 corrected in the mushkilat-jumla lesson** (EA = 6, AB = 4, DC = 5, perimeter 25 →
   x = 10, y = 6), figure redrawn, correction recorded in `docs/sources/4am/unit5/extraction.json`
   (`correction`, decidedBy owner) and its builder.
3. **Both decimal separators**: « 1.5 » and « 1,5 » (and « 1٫5 ») are now graded `correct` (no more « بكتابة
   أخرى »), JS and PHP evaluators + shared fixtures. Statements keep the house comma.

## Open questions for the owner

1. Counting choices made by authors (each can be reversed): BEM 2007 II « 15x > 12x + 900 » counted in
   tarrid-taalufi; graph readings around the intersection counted in tafsir-bayani-jumla; discount coefficient
   (20 % → ×0,8) counted in dala-khattiya, percentage rates in tatbiqat-tanasub.
2. Some official sheets count nothing for their lesson as printed (BEM 2023 I-2 in nashr-tabsit, BEM 2023 I-4
   in tamthil-bayani-taalufi): their steps are self-marked or belong to another lesson.
3. BEM 2018 II and 2017 II restart step numbers at 01 in their second part; the platform needs increasing steps,
   so they are numbered 01–02 then 03–04 with the « الجزء الأول / الثاني » titles kept.

## Not done (by design)

No commit, no push, no deployment. The PDFs in `docs/official-BREVET-exams/` are never to be `git add`ed (the
solutions file has no `.pdf` extension, so `.gitignore` misses it).
