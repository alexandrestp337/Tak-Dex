"""Build the compact recommendation index from the bundled reference data and PokéAPI species CSV."""
import csv
import json
import sys
from subprocess import check_output
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
timing = json.loads(check_output(["node", str(root / ".github/v77/coverage.cjs"), "--planner-timing"]))
method_keys = {3: "tutor", 4: "machine"}
index = {}
for path in (root / "db74").glob("p[0-9]*.json"):
    for id, row in json.loads(path.read_text()).items():
        base = dict((name, amount) for name, amount, _ in row[8])
        if not all(k in base for k in stats):
            continue
        past = {era: [[stats.index(name), amount] for name, amount, _ in changes if name in stats]
                for era, changes in row[9].items()}
        usable = {}
        gated = {}
        for move_id, group, method, level in row[10]:
            move = moves.get(move_id)
            if not move or (move["power"] or 0) < 50 or (move["accuracy"] or 100) < 85:
                continue
            kind = move["type"]["name"]
            if kind not in types:
                continue
            flag = 1 << types.index(kind)
            if method == 1 and 1 < level <= 55:
                usable[group] = usable.get(group, 0) | flag
            if group not in (11, 14) or method not in method_keys:
                continue
            rank = timing[str(group)][method_keys[method]].get(move["name"])
            if rank is not None:
                gates = gated.setdefault(group, {})
                gates[rank] = gates.get(rank, 0) | flag
        profile = [int(row[1] in rare), [base[k] for k in stats], past, [info[1] for info in row[6] if info[1]], usable]
        if gated:
            profile.append(gated)
        index[id] = profile
(root / "db74" / "planner-v77.json").write_text(json.dumps(index, separators=(",", ":")) + "\n")
