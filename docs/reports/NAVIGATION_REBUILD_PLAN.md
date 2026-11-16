# Navigation rebuild — plan

Written 2026-11-16 at the owner's request: « the navigation experience for both the student and the teacher must be
rebuilt in a better way regardless of the docs, also the navigation of lessons, in all the platform, for both accounts ».
Status: **PLAN — nothing here is built.** It is a proposal to decide on, section 7 lists the decisions.

## 1. What exists today (measured)

| Fact | Number |
|---|---|
| Entries in the student's menu (`data/studentNavigation.js`) | 10 |
| Entries in the teacher's menu (`data/teacherNavigation.js`) | 11 (6 on the phone's bottom bar) |
| Routes in `App.jsx` | 158 |
| Pages that list lessons, each with its own list | 7 or more: `Courses`, `MesCours`, `Explorer`, `UnitPage`, `StudentHome`, `Progression`, the teacher's lessons, the class pages |
| « Next lesson » / « previous lesson » inside a lesson | none |
| « Continue where I stopped » | none for the teacher |
| Search (`CommandPalette`) | student and public shells only, not the teacher's |

What is wrong, in one sentence each:

- **The menu is a list of rooms, not of intentions.** « المختبر », « مختبر التفكير », « كرّاسي », « فضاء الألعاب », « عرضي »,
  « مؤسستي » sit at the same level as « الدروس ». Nothing says what to do now.
- **A lesson is found seven different ways**, and none of them is organised like the school year (فصل → وحدة → درس), although
  the calendar and the learning net already hold that order.
- **A lesson is a dead end.** From inside it there is no next lesson, no « where am I in the unit », only a way back.
- **On a phone the bottom bar has six tabs** and the page's own header adds more rows; little is left for the page.
- **The lesson lives outside both spaces** (`/courses/…`), so entering one changes the frame around it.

## 2. The idea: four doors, one map, one lesson bar

1. **Four doors, named by what the person wants**, the same count on a phone and on a laptop.
2. **One map of the year** — « خريطة السنة » — is the only way lessons are listed, everywhere, for both accounts.
3. **One lesson bar** on every lesson: where I am, previous, next, back to the map.
4. **One search** for everything, in both spaces.

Everything else is reached from inside a door, never from the menu.

## 3. The student

```
phone (bottom bar, 4 tabs)                laptop (thin rail, same 4)
┌────────────────────────────────┐
│            the page            │        اليوم
│                                │        دروسي
├───────┬───────┬───────┬────────┤        أتدرّب
│ اليوم │ دروسي │ أتدرّب │  أنا   │        أنا
└───────┴───────┴───────┴────────┘
```

| Door | What it answers | What moves inside it |
|---|---|---|
| **اليوم** | « What do I do now? » ONE next step, then the week | `/espace` led by « بوصلتي », daily challenge |
| **دروسي** | « Where is lesson X? Where am I in the year? » | the year map (section 5): replaces « دروسي », « استكشف », the unit pages' lists |
| **أتدرّب** | « I want to play or train » | games, « مختبر التفكير », the Math Lab, practice by lesson |
| **أنا** | « How am I doing? » | progress, « كرّاسي », my class, account, what my parent sees |

10 entries become 4. Nothing is deleted: each page keeps its address and is reached from its door.

## 4. The teacher

```
┌────────────────────────────────┐        laptop rail
│            the page            │        اليوم
│                                │        دروسي
├───────┬───────┬────────┬───────┤        أقسامي      ● 3
│ اليوم │ دروسي │ أقسامي │ أدواتي│        أدواتي
└───────┴───────┴────────┴───────┘        ─────
                                          (avatar) حسابي · عرضي · مؤسستي
```

| Door | What it answers | What moves inside it |
|---|---|---|
| **اليوم** | « What do I teach this week, and who needs me? » per class: the lesson of the week from the school calendar, its card in one tap; answers waiting for correction | `/enseignant`, the badge of « تصحيح الإجابات » |
| **دروسي** | « Take me to lesson X » | the same year map, in the teacher's reading (taught · this week · has its board) |
| **أقسامي** | « How is 4م2 doing? » | classes, tracking, « تصحيح الإجابات », students' notebooks, the class's games |
| **أدواتي** | « I need an instrument » | Math Lab, « مختبر التفكير », « كرّاسي » |
| *avatar menu* | the account, not the work | profile, « عرضي », « مؤسستي », sign out |

11 entries become 4 plus the avatar. « تصحيح الإجابات » is no longer a menu entry: its count shows on « أقسامي » and on « اليوم ».

## 5. The year map — the one way to reach a lesson

One component, `LessonNavigator`, fed by the school calendar (`schoolCalendar.js`) and the catalogue. It replaces every
list of lessons of the platform.

