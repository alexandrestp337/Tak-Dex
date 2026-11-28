# V78 DEV4 RC1 implementation and acceptance

The consolidated DEV4 assignment starts at DEV3 RC1, `c939201fe4590a329dc9a226688c617cb8331e95`, on `v78-development`. Review is in [draft PR #6](https://github.com/alexandrestp337/Tak-Dex/pull/6). The [private preview build stamp](https://tak-dex-v77-development.freeclout8.chatgpt.site/preview-build.json) holds the delivered GitHub SHA. The Web cache namespace is `takdex-v78.0.0-dev4-rc1`.

## Implementation and audit ledger

| Scope | Status | Evidence and behavior |
| --- | --- | --- |
| WEB-003 · Themes | Implemented | The secondary fill was calculated against the dark root palette. It now resolves on the active body theme. Selected foreground, light semantic text, control outlines and keyboard focus have theme-scoped values. Shared geometry stays compact. |
| WEB-012 · Maps | Implemented | The listbox formerly ignored arrows and Enter always opened the first result. Arrows now move the active option, Enter uses that option, Escape dismisses the list, Tab moves on, and the input retains keyboard focus. A live region reports result counts and selection. Late-loaded results preserve the active option if still present. |
| 6v6 prose | Implemented | Removed the standalone two-turn paragraph. The existing chance, uncertainty, damage rolls and immediate KO output remain available on the cards. |
| Filters and selectors | Implemented | A shared funnel and clear header use neutral, open and active states. The Change Pokémon diamond was still in Web. It now uses the existing funnel and keeps selected chips and match-all. The move editor colors the opened planned card and shell, with a neutral unfocused search and neutral actions. Evolution and acquisition share a sized control frame and chevron artwork. |
| Acquisition | Implemented · grouped evidence preserved | DEV3 already grouped the same area and used independent location links and exact selection where encounter methods differ materially. DEV4 aligns recommendation and preview details left and keeps deadline tone separate from actual availability. The verified Black 2 Baltoy source remains Relic Castle’s Volcarona chamber after Clay, via Relic Passage. Claydol can evolve at level 36. Before the fifth badge, a later planning deadline can include this route while actual progress still shows it as upcoming. |
| Explicit plan membership | Implemented | Initial slot creation no longer copies the actual roster. The user can add an owned Pokémon from an empty slot or choose a target. Intentional independent During and Final selections persist together, with active-stage moves, locks, acquisition, deadlines and team analysis. A distinct Remove action uses a confirmation, preserves the other stage and leaves the actual roster intact. Legacy Patrat records are retained. Earlier seeding used `autoOwnedPending` as a suggestion-generation marker, so it cannot distinguish deliberate ownership from a migrated plan or an earlier Reset. |
| Type-based replacement evaluation | Implemented · terminal family rule retained | Species-stage comparisons use historical typing for defensive coverage and potential STAB, with stats and route feasibility scored separately. Assumed learnset coverage and offensive ability bonuses have been removed here. Move analysis still uses the move engine. The family index already derives terminals from parent links and retains manual earlier-stage choices. |
| Move eligibility and warnings | Implemented | Selection and commit validation exclude moves already assigned in that stage, including the highlighted move. The existing Keep route separately validates retention. A downgrade considers the actual outgoing planned move, known reliable team answers, the individual’s remaining STAB, HM assignment, and combat merit. It appears once in the app dialog and is no longer rendered from stored comparison metadata. HM scoring separates practical strength from utility and gates weaker Final replacements. |
| Search and Move Checker | Implemented | Pokédex, Team Builder, Battle, 6v6, custom opponent, Planner and move text lookups reuse normalized exact/prefix/substring ranking where applicable. Suggestions already opened Move Checker and retain that behavior. The old View move button, duplicated heading history line and outdated source presentation were still in Web. The details use location text links with game, method, cost and conditions. Provenance stays in the underlying data. |

Independent stage selections are an additive field in version 2 team exports. The canonical `slots` retain Final entries and the supplemental `independentSlots` contains the independent During entry where applicable. Existing imports retain their moves and paths, and their prior deadline initializes both stages. The DEV1 transaction and read-only save parser are unchanged. Android V10 and physical handset behavior remain deferred to DEV8.

## Verification

- Syntax checks for modified JavaScript and `git diff --check` passed.
- `node --test .github/v76/battle.test.cjs .github/v78/dev3-battle.test.cjs .github/v78/import.test.cjs` passed 33 cases, including independent-stage validation and the existing Gen V roll fixtures.
- DEV2 integration Chromium checks passed for trade-route import/export, same-PID evolution after party reorder, lock and moveset preservation, and contextual map navigation from Pokédex, tutor, TM and HM.
- DEV3 browser checks at 360 CSS px in light and dark passed after updating the test to confirm inside the app dialog. The browser measured acquisition and move-editor geometry and exercised exact Move Checker return state.

- DEV4 Chromium passed at 360 and 412 CSS px in both themes. It measured funnel and input geometry, active borders, and secondary text contrast. It exercised same-stage duplicate exclusion, Clear cancellation, independent During and Final deadlines, empty-slot sync, manual add, reload, removal, v2 import validation, Move Checker query ordering and map keyboard selection.
- A focused Black 2 check confirmed equal type coverage for Purrloin and Umbreon. The Baltoy preview remained before the Final deadline with three actual badges and showed the Relic Castle route and the Clay requirement.
- The targeted 6v6 check kept the 12.5% green OHKO notice and live Gyro Ball results with the explanatory paragraph removed. The DEV1 Chromium recovery check passed malformed JSON rejection and the Defense Curl export/import case. An offline Chromium reload passed with the new worker, versioned assets and WHOASP footer.
- Manual acceptance remains for the exact weaker-HM examples, indistinguishable duplicate party entries, and the user's Claydol plan. Capture-to-evolution reconciliation and same-stage duplicate moves were exercised with equivalent synthetic teams. If multiple actual Pokémon cannot be distinguished by a durable identity, an explicit choice preserves the plan and avoids automatic rebinding.

## Private acceptance checklist

1. In Black 2, open an empty plan slot, choose an actual party Pokémon for During game, then plan an unrelated Final target. Change the actual party, reload, and verify each planning stage keeps its own moves and acquisition. Cancel a removal, then remove only the selected stage.
2. Open Change Pokémon and the move editor in both themes. Check all three funnel states, Clear filters, outline alignment and search. Try a move already in the current stage. Cancel and confirm a downgrade, then return from Move Checker.
3. Compare Purrloin with Umbreon for type coverage and inspect Black 2 Baltoy and Claydol with actual progression before Clay and a later planning deadline. Check the acquisition location link and level requirement. Check that weaker Cut substitutions are absent from Final recommendations.
4. Type “Dra” in Move Checker and open a result. Follow an acquisition location link and return. In Maps, try two Down arrows, Enter and Escape. In 6v6 confirm the chance still appears on the card.

Production release and Android application work are outside this checkpoint.

# V78 DEV4 RC2

RC2 starts at `a46bd98d3c06f2cd408137c9ed87a7bb9198a1b7` and continues [draft PR #6](https://github.com/alexandrestp337/Tak-Dex/pull/6). The app cache is `takdex-v78.0.0-dev4-rc2`. The [private preview stamp](https://tak-dex-v77-development.freeclout8.chatgpt.site/preview-build.json) contains the packaged GitHub commit.

## Implementation and evidence

| Area | RC2 behavior |
| --- | --- |
| Planning stages | A single main card shows both distinct species in both tabs. Shared species use one artwork. The active tab displays its moves and controls. After removal, the other stage appears as a display fallback, with its moves available only in its own tab. When both stages are clear, any actual-party fallback remains display-only. Each stage retains its own acquisition, identity, lock and moves. |
| Planner actions | Lock or Unlock, Reset, and Remove share an equal-width, text-only row. Disabled controls stay in place. Reset clears only active planned moves; Remove clears the active planned stage. The selected candidate card has the same Remove action beside its selected context, with acquisition controls preserved. |
| Filters | Removed the match-all checkbox. Pokémon types and move types each use inclusive OR. Move categories use OR within their dedicated three-button row and AND against types, search and legal options. Compact badges retain individual clear targets when the panel closes. The shared funnel retains all three visual states. |
| Recommendations | RC1 used a one-badge cap when no observed progress was present, limited the whole team to three results, and ranked against replacements before prioritizing empty move slots. RC2 uses the chosen deadline, or observed progress when no deadline was set, and projects the relevant acquisition stage. It offers each unlocked member’s best eligible fill before suggesting replacements. The team list also evaluates an open slot and weak-member replacements using verified acquisition and type-based composition. A needed, unused story HM can qualify in During game. Combat merit still gates Final HM replacements. |
| Evolution selector | Eevee choices use the app’s custom dialog surface with current choice, Cancel, Escape, focus restoration, requirements, availability tones and verified map links. Timing-unverified options stay unavailable. A traced late path is labeled with its restriction. |
| Move Checker | Direct search from More had assigned itself a contextual origin. Earthquake now opens without a contextual Back. Genuine origins keep the title-row Back and existing return state. The direct More page keeps its parent-menu control. |
| Map and acquisition | The fullscreen toolbar and location details use shared horizontal extents. The corresponding mobile regular panels also align. Claydol’s route heading expresses level 36 once. The location, encounter levels and Relic Passage requirement remain visible. |
| Identity | A PID or fallback name has to resolve to one party member, and a party member has to resolve to one active plan slot. Duplicate or indistinguishable matches stay unassigned. Distinct PIDs retain their own assignments after reordering. This uses the existing transaction, import format and read-only save workflow. |

## Targeted verification

- Rendered the supplied HTML at 360 and 412 CSS px. The reference uses three equal action columns, stage artwork side by side, badges directly below search, a separate category row and equal map insets. Chromium checked the corresponding geometry and flows at both widths in both themes. App action height is 32 px and funnels are 44 px square. The existing six-slot grid, artwork proportions, typography, theme palette and During game / Final tabs remain the production components. The illustrated demo buttons and tab styling are absent from the candidate.
- Actual screenshots: [paired During artwork](rc2-evidence/360-dark-dual-during.png), [paired Final artwork](rc2-evidence/412-light-dual-final.png), [action row](rc2-evidence/360-dark-actions.png), [collapsed badges](rc2-evidence/360-dark-pokemon-badges.png), [opened Pokémon filters](rc2-evidence/412-light-pokemon-filters.png), [dedicated move categories](rc2-evidence/360-dark-move-filters.png), [Eevee dialog](rc2-evidence/412-light-evolution.png), [fullscreen map](rc2-evidence/412-light-fullscreen-map.png).
- The same five-member Black 2 fixture returned three move suggestions on RC1, with no Purrloin suggestion. RC2 returned Psyduck Surf (11.91), Patrat Thunderbolt (11.50), Purrloin Sucker Punch (10.09) and Growlithe Strength (7.10). It also surfaced Add Nidoking for Slot 6 (77.19) and Patrat → Nidoking (58.52) as separate alternatives. No recommendation changed the saved plan. A start-of-game deadline excluded the later HMs and moves. A separate Final fixture with Zoroark and Espeon excluded weaker Cut replacements, and locked Patrat returned no move upgrade.
- Synthetic save fixtures covered distinct Psyduck PIDs after reordering and duplicate PID ambiguity. The stage fixture exercised remove, reset, reload and save synchronization without converting a fallback into an explicit plan. The Claydol route fixture confirmed one level heading, the wild level range and navigation to Relic Castle. The previous DEV4 browser smoke passed at 360 CSS px. The focused import and save test suites passed all 10 cases. Syntax and diff checks passed.
- Physical Android rendering and ActionMode remain DEV8 validation. These browser results are automated verification.

## RC2 owner acceptance checklist

1. Inspect a slot with different During and Final Pokémon in both tabs. Use Lock, Reset and Remove, including Remove from the selected preview. Reload and check the other stage, actual party and moves.
2. Use multiple Pokémon and move filters. Collapse the panel and remove one badge. Check the dedicated category row and return from Move Checker with the previous editor state.
3. Review a three-move Patrat, Purrloin or Growlithe and a five-member team. Inspect the proposed fill or replacement in each mode. Open Eevee’s evolution options and cancel or return from a linked location.
4. Open Earthquake directly from More. Verify Map panel alignment and the Baltoy → Claydol route heading, encounter levels, requirement and Relic Castle link.
