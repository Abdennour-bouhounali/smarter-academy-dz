<?php

// Paths for the curriculum export handshake between the Node source of truth
// (packages/core/curriculum/coursesData.js) and the Laravel importer. Both are
// env-overridable for deployments whose directory layout differs from the
// monorepo default (apps/api three levels below the repo root).
return [
    // The server-side half of dormant-grade isolation
    // (docs/ALGERIA_MIGRATION_AUDIT.md §15). Must stay in lockstep with
    // packages/core/curriculum/activeGrades.js's ACTIVE_GRADE_IDS — that is
    // the frontend catalogue/registry gate, this is the API gate (a
    // motivated client can call /api/v1/lessons/{lessonCode}/* directly
    // with a known French lesson code, bypassing the frontend entirely).
    // Empty for the same reason as the frontend list: no Algerian grade
    // exists yet (blocked on the official curriculum, roadmap Phase 7).
    //
    // 'enforce_active_grades' defaults OFF in the `testing` environment
    // (see phpunit.xml): the inherited French Feature test suite creates
    // its own ad hoc grade fixtures ('seconde', '3e', even placeholders
    // like '01') to test publication/tier/entitlement logic that has
    // nothing to do with grade activation — this gate is an Algeria-only
    // addition on top of that suite, not something those tests were
    // written to account for. Dormant-grade isolation itself has its own
    // dedicated coverage (registry.test.js, check-dormant-isolation.mjs,
    // check-routes.mjs) rather than being implicitly exercised by every
    // unrelated Feature test.
    'enforce_active_grades' => env('CURRICULUM_ENFORCE_ACTIVE_GRADES', true),
    'active_grades' => array_filter(explode(',', env('CURRICULUM_ACTIVE_GRADES', ''))),

    'export_script_path' => env(
        'CURRICULUM_EXPORT_SCRIPT',
        base_path('../../packages/core/curriculum/exportCurriculum.mjs')
    ),
    'export_output_path' => env(
        'CURRICULUM_EXPORT_OUTPUT',
        base_path('../../packages/core/curriculum/.generated/curriculum-export.json')
    ),

    // Second export, même poignée de main : le REGISTRE DE CONTENU (modules
    // de leçon + exercices de pratique). Séparé du catalogue parce que la
    // source est différente — les lesson.config.js et content/practice, pas
    // coursesData.js.
    'registry_export_script_path' => env(
        'CONTENT_REGISTRY_EXPORT_SCRIPT',
        base_path('../../packages/core/curriculum/exportContentRegistry.mjs')
    ),
    'registry_export_output_path' => env(
        'CONTENT_REGISTRY_EXPORT_OUTPUT',
        base_path('../../packages/core/curriculum/.generated/content-registry-export.json')
    ),
];