```
السنة الرابعة متوسط                         🔍 ابحث عن درس
[ الفصل 1 ● ]  [ الفصل 2 ]  [ الفصل 3 ]        ← the term of today is open
┌ الأعداد الطبيعية والناطقة ──── 6 / 9 ┐
│ ✓ التعرّف على قاسم لعدد طبيعي           │
│ ✓ قواسم عدد طبيعي                      │
│ ▶ خواص القواسم            هذا الأسبوع  │   ← one line per lesson, one tap
│ ○ القاسم المشترك الأكبر                 │
└────────────────────────────────────────┘
┌ الحساب على الجذور ─────────── 0 / 6 ┐
```

- **Organised like school**: term → unit → lesson, in the order of the progression. The week's lessons are marked.
- **One line, two readings**: the student sees done · next · not yet; the teacher sees taught · this week · tools ready.
- **It opens where you are**: today's term, the current unit unfolded, the next lesson in view.
- **Earlier years are one switch away** (1AM–3AM), for revision and for a lesson's prerequisites.
- **On a phone** it is one column of the same lines; nothing else changes.

Places that become this component: the student's lessons page, « استكشف », the unit page's list, the lesson lists of the
home and of the progress page, the teacher's lessons, the lesson picker of a class, the public catalogue's list.

## 5bis. The pages behind the doors: the two homes, « دروسي », « استكشف »

What they are today (read in the code, 2026-11-16):

| Page | Today | Problem |
|---|---|---|
| Student home `/espace` | led by « بوصلتي » when open, then a folded « المزيد » holding the greeting, recent lessons, stats, daily challenge, a curriculum preview, the premium card | the base is right; the folded list is a second menu |
| Teacher home `/enseignant` | the SEATS and plan meters first, then the list of classes | it opens on the licence, not on teaching: nothing says what to teach or who needs him |
| Student « دروسي » `/espace/cours` (`MesCours`) | search, a filter by ميدان, a grid / list switch, cards | a catalogue to browse, not a path; no term, no « this week » |
| « استكشف » `/espace/explorer` (`Explorer`) | the same page again, plus the other grades | a near copy of « دروسي » (same filter, same search, same switch) |
| Teacher « الدروس » `/enseignant/cours` | it IS the student's `Explorer` component | the teacher browses a student catalogue; nothing of his classes or his tools |

**The student's home — « اليوم »: one screen, one decision.**

```
صباح الخير ياسين
┌──────────────────────────────────────────┐
│ ▶ واصل: خواص القواسم                      │   ← ONE next step, the biggest thing on the page
│   الجزيرة 3 من 8                    [ هيّا ] │
└──────────────────────────────────────────┘
هذا الأسبوع     ✓ قواسم عدد    ▶ خواص القواسم    ○ القاسم المشترك الأكبر
تحدّي اليوم 🔥 3            نجومي هذا الأسبوع ★ 12
```

The next step comes from « بوصلتي » when it is open, otherwise from the progression (the first lesson of the week not
finished). The week is three lessons, not a list. « المزيد » disappears: what it held is behind the four doors.

**The teacher's home — « اليوم »: his week, class by class.**

```
هذا الأسبوع · الأسبوع 8
┌ 4م2 ─────────────────────────────────────┐
│ الدرس: خواص القواسم        [ بطاقة الدرس ] [ حصّة القسم ] │
│ 5 تلاميذ يحتاجونك · 3 إجابات تنتظر التصحيح              │
└───────────────────────────────────────────┘
┌ 4م3 ─────────────────────────────────────┐ …
```

One card per class: the lesson of the week (from the school calendar, corrected by the teacher in one tap), two
buttons, and the two numbers that call him. The seats and the plan move to « عرضي » under the avatar; the home keeps one
thin line only when a limit is near.

**« دروسي », both accounts: the year map of section 5.** The student's opens on his grade and his week. The teacher's
opens on the grades of HIS classes, each lesson line carrying what is ready for him (card, board, memo). The grid of
cards, the filter by ميدان and the grid / list switch go: the term and the unit are the structure.

**« استكشف » stops being a page.** Its only real content — the other years — becomes the grade switch at the top of the
year map, and the search. `/espace/explorer` redirects to « دروسي ». `MesCours` and `Explorer` are deleted once the
navigator has replaced them.

## 6. Inside a lesson: never a dead end

One bar on every lesson, for both accounts, under the space's own frame:

```
‹ خريطة السنة    الأعداد الطبيعية · 3 / 9    خواص القواسم        ‹ السابق   التالي ›
```

- **Where I am**: the unit and the lesson's rank in it. Tapping the unit opens the map on that unit.
- **Previous · next** follow the progression, across units.
- **The teacher's bar adds his tools** — it is today's `LessonToolsBar`, kept, with the position and previous / next added.
- **The lesson opens inside the person's own space**: the address `/courses/…` stays (links, shares, the public page keep
  working), the frame around it is the student's or the teacher's.
- A page a phone cannot open is shown closed with « على الحاسوب », as on the pilot: never a link to a refusal.

## 6bis. The look: colours, shapes, sizes

Mock-up to open in a browser: `docs/reports/mockups/navigation-look.html` (a static drawing, not the product).

