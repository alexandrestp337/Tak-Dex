# DEV8 native integration handoff

Android V10.2 candidate `095f4e55815ea0ca4a9d8f9d9ee2192833ec088e` is the read-only integration reference. V9-STABLE is Android main. Integrate only with the separately authorized, verified Web release. Preserve package ID, signing, existing file URI permissions and user data.

## Shared interfaces

Use `window.takDexSaveSync`, and keep a durable request ID plus Web generation in the native link journal. Calls accept a raw `ArrayBuffer` or `Uint8Array`. The legacy parsed hint cannot bypass validation.

| Web call | Expected durable action |
| --- | --- |
| `nativeLinks.inspect({teamId,sourceGeneration})` | Return associated generation, pending ID, confirmed ID, quarantine reason or explicit release authorization. A missing/empty/corrupt store, wrong game, unknown team or unmatched generation never authorizes release. |
| `nativeLinks.prepareRelink({teamId,requestId,bytes,sourceGeneration})` | Validate candidate bytes and persist a pending request against the existing generation. Repeating identical input is safe. A cancelled request ID stays cancelled. Start a new request ID for a new user choice. The currently linked document remains usable. |
| `synchronize({teamId,bytes,linked:true,relink:true,requestId,sourceGeneration})` | Match exact validated bytes to the pending request. Atomically publish actual snapshot plus new source generation and a Web-committed receipt awaiting native acknowledgement. The same request/bytes can be retried after restart, including an older same-trainer backup. Do not interpret generic stale/superseded as success. |
| `nativeLinks.finishRelink({teamId,requestId,sourceGeneration,cancel:true})` | Cancel while pending at the old generation. If Web already committed, reconcile the committed swap. Maintain both grants until the durable outcome is known. |
| `nativeLinks.finishRelink({teamId,requestId,sourceGeneration})` | Acknowledge successful durable native pointer switch at the **new** generation. This is safe to retry. After native pointer durability and Web receipt, release an unused old grant through native reference counting. |
| `synchronize({teamId,bytes,linked:true,sourceGeneration,modifiedAt})` | Supply the generation of the file read, copied from its durable native record. Use `updated`, `unchanged`, `stale`, `superseded` and reported conflicts distinctly. Provider timestamp is descriptive. |
| `nativeLinks.unlink({teamId,sourceGeneration})` | Call after explicit user intent, then check generation-scoped release authorization. User-confirmed Web deletion records its own authorization. Make native removal and grant release idempotent. |

## Android adapter and Java work

1. In `www/android-save-link.js`, replace the startup orphan-unlink loop around the pinned lines 143–189 with inspection and quarantine. Read (and preserve) association/generation from native storage, identify missing, corrupt, empty and restored Web stores, and only release exact authorizations. Leave unknown native-only mappings in a recoverable state. Keep the affected teams and user drafts independent on resume.
2. Replace the choose/confirm/sync flow around lines 124–140 with native staging followed by Web prepare, Web publish, native promote, and Web acknowledgement. Hold the prior URI grant until native promotion is durable. Resume a pending stage by rereading and validating the same bytes. If bytes changed, use explicit reselection and cancellation rather than silently attaching a different file. If Web is committed but the native pointer is old, retry native promotion from the journal. If the native pointer is already new, acknowledge Web and finish old-grant cleanup. These steps must work after restart between any two operations.
3. In `SaveDocumentsPlugin.java` around lines 119–175, persist candidate/old link, generation, request ID and phase in a recoverable record. Serialize link mutations. Check each SharedPreferences disk `commit()` before telling JS that native state is durable. A failed disk commit can still change the process's in-memory preferences. Keep a separately tracked last-durable state and rollback/re-read as appropriate. Never use the just-mutated in-memory map alone to decide that a prior grant can be released. On failed promotion retain the prior and staged grants and reconcile on restart. Release an unused URI only after durable state proves no active or staged record uses it. Handle already released grants and process interruption idempotently.
4. Polling and folder-follow must pass source generation for the actual provider read. Remove any adapter decision that treats its old compatibility checkpoint or modified time as the final authority. The old adapter can still invoke the API with `linked`, `parsed` and `relink`; without durable generation it cannot identify stale reads started after a swap. The old startup loop and early Java release also remain live in the pinned Android candidate. DEV1 does not certify them.

## Native verification and carry-forward

Use mock provider/SharedPreferences and then device validation for grant persistence, app resume, interrupted staging, failed Java disk commit, cancelled picker, older same-trainer replacement, duplicate request, native-only restored link, and confirmed Web deletion. Inject faults between each phase, count release calls and inspect linked read ordering. Verify file bytes are unchanged and emulator switching preserves draft, tab, search and scroll. Browser tests verify the shared contract only.

AND-004 through AND-009 remain separate native audit items. Reuse their reports and acceptance evidence. Keep production and signing decisions separate from the Web DEV1 draft.
