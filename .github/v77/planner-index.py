"""Build the compact recommendation index from the bundled reference data and PokéAPI species CSV."""
import csv
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[2]
with open(sys.argv[1], encoding="utf-8") as stream:
    rare = {
        int(row["id"]) for row in csv.DictReader(stream)
        if row["is_legendary"] == "1" or row["is_mythical"] == "1"
    }
stats = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"]
types = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
         "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"]
moves = {data["id"]: data for data in json.loads((root / "db74/moves.json").read_text()).values()}
index = {}
for path in (root / "db74").glob("p[0-9]*.json"):
    for id, row in json.loads(path.read_text()).items():
        base = dict((name, amount) for name, amount, _ in row[8])
        if not all(k in base for k in stats):
            continue
        past = {era: [[stats.index(name), amount] for name, amount, _ in changes if name in stats]
                for era, changes in row[9].items()}
        usable = {}
        for move_id, group, method, level in row[10]:
            move = moves.get(move_id)
            if method != 1 or level > 55 or not move or (move["power"] or 0) < 50 or (move["accuracy"] or 100) < 85:
                continue
            kind = move["type"]["name"]
            if kind in types:
                usable[group] = usable.get(group, 0) | (1 << types.index(kind))
        index[id] = [int(row[1] in rare), [base[k] for k in stats], past, [info[1] for info in row[6] if info[1]], usable]
(root / "db74" / "planner-v77.json").write_text(json.dumps(index, separators=(",", ":")) + "\n")
