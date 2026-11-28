"""Compare bundled Gen VI data to a locally downloaded pinned PokéAPI snapshot."""
import csv
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / 'db74'
SOURCE = Path(sys.argv[1])


def bundled(name):
    return json.loads((ROOT / (name + '.json')).read_text())


def rows(name):
    with (SOURCE / (name + '.csv')).open(newline='') as source:
        yield from csv.DictReader(source)


def learnsets(group, index):
    source = {
        (int(r['pokemon_id']), int(r['move_id']), int(r['pokemon_move_method_id']), int(r['level']))
        for r in rows('pokemon_moves') if int(r['version_group_id']) == group
    }
    local = {
        (int(pokemon), move, method, level)
        for chunk in index['chunks']
        for pokemon, data in bundled(f'p{chunk}').items()
        for move, version, method, level in data[10]
        if version == group
    }
    return {
        'source': dict(sorted(Counter(index['methods'][str(key[2])] for key in source).items())),
        'bundled': dict(sorted(Counter(index['methods'][str(key[2])] for key in local).items())),
        'missing': len(source - local),
        'extra': len(local - source),
    }


def inventory():
    index = bundled('index')
    machines = bundled('machines')
    species = {r['id'] for r in rows('pokemon_species') if int(r['generation_id']) <= 6}
    pokemon = list(rows('pokemon'))
    defaults = {int(r['id']) for r in pokemon if r['species_id'] in species and r['is_default'] == '1'}
    forms = list(rows('pokemon_forms'))
    ordinary = defaults | {
        int(r['pokemon_id']) for r in forms
        if int(r['introduced_in_version_group_id']) <= 15 and r['is_battle_only'] == '0'
    }
    indexed = set(index['pokemon'].values())
    methods = {r['id']: r['identifier'] for r in rows('encounter_methods')}
    slots = {r['id']: methods[r['encounter_method_id']] for r in rows('encounter_slots')}
    encounter_rows = list(rows('encounters'))
    version_ids = {'x': '23', 'y': '24', 'omega-ruby': '25', 'alpha-sapphire': '26'}
    result = {'forms': {'base_and_non_battle_pokemon_ids_by_xy': len(ordinary),
                        'missing_from_index': sorted(ordinary - indexed)}}
    for game, version in version_ids.items():
        pack = bundled('e-' + game)
        source = Counter(slots[r['encounter_slot_id']] for r in encounter_rows if r['version_id'] == version)
        result[game] = {'inventory': index['coverage'][game],
                        'bundled_method_groups': dict(sorted(Counter(row[1] for entries in pack['entries'].values() for row in entries).items())),
                        'source_method_rows': dict(sorted(source.items()))}
    for group in (15, 16):
        name = index['groups'][str(group)]
        mappings = {(int(r['machine_number']), int(r['move_id'])) for r in rows('machines')
                    if int(r['version_group_id']) == group}
        move_ids = {move: int(number) for number, move in index['moves'].items()}
        local = {(int(r['item'][2:]) + (100 if r['item'].startswith('hm') else 0), move_ids[r['move']])
                 for r in machines[name]}
        result[name] = {'learnsets': learnsets(group, index),
                        'machines': {'source': len(mappings), 'bundled': len(local),
                                     'missing': sorted(mappings - local), 'extra': sorted(local - mappings)}}
    return result


if __name__ == '__main__':
    print(json.dumps(inventory(), indent=2))
