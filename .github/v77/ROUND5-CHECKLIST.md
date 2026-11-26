# V77 Correction Round 5

Baseline `a1f21b1`, draft PR #2. **Pass** denotes verified behavior in the stated scope. **Need work** identifies incomplete functionality or verification. Physical phone and WebView behavior are **Not tested**.

| ID | Status | Evidence or remaining work |
| --- | --- | --- |
| R5-01 | Pass | Route key and start ID persist. Flygon and Lucario routes, owned identity and no unsupported direct option covered. |
| R5-02 | Pass | Selected route feeds the form, move scheduling, evolution resources and trainer checkpoints. Standalone and imported team regression suites. |
| R5-03 | Pass | Native Flygon sequence and direct Golduck level range. Distinct pre-evolution and direct learner sets. |
| R5-04 | Pass | Collapsed cards show an earlier acquisition species and retain the intended Pokémon. |
| R5-05 | Pass | Select the exact route in the candidate preview before confirming it. |
| R5-06 | Pass | Desktop and mobile contextual map navigation. Desert Resort and Village Bridge through normal UI. |
| R5-07 | Pass | Compact source, method, encounter range and timing in planner route cards. |
| R5-08 | Pass | Separate source availability and later evolution gates. Catalog entries still use documented restrictions where no route is verified. |
| R5-09 | Pass | Browser sees more than 24 candidates. Progressive rendering preserves access to the entire ranked pool. |
| R5-10 | Pass | Rankings change when one or more planned members change. Regression covers a full and incomplete party. |
| R5-11 | Pass | Historical type popup with any/all, search filtering, badges and a clear action. Measured input/filter alignment at five widths. |
| R5-12 | Pass | Full-pool Black 2 browser tests filled both modes for Golduck and Arcanine. Additional tests cover zero through four recorded actual moves. |
| R5-13 | Pass | Feasible combinations under a bounded search. Observed one Water move for Golduck and one Fire move for Arcanine in the recorded Final builds. |
| R5-14 | Pass | Team-aware auto-fill and re-ranked suggested changes. Existing manual moves stay in place absent acceptance. |
| R5-15 | Pass | Water weakness, a resistant alternative, dual typing and defensive compensation exercised in focused assertions. Exact outcomes remain Battle’s responsibility. |
| R5-16 | Pass | Editable During and Final search, substring filtering, focus selection, blank browsing and keyboard selection. |
| R5-17 | Pass | Fly discoverable for the planned Flygon from Trapinch. Current, after-evolution and later-machine conditions are distinct. |
| R5-18 | Pass | Historical statistics and move type/category shown in the editor and result rows, with independent power and accuracy changes. |
| R5-19 | Pass | Visible current title after changes, map/Pokédex return and plan refresh. |
| R5-20 | Pass | Measured Lock on the left and Reset on the right at 320, 360, 390, 412 and 1280 px. |
| R5-21 | Pass | Planner prefers the same official artwork source as Pokédex with existing sprite fallback. |
| R5-22 | Pass | Paired artwork and names use equal grid rows, with reserved badge space and a centered progression arrow. |
| R5-23 | Pass | Four aligned slots retain unchanged rows and show empty-to-planned changes. |
| R5-24 | Pass | Browser touch hold opens the collapsed card’s Pokédex action and retains editor position. |
| R5-25 | Pass | Candidate comparison and return verified with mouse and emulated touch. Candidate Pokédex uses the same contextual path as collapsed cards. |
| R5-26 | Pass | Dialog opened with the mouse or emulated finger still down, and release left the action unselected. |
| R5-27 | Pass | Web selection is limited to editable controls. Native WebView selection UI is Not tested. |
| R5-28 | Pass | Browser replaced a comparison slot while the popup remained open. |
| R5-29 | Pass | Browser retained selections on Close and opened the current pair at results with contextual return. |
| R5-30 | Pass | Independent coverage text and state colors. |
| R5-31 | Pass | Tests distinguish uncovered, partially compensated and immune switch-in cases. Coverage and recommendation scoring share defensive conditions. |
| R5-32 | Pass | Team Progress renders three and two equally sized counters and follows the selected path. |
| R5-33 | Pass | Two Fire Stone claims, projected blocked demand and a direct alternative covered by browser and unit tests. Rollback to known inventory remains outside current save evidence. |
| R5-34 | Pass | Combined TM/HM browser search retains the Fly identifier and historic stats. |
| R5-35 | Pass | Two-line result layout tested with an actual machine entry and visual checks. |
| R5-36 | Pass | Contextual return from Battle, 6v6, Pokédex and Planner. Dedicated More action returns to the More menu. |
| R5-37 | Pass | Black 2 Emboar/Hammer Arm shown as a Reminder move. Original games use their documented location. Earlier and later generations preserve their prior evidence unless a Reminder rule is known. |
| R5-38 | Need work | Hosted, owner-only preview on a distinct domain with a build identifier and separate offline cache. Continuous publication from GitHub has no configured connection. Samsung verification is Not tested. |

See the [Round 5 report](REPORT.md#correction-round-5) for the release verification and six user acceptance groups.
