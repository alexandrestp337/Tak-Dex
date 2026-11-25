# V76 fourth correction acceptance checklist

The third acceptance recorded five passes and marked the turn-order indicator as Need work. The statuses below reflect automated checks for the fourth pass. Final user acceptance is pending.

| Check | Status | What to check |
| --- | --- | --- |
| Team Builder as the saved-team editor | Pass | Open a saved Pokémon. Check the level and held-item controls and the collapsed Battle stats section. Expand it and try the steppers, tap-to-select and Auto. Clear the item and save. |
| Battle and 6v6 synchronization | Pass | Save a change to level, Speed, attack, ability, moves or item. Check damage, turn order and ranks in the corresponding matchup. Check the green or red indicator below the Pokémon's types and ability. |
| Saved 6v6 and hypothetical editors | Pass | Select a saved team and review its read-only matchup. Switch to custom My Team and try both player and opponent editors. |
| Existing teams and Gen V saves | Pass | Reload a migrated team and round-trip its JSON. Import the same save twice, then import a newer valid copy. Confirm the new party data takes priority and the existing battle or map stays open. |
| Incoming KO warning and ranking | Pass | Check that a fast, potentially lethal Hyper Beam shows a red warning. The separate gold crown and team strip still identify the best-ranked Pokémon. |
| Opponent abilities | Pass for tested encounters | Check Flame Body on Alder's level-77 Volcarona and confirm known abilities use the player label style. |
| Preset ability coverage | Need work | Some multi-ability encounters are still unresolved. See the per-game preset audit in the release report. |
| Prior approved web workflows | Pass for tested flows | Check move styling and combined STAB, gold highlight, OHKO and 2HKO, Unified Move Checker, Pokédex alignment, Team Planner, fullscreen maps and offline reload. |
| Galaxy S25 Ultra and native Android | Untested | Verify rendering and touch behavior on the phone during acceptance. Native save access and emulator switching belong to Android V9. |

No automated checks are currently marked Fail. [Release report](RELEASE-REPORT.md) · [Screenshots](screenshots)
