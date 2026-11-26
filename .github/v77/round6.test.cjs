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
 vm.runInContext(section(' function ownedAssignments', ' function sameMon'), context);
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

test('Two identical independently owned Pokémon can be reserved separately', () => {
 const party = [{ id: 54, name: 'psyduck' }, { id: 54, name: 'psyduck' }];
 const slots = [{ id: 54, originSlot: 0, originName: 'psyduck' }, { id: 55, originSlot: 1, originName: 'psyduck' }];
 const context = ownership(party, slots);
 assert.equal(context.ownedFor(slots[0], 0), party[0]);
 assert.equal(context.ownedFor(slots[1], 1), party[1]);
 assert.equal(context.ownershipConflict(slots[1], 1), null);
});

test('Family ranking preserves a reachable earlier stage and distinct branches', () => {
 const parents = { 329: 328, 330: 329, 134: 133, 135: 133 };
 const lineage = id => { const ids = new Set(); while (id) { ids.add(id); id = parents[id]; } return ids; };
 const context = vm.createContext({ lineage, routeFits: (route, cap) => route.level <= cap });
 vm.runInContext(section(' function sameFamily(', ' async function findCandidates('), context);
 const trapinch = { id: 328, types: ['ground'], score: 21, routes: [{ level: 21 }] };
 const vibrava = { id: 329, types: ['ground','dragon'], score: 26, routes: [{ level: 35 }] };
 const flygon = { id: 330, types: ['ground','dragon'], score: 32, routes: [{ level: 45 }] };
 const early = context.rankFamilyEndpoints([trapinch, vibrava], 25);
 assert.ok(early.includes(trapinch));
 const late = context.rankFamilyEndpoints([trapinch, vibrava, flygon], 50);
 assert.deepEqual(Array.from(late, row => row.id), [330]);
 assert.equal(context.redundantFamily(trapinch,flygon),true);
 assert.equal(context.redundantFamily({id:134,types:['water']},{id:135,types:['electric']}),false);
});
