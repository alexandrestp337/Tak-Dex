# V78 DEV5 RC1

Development continues from DEV4 RC2, `553640e0efab79571d7ce2b59b0681eb314f62bb`, in [draft PR #6](https://github.com/alexandrestp337/Tak-Dex/pull/6). The Web shell uses `takdex-v78.0.0-dev5-rc1`. The [owner-only preview build stamp](https://tak-dex-v77-development.freeclout8.chatgpt.site/preview-build.json) records the GitHub checkpoint.

## Owner corrections

| Scope | Implementation and verification |
| --- | --- |
| Artwork and criteria | Kept the six-slot grid and both existing tabs. Removed artwork labels, retained one image for identical stages, and positioned friendship or level requirements above the arrow without expanding its grid column. The Eevee → Espeon fixture kept both names, Psychic and Friendship visible. |
| Keep and acquisition | Final can explicitly keep the During Pokémon using normal Final generation. The During entry, saved choices and its lock stay intact. Remove occupies the selected context above BST. Captures with verified fulfillment show read-only route history and links. Pending evolution requirements have their own line. |
| Filter and move controls | Shared 30 px type tiles, spacing and type colors apply to both filters. Counts were removed. OR selection, badge removal, category rows and funnel states remain. The local search return control appears during long results. The planned move button covers its full card and toggles it without opening the keyboard. |
| Recommendations | Retained the ranking, constraints and seven-row stat disclosure in Team Recommendations. Candidate previews show compact BST and preserve type comparison. Removed generic suggestion prose, repeated progress text and alternate summary. Apply uses the shared neutral style. |
| Evolution selector | Equal selection and information columns, compact text and normal wrapping. Opens at the top, uses internal overflow, and restores focus on close. Locations are plain text within the dialog. The selected plan still exposes verified acquisition map links. Timing and requirement wording follow the game provider. |
| Maps and actions | Removed the zoom readout in normal and fullscreen views. Zoom controls and alignment remain. The Gym battle link and Apply actions use shared neutral styling. Destructive and selected actions retain their visual cues. |

## Audit findings

| Finding | Status and evidence |
| --- | --- |
| WEB-004 · Coverage | The About screen reads bundled catalog metadata, downloaded indexes and the same machine and trainer providers as gameplay. Each of 34 game models reports its version group, source encounter rows and merged groups, downloaded status, trainer variants and field-level availability counts. Acquisition, map services, tutors and progression carry evidence scope. A missing source stays unknown. Counts are about indexed records. |
| WEB-009 · Offline shell | Version-exact scripts, styles and startup assets stage before activation. Large encounter indexes, database chunks and regional art resolve on demand outside the shell. A failed critical install retains the prior working worker. Rollback retains the previous shell and one pre-split source cache where present. |
| WEB-010 · Cache validation | Validate the JSON and expected shapes before reusing records, including discovered move and evolution dependencies. A selected completed pack with missing dependencies becomes partial and can resume. Invalid optional bundled JSON can recover from an exact older asset or a valid response. Repair, retries and downloads preserve valid cached records. Reference requests and shared CSV batches have time limits. |
| WEB-013 · Targeted architecture | Repository search found the legacy renderer and its private helpers only in their declarations and their own call chain. Live analysis dispatches `td74:plan-results` to the focused dashboard. Removed that unreachable renderer and kept shared STAB, editing and result hooks. Normalized fallback requests coalesce and have bounded body retrieval. Existing exact/prefix/substring ordering remains. The global scripts and large Planner closure still couple data resolution to rendering. |
| WEB-015 · Metadata | Head metadata, structured metadata, the explicit shell manifest and the preview stamp are checked together before publication. Feedback reads the runtime version from the head metadata. The Chromium test intercepted the Formspree request with a mock response. README reflects Emerald maps, the separate native baseline and the split offline shell. |

## Targeted verification

- Chromium rendered the approved HTML and the app at 360 and 412 CSS px in light and dark themes. Geometry checks cover the selector halves, compact filter tiles, move hit region, Remove position and artwork/badge extents. Differences from the reference use the existing app colors, verified game text and plain location text. The approved tabs retain their existing markup and styling.
- Chromium verified independent Final Keep, capture history, future evolution requirements, restoring modal focus, full-width move toggling and both map modes. The local scroll return kept the search query without focusing the input. Vaporeon selection exposed the Route 19 link from its requirement. Move Checker Back restored the open editor and selected filters. The focused 6v6 check preserved the 12.5% first-turn KO notice, contextual Gyro Ball and Quick Battle behavior after removing the legacy renderer.
- Coverage fixtures checked 34 unique games, Black 2 source rows and groups, bundled machines without a download, shared version groups, absent Scarlet encounters, a download with missing dependencies, and pack removal. Mocked feedback supplied the correct version, and concurrent equivalent API requests made one fallback request. No feedback was sent.
- The service worker test began from DEV4 RC2, forced an essential failure and reloaded the old app offline. The same origin then installed DEV5 with an unavailable optional map, repaired corrupt optional JSON and reloaded offline. The fixture retained browser storage and the WHOASP footer.
- Four focused cache/metadata tests and ten existing import/save tests passed. Existing game data and provider records were preserved. The tests use synthetic data plus existing bundled reference files. A fresh offline shell opens the app and uses previously fetched assets or downloaded regional data as available. The test suite did not download full regional packs. Physical device, native permissions and ActionMode stay in the later native stage.

- Rendered evidence: [360 px reference](dev5-evidence/360-dark-reference.png), [360 px selector](dev5-evidence/360-dark-evolution.png), [412 px light selector](dev5-evidence/412-light-evolution.png), [Friendship and artwork](dev5-evidence/360-dark-paired-artwork.png), [Pokémon filter](dev5-evidence/360-dark-pokemon-filter.png), [move filter](dev5-evidence/360-dark-move-filter.png), [selected Remove and BST](dev5-evidence/360-dark-candidate-action.png).

## Owner acceptance checklist

1. Inspect the Eevee and Espeon card on a narrow viewport. Open the evolution selector, choose or cancel, and follow a location from the resulting plan.
2. Keep a During choice in an empty Final slot. Inspect Remove, Reset, capture history and pending evolution information in each stage.
3. Compare the two filter panels, scroll long Pokémon results and return to search. Tap the same planned move to close it, then check a contextual Move Checker return.
4. Inspect Team Recommendation stats, a compact candidate, Map Gym actions and About → Database Coverage. Check a partial pack resume and an offline reload.

## DEV5 RC2 final Web candidate

The RC2 baseline is `a1460bc6141f00853b1c528560f5a0c14490e828`. The [private build stamp](https://tak-dex-v77-development.freeclout8.chatgpt.site/preview-build.json) identifies the exact packaged branch commit. The development shell is `takdex-v78.0.0-dev5-rc2`.

- The existing evolution rows use a subtle full-width divider with the same spacing and layout. Both Clear filters buttons use the same size, font, alignment and disabled treatment. [Evolution](dev5-rc2-evidence/360-dark-evolution.png) · [Pokémon filters](dev5-rc2-evidence/360-dark-pokemon-filter.png) · [Move filters](dev5-rc2-evidence/360-dark-move-filter.png)
- Offline Data shows only Downloaded, Partial download and Not downloaded. The selected game is checked against usable records and dependencies, compatible machine catalogs, encounter data and artwork. Shared cache entries contribute where applicable. Pack metadata and provider provenance remain available separately. Download and Remove use equal-height neutral controls. Removal still checks for locally owned entries and requires confirmation. [Offline Data](dev5-rc2-evidence/360-light-offline.png)
- Fulfilled acquisitions display the actual level and remaining evolution requirements. The owned Psyduck fixture shows Golduck at Lv. 33. Unowned Patrat retains its acquisition picker. Stored history and evolution links remain available to the existing planning logic.

### Focused verification and acceptance

The Chromium fixture checks both themes at 360 and 412 CSS px, including divider styling, Clear filters geometry, owned and unowned rows, and offline controls. A separate synthetic CacheStorage fixture checks absent, corrupt and stale data, shared complete availability, missing dependencies and retention of valid entries. Production stays on `7046e53`. Database Coverage still needs owner acceptance, and native offline retention remains deferred.

1. Open an evolution selector and compare the two Clear filters buttons.
2. Inspect an owned Pokémon with a pending evolution and an unowned acquisition.
3. Select a downloaded or partial offline pack, check the three status labels, and verify the remove confirmation.

## DEV5 RC3 visual acceptance candidate

Baseline `786c0eb1073e96112bb6ea6c3b738a7688256350`, [draft PR #6](https://github.com/alexandrestp337/Tak-Dex/pull/6), and cache namespace `takdex-v78.0.0-dev5-rc3`. The [private build stamp](https://tak-dex-v77-development.freeclout8.chatgpt.site/preview-build.json) identifies the packaged commit.

| Fixture | Prior behavior | RC3 Chromium measurements in both themes |
| --- | --- | --- |
| Black 2 Eevee evolution selector | The divider sat in the 5 px inter-row gap next to the lower row. | All seven dividers have 7 px clear above and 7 px below, measured from the taller adjacent content. Button and requirements share a vertical center. The selector opens at the top and scrolls internally at 440 px viewport height. Cancel closes it. |
| Pokémon type filter | Clear filters sized to its own text and used a 32 px height. | Clear filters and Water are both 89.34 × 30 px at 360 px and 104.66 × 30 px at 412 px. Right edges differ by at most 0.02 px. Both controls use the same font size and radius. Selecting Water enables Clear filters, and clearing disables it. |
| Owned Black 2 Psyduck with Golduck planned | Adjacent inline text could concatenate. | “On team · Lv. 5” and “Evolution remaining · Golduck at Lv. 33” occupy separate, left-aligned 18 px blocks with a 4 px gap. Constraining the fixture to 140 px causes the evolution text to wrap and preserves the gap. The unowned Patrat picker still renders. |

| CSS viewport and theme | Rendered evidence |
| --- | --- |
| 360 px dark | [Evolution](dev5-rc3-evidence/360-dark-evolution.png) · [Pokémon filter](dev5-rc3-evidence/360-dark-pokemon-filter.png) · [Owned Psyduck](dev5-rc3-evidence/360-dark-owned.png) |
| 360 px light | [Evolution](dev5-rc3-evidence/360-light-evolution.png) · [Pokémon filter](dev5-rc3-evidence/360-light-pokemon-filter.png) · [Owned Psyduck](dev5-rc3-evidence/360-light-owned.png) |
| 412 px dark | [Evolution](dev5-rc3-evidence/412-dark-evolution.png) · [Pokémon filter](dev5-rc3-evidence/412-dark-pokemon-filter.png) · [Owned Psyduck](dev5-rc3-evidence/412-dark-owned.png) |
| 412 px light | [Evolution](dev5-rc3-evidence/412-light-evolution.png) · [Pokémon filter](dev5-rc3-evidence/412-light-pokemon-filter.png) · [Owned Psyduck](dev5-rc3-evidence/412-light-owned.png) |

The screenshots were visually inspected. The [focused Chromium test](dev5-rc3-browser.cjs) uses local browser fixtures with existing game data. Move-filter markup, logic and applicable CSS rules were checked against the baseline by diff. Physical Samsung, native Android and broad regression tests were outside this round’s verification.

## V78-STABLE release

The owner accepted DEV1–DEV5 at Web checkpoint `f95220b78b94446cea57f40a0ad679d1aec210f9`. The stable promotion through [PR #6](https://github.com/alexandrestp337/Tak-Dex/pull/6) changes release metadata and V78 shell asset versions. Saved-data schemas and downloaded-data cache namespaces are carried forward.

The production shell namespace is `takdex-v78.0.0-stable`. The `V78-STABLE` tag identifies the Web source for Android V11 integration. [Production Web app](https://alexandrestp337.github.io/Tak-Dex/)
