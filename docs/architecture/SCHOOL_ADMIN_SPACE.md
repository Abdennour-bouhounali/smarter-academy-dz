# « فضاء الإدارة » — the school administration space

> Status (2026-10-26): **Phases 0–2 implemented** (contract, data model, the
> `school_admin` role and its gate, the privacy gate `SchoolAccess`, the
> director's home `/idara`, the platform admin's « Établissements »). Every
> section marked `Planned` is not built yet. The code is the source of truth.

A **school** (« المؤسسة », a متوسطة) is a first-class object: its classes, its
teachers, its students, and one **director** (« المدير ») who manages them,
follows their learning, prints reports and projects them in meetings. This is
« Model C » of `TEACHER_CLASSROOM_ARCHITECTURE.md` §6, which was planned and is
now being built here.

## 0. Owner decisions (2026-10-26)

| # | Decision |
|---|---|
| D1 | **The school buys a licence** of student seats; its students get full access through it; a teacher's own seats are not consumed by a covered school class. (`Planned` — phase 7.) |
| D2 | **The director may enrol a student directly** (imported roster → class). The school's institutional consent is recorded at enrolment; the student confirms once at first login (non-blocking card, like the teacher consent). (`Planned` — phase 3.) |
| D3 | **One school role: the director.** No deputy, counselor or secretary for now. `school_staff.school_role` exists so a second role is a value, not a migration. |
| D4 | **Teacher activity is shown as FACTS** (classes, students, lessons opened, interventions, last activity) — never a score, never a ranking — and **the teacher sees exactly what the school sees** about them. (`Planned` — phase 3.) |

## 1. Vocabulary

| Arabic (UI) | Means | Code / DB |
|---|---|---|
| **المؤسسة** | the school | `schools`, `School` |
| **المدير** | the school's director, an account with `role = school_admin` | `User::ROLE_SCHOOL_ADMIN`, `school_staff` |
| **فضاء الإدارة** | the director's space | route `/idara`, API `/api/v1/school/*`, i18n namespace `idara` |
| **الفصل** (term) | one of the three terms of the school year | `school_terms` |
| **القسم** | unchanged: a teacher's class (`TEACHER_CLASSROOM_ARCHITECTURE.md` §0); a class of a school carries `classrooms.school_id` | `classrooms` |

The platform admin's section is « المؤسسات » at `/admin/etablissements`: the admin
panel is Arabic like the rest of the product, only its URL paths are French
(`/admin/enseignants`, `/admin/classes` — `ADMIN_PANEL_ARCHITECTURE.md` §33.0).

## 2. Who exists — one more role

```text
role          registers via                          lands on   gate
school_admin  created by the platform admin only     /idara     can:school
```

- `school_admin` is **not** self-registerable (`User::SELF_REGISTERABLE_ROLES`
  is unchanged). Only the platform admin creates the account, when appointing
  the director of a school (§5).
- It is **not** `admin`. `can:admin` is the platform's back-office and a
  director never passes it; an admin never passes `can:school`.
- Three authorization layers, in this order, on every `/school` request:

```text
role         Gate 'school'          route group can:school → 403 for admin, teacher, student, parent
membership   SchoolAccess::schoolOf an ACTIVE school_staff row on an ACTIVE school → 403 reason no_school
entitlement  the school's licence   Planned (phase 7)
```

- A director belongs to **one** school (`school_staff.user_id` is unique). The
  school is never read from the request: it is resolved from the director
  (`SchoolAccess::schoolOf`). There is therefore no school id to tamper with.
- The director's e-mail is marked verified at creation (the platform admin
  typed it and hands the credentials over); `email.verified` still guards the
  routes.

## 3. Data model