Measured today on the two menus, the two homes and the lesson lists: **12 colour families** (slate, blue, indigo, amber,
emerald, teal, violet, rose, orange, sky, red, cyan), **13 gradients**, **5 corner radii**. There are no design tokens:
`tailwind.config` names three accent colours and every page picks its own.

**Nine colours, no other, in the navigation and its pages:**

| Token | Value | The ONLY use |
|---|---|---|
| ink | `#0B1B3F` | text; the teacher's active door and main button |
| accent | `#3B5BDB` (the logo's blue) | the student's active door, links |
| now | `#F59E0B` | the next step, « this week » |
| done | `#12A36B` | finished |
| alert | `#D6455D` | « needs you », a count waiting |
| muted · line · page · surface | `#5B6785` · `#E3E8F2` · `#F6F8FC` · `#FFFFFF` | second text, borders, behind the cards, cards |

Rules:

1. **Colour is meaning, never decoration.** Amber = now, green = done, red = needs you; none is used for anything else.
2. **One filled block per page**: the student's next step, the teacher's first button. The rest is white and lines.
3. **A state is never colour alone**: ✓ ▶ ○ always go with it.
4. **No gradient, no halo** in the navigation and its pages (the owner already refused them in the teacher's space).
   The game world inside a lesson keeps its own palette: it is a place, not a menu.
5. **Same skeleton for both accounts, two voices**: the student's active door is the brand blue, the teacher's is ink.
6. **Finger first**: every target at least 44 px; text at least 14 px on a phone; four tabs with their names always shown.
7. **Two shapes**: a card with 16 px corners, a round pill. One light shadow or none.
8. **The tokens are code**: one file of CSS variables / Tailwind theme names; a check forbids a raw colour class in the
   navigation and its pages, so the count cannot climb back to twelve.

## 7. Decisions for the owner

| # | Question | My recommendation |
|---|---|---|
| N1 | The four doors and their names, for each account | As in sections 3 and 4 |
| N2 | Where do games sit for the student: their own door, or inside the third door? | **DECIDED (owner, 2026-11-16): the third door is named « أتدرّب »**, not « ألعب وأتدرّب ». Games are reached inside it; the door's name speaks of training |
| N3 | Does the public catalogue `/courses` use the year map too? | Yes for the list; its marketing header stays |
| N4 | Before or after the lesson v2 rollout? | The lesson bar (section 6) BEFORE lesson 2: every rebuilt lesson sits under it. The rest in parallel |
| N5 | Laptop: a thin rail with icons and names, or today's wide sidebar? | Thin rail: the page gains about 180 px |
| N6 | The teacher's « اليوم » needs, per class, where the class is in the progression. Set by the teacher, or guessed from the date? | Guessed from the calendar, corrected by the teacher in one tap |
| N7 | The teacher's home drops the seats and plan meters (they move to « عرضي »)? | Yes, with one warning line near a limit |
| N8 | « استكشف » disappears as a page (other years = a switch of the year map)? | Yes |
| N9 | The look of section 6bis: nine colours, the student in brand blue and the teacher in ink, no gradient? | Yes — open the mock-up and say what you would change |

## 8. Build order

| Step | What | Done when |
|---|---|---|
| 0 | Decisions N1–N9 | the owner has answered |
| 1a | The tokens of section 6bis as code, and the check that forbids a raw colour in the navigation | the check passes on the new shells |
| 1 | The model: ONE file describes the doors per account and what each contains; both menus, the bottom bar and the search read it | no menu entry is written anywhere else |
| 2 | `LessonNavigator` and the year map, student and teacher readings | every lesson of 4AM is reached in two taps from « دروسي » on a phone and on a laptop |
| 3 | The lesson bar with previous / next, on every lesson; lessons inside the person's space | from any lesson, the next one is one tap away |
| 4 | The two shells: four doors, the avatar menu, search in the teacher's space | the old menus are deleted |
| 5 | Replace the seven lists by the navigator; old addresses redirect | no second list of lessons exists in the code |
| 6 | The two homes « اليوم » (section 5bis): the student's one next step and week; the teacher's week class by class | a student starts his next step in one tap; a teacher reaches this week's lesson card in one tap |
| 7 | Walks at 390×844, 800×370, 1366×768; contract `docs/architecture/NAVIGATION.md`; the superseded docs marked | the walks pass and the docs match |

How it will be judged:

- any lesson in **two taps** from anywhere; the next lesson in **one**;
- **four** entries on a phone, for both accounts;
- **one** list of lessons in the code;
- no tap that lands on « open it on a computer ».

## 9. Risks

- **Habits.** Teachers who know today's menu lose their landmarks once; old addresses must redirect and the first visit
  needs a ten-second tour.
- **The teacher's « اليوم » is only as good as the progression.** A class that is late or ahead makes it wrong until the
  teacher corrects it (decision N6).
- **Scope.** Seven lists and 158 routes: step 5 is the long one. Steps 1–3 already change what people feel.
- **Not measured**: how people actually move today. There is no navigation analytics in the code, so this plan rests on
  reading the product, not on usage data.
