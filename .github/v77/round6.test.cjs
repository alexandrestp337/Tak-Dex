const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const app = fs.readFileSync(new URL('../../app.js', 'file://' + __filename), 'utf8');
const section = (start, end) => app.slice(app.indexOf(start), app.indexOf(end, app.indexOf(start)));

function ownership(party, slots) {
 const context = vm.createContext({
  party,
  state: { slots },
  actual: () => ({ pokemon: party }),
  td73IdentityKey: p => p.name,
  chosenSlot: 1,
  sameMon: (a, b) => a?.id === b.id,
  lineage: id => new Set(id === 55 ? [55, 54] : [id]),
 });
 vm.runInContext(section(' function eligibleAcquisition', ' function sameMon'), context);
 return context;
}
test('A duplicate legacy PID can satisfy only one slot after party reordering', () => {
 const party = [{ id: 55, name: 'golduck', saveStats: { pid: 900 } }, {id: 58, name:'growlithe',saveStats:{pid:3}}];
 const slots = [{ id: 58, originPid: 3 }, { id: 55, originPid: 900 }, { id: 55, originPid: 900 }];
 const original = ownership(party, slots);
 assert.equal(original.ownedFor(slots[0], 0), party[1]);
 assert.equal(original.ownedFor(slots[1], 1), party[0]);
 assert.equal(original.ownedFor(slots[2], 2), null);
 assert.equal(original.ownershipConflict(slots[2], 2).slot, 1);
 const reordered = ownership(party.slice().reverse(), slots);
 assert.deepEqual(Array.from(reordered.ownedAssignments()), [0, 1, -1]);
});

test('Legacy duplicates without identity are not assigned by party position', () => {
 const party = [{ id: 54, name: 'psyduck' }, { id: 54, name: 'psyduck' }];
 const slots = [{ id: 54, originSlot: 0, originName: 'psyduck' }, { id: 55, originSlot: 1, originName: 'psyduck' }];
 const context = ownership(party, slots);
 assert.equal(context.ownedFor(slots[0], 0), null);
 assert.equal(context.ownedFor(slots[1], 1), null);
 assert.equal(context.ownershipConflict(slots[1], 1), undefined);
});

test('Recommendation index retains terminal branches and excludes ancestors regardless of route feasibility', () => {
 const pack = {mons:[[328],[329,,,,328],[330,,,,329],[133],[134,,,,133],[135,,,,133]]};
 const context = vm.createContext({pack});
 vm.runInContext(section(' let lineagePack,parentsById,terminalSpecies;', ' function progressFor('), context);
 assert.deepEqual(Array.from(vm.runInContext('buildLineageIndex();terminalSpecies',context), row=>row[0]),[330,134,135]);
 assert.deepEqual(Array.from(context.lineage(330)),[330,329,328]);
});