| Table | Key columns | Rules |
|---|---|---|
| `schools` | `name` (Arabic), `wilaya`, `commune`, `code` (unique, optional — the ministry's code), `status` `active\|suspended\|archived`, `current_academic_year` | created and edited by the platform admin only; suspending closes `/school` for its director (`no_school`) and touches no class or student |
| `school_staff` | `school_id`, `user_id` (**unique**), `school_role` (`director`), `status` `active\|revoked`, `appointed_by`, `appointed_at`, `revoked_at` | revoking keeps the row and the account; re-appointing the same account to the same school reactivates the row |
| `school_teachers` | `school_id`, `teacher_id`, `status` `active\|left`, `joined_at`, `left_at`; unique `(school_id, teacher_id)` | `Planned` use — phase 3 (the teacher's consent to join a school) |
| `school_terms` | `school_id`, `academic_year`, `term` 1–3, `starts_on`, `ends_on`; unique `(school_id, academic_year, term)` | `Planned` use — phase 3 (reports per term) |
| `classrooms.school_id` | nullable FK, `nullOnDelete` | a class OF a school. The owner stays `teacher_id` (§4) |
| `classroom_memberships.school_consent_at` / `school_consent_by` (`student\|school`) | the consent that lets the SCHOOL read this student one by one | null = the school does not read the student individually (§4) |

## 4. Privacy — the school is a NEW reader

The teacher contract (`TEACHER_CLASSROOM_ARCHITECTURE.md` §2 « Consent and what
the teacher may read ») stays as it is. The school adds one gate of its own.

**`Domain\School\SchoolAccess`** — the ONE school → student gate and the ONE
school-facing identity:

- `schoolOf($user)`: the director's active school, otherwise
  `SchoolException(no_school)` → 403.
- `activeStudent($school, $studentId)`: the student is an **active** member of
  an **active** class whose `school_id` is this school, **with
  `school_consent_at` set**; otherwise **404** (the school does not learn that
  the student exists or was a member).
- `consentedMemberships($school)`: the query every aggregate starts from.
- `identity()`: `{id, firstName, lastName}` — **never the e-mail**, like
  `ClassroomAccess::identity()`.

**Consent.** A student who joined a teacher's class consented to *the teacher*.
When a class becomes a school class, its existing members are **not** readable
by the school one by one until they confirm (`school_consent_by = student`) or
the director enrols them (`school`, D2). Aggregates count consented members
only. (The confirmation card and the enrolment flow are `Planned`, phase 3.)

**Classes stay owned by their teacher.** `school_id` adds a reader, never a
second owner. `ClassroomPolicy` is unchanged: a director never passes it and
never uses a `/teacher` route.

**No averages.** Every school figure about learning is a **distribution**
(counts by state), never a mean — the rule of `TEACHER_CLASSROOM_ARCHITECTURE.md`
§4 (2026-09-29) applies to the school too.

**Locked by `SchoolPrivacyContractTest`**: every `/school` read, as the
director, carries no `email` key and no student address at any depth; every
`/school` route answers 403 to an admin, a teacher, a student and a parent, and
to a director whose appointment was revoked or whose school is suspended; a
non-consented member is not counted. **Every new `/school` read is added to
`schoolReads()` in that test.**

## 5. The platform admin — « المؤسسات »

`/admin/etablissements` (list, « مؤسسة جديدة » in a modal) and
`/admin/etablissements/:id` (detail), in the sidebar group « الأساتذة » under
« الأقسام » (`data/adminNavigation.js`). The pages render a refusal from its
`reason` (`admin:schools.errors.*`); `services/admin/adminClient.js` carries the
`reason` on every admin error since 2026-10-26.

| Section | What the admin does |
|---|---|
| المعلومات | name, wilaya, commune, code, current academic year; « إيقاف » / « تنشيط » / « أرشفة » |
| المدير | **« تعيين المدير »**: first name + family name (Arabic, `PersonName`), e-mail → a new `school_admin` account, e-mail verified, with a **one-time password shown once** in a dialog with « نسخ » (17 characters, two « بطاقات الدخول » passwords joined: `kmar4827-tbqe5513`; hashed, never readable again; `Cache-Control: no-store`). **« سحب التعيين »** revokes the appointment and the director's tokens (the account stays). An e-mail that already has an account is refused (`email_taken`): a teacher's account is never turned into a director's, it would orphan its classes. One director per school: appointing while one is active is refused (`director_exists`) |
| Counts | active classes, teachers (read-only) |

API (`can:admin`):

```text
GET   /admin/schools[?search=&status=]        GET /admin/schools/{id}
POST  /admin/schools                          PATCH /admin/schools/{id}
PATCH /admin/schools/{id}/status {status}
POST  /admin/schools/{id}/director {firstName, lastName, email}   → {director, password}  (no-store, throttle 10/min)
DELETE /admin/schools/{id}/director
```

Logged by `ActivityLogger`: `school.created`, `school.updated`,
`school.status_changed`, `school.director_appointed`, `school.director_revoked`
(ids and names only — never the password).

## 6. The director's space `/idara` (Arabic, RTL)

Screens: **tablet and laptop** (root `CLAUDE.md`), plus the projector for the
meeting view. Lazy route group, `SchoolLayout`, i18n namespace `idara` loaded on
demand — nothing enters the entry bundle (`BUNDLE_BOUNDARIES.md`).

```text
/idara                      لوحة المؤسسة      the school, its year, counts            built (phase 1)
/idara/aqsam                الأقسام           classes per grade, teacher, members     Planned (phase 3)
/idara/asatidha             الأساتذة          attach, assign, activity facts (D4)     Planned (phase 3)
/idara/talamidh             التلاميذ          roster import, enrolment, transfer, cards Planned (phase 3)
/idara/talamidh/:id         ملف التلميذ       reuses ProgressDetail.jsx                Planned (phase 4)
/idara/kafaat               الكفاءات          school × الكفاءة distribution per class  Planned (phase 4)
/idara/taqarir              التقارير          catalogue, snapshots, print, export      Planned (phase 5)
/idara/ijtimaa/:snapshotId  وضع الاجتماع      projection, « إخفاء الأسماء »           Planned (phase 6)
```

API (`auth:sanctum` + `account.active` + `email.verified` + `can:school`):

```text
GET /school/overview   → {school, counts: {classes, teachers, students}}   (students = consented active members)
```

## 7. Planned phases

| # | Phase | Contents |
|---|---|---|
| 3 | Structure and people | terms; teachers join the school (teacher consent, D4 page « ما تراه إدارتك »); classes attached; roster import (validate → preview → commit, matched on name + birth date); direct enrolment (D2) and transfer under the one-class rule; login cards and parent QR cards (reusing `StudentCredentials` and the parent cards) |
| 4 | Tracking | `SchoolProgressService` over the existing tables (`student_learning_point_progress`, `student_lesson_progress`, `study_time_days`) — distributions only, constant query count per class (scale test) |
| 5 | Reports | one builder per report type, versioned payload, frozen `school_report_snapshots` for term meetings, A4 print (`[data-school-print]` portal), CSV/XLSX export behind `reports.export` |
| 6 | Meeting view | full-screen projection like `ChallengeDisplayPage`, keyboard / clicker, « إخفاء الأسماء » on by default for grade and school reports |
| 7 | Licence (D1) | `school_licences`, `SchoolCoverage` (allow reason `school_licence`, precedence `activation_code > school_licence > teacher_subscription`), `SchoolCapacityService` |

## 8. Files

- API: `app/Domain/School/{SchoolAccess,SchoolException,SchoolService,SchoolOverviewService}.php`,
  `app/Models/{School,SchoolStaff,SchoolTeacher,SchoolTerm}.php`,
  `app/Http/Controllers/Admin/AdminSchoolController.php`,
  `app/Http/Controllers/School/SchoolHomeController.php`,
  migration `2026_10_26_000001_create_school_tables.php`.
- Web: `components/layout/SchoolLayout.jsx`, `pages/school/SchoolHome.jsx`,
  `services/schoolService.js`, `i18n/locales/ar/idara.json` (on demand) +
  `common.apiErrors.idara` (entry), `pages/admin/schools/{SchoolList,SchoolDetail}.jsx`,
  `services/admin/schoolService.js`, `admin.json › schools` and `nav.schools`;
  role landing in `HomeRedirect`, `Login`, `AuthGoogle`, `CompleteName`.
- Deployment: `php artisan migrate` (additive migration, no hand-written SQL).
  The entry bundle measured 234.3 KB gzip after this phase (budget 245).
- Tests: `tests/Feature/SchoolAdminTest.php`, `tests/Feature/SchoolPrivacyContractTest.php`.
