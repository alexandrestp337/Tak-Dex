# V76 acceptance checklist

**Pass** means the described scope passed automation. **Fail** marks a reproducible defect. **Untested** means the requested environment or scenario was unavailable. **Need work** identifies an incomplete requirement.

| User acceptance check | Status | What to check |
| --- | --- | --- |
| Import a Gen V party and preserve the original save | Pass | Four public raw saves matched the reference reader. Check your own melonDS export and team identity. |
| Update a linked team without losing the current view | Pass | Chromium preserved Battle opponent and fullscreen map state. Check active edits and browser scroll with your team. |
| Battle move order, survival and recharge | Pass | Mechanic-level tests passed. Enter your Cynthia/Lucario and Samurott/Milotic matchups and compare with known stats and HP. |
| Capture every conditional move and verified opponent stat | Need work | Remaining move cases and exact trainer IV/EV/nature data need evidence. |
| Battle, 6v6 and Pokédex move navigation | Pass | Chromium checked return state and scroll. Check the layouts on your display. |
| Player and opponent stat adjustment | Pass | Chromium checked both step controls, player numeric selection and player persistence. Save custom opponent adjustments in its preset. |
| Emerald encounter navigation and fullscreen Maps | Pass | Verified multi-pin framing and live detail selection. Check locations you use most. |
| Offline cold start and legacy UI | Pass | Chromium opened the cached candidate and read its saved party and bundled data offline. |
| All-screen mobile styling and device behavior | Untested | Use Galaxy S25 Ultra at your preferred display scaling. |
| Android V9 integration | Untested | Requires approved V76, Android V8 source and native tests. |
| Unified TM/HM and Move Checker | Untested | Proposal only. Both existing tools are available. |
| Reproducible release-blocking failures in the final automated matrix | Pass | No cases remain with Fail status in that matrix. |
