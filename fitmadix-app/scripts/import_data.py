import csv
import json
import os
from pathlib import Path

# Adjust these paths as needed
DATA_DIR = Path(__file__).parent.parent / "src" / "data"

def load_json(file_path: Path):
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_csv(file_path: Path):
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)

def import_encyclopedia(kind: str, records: list):
    """Send records to the backend API for the given encyclopedia kind.
    Kind must be one of: 'foods', 'medicines', 'diseases'.
    """
    import requests
    base_url = os.getenv("API_BASE_URL", "http://localhost:5173")
    endpoint = f"{base_url}/api/{kind}"
    for rec in records:
        try:
            resp = requests.post(endpoint, json=rec)
            resp.raise_for_status()
        except Exception as e:
            print(f"Failed to import {kind} record {rec.get('name')}: {e}")

def main():
    # Example: import all JSON files in the data folder
    for file in DATA_DIR.glob("*.json"):
        kind = file.stem  # assumes filename matches kind, e.g., foods.json
        if kind not in {"foods", "medicines", "diseases"}:
            continue
        records = load_json(file)
        import_encyclopedia(kind, records)
    # Example: import CSV files (if any)
    for file in DATA_DIR.glob("*.csv"):
        kind = file.stem
        if kind not in {"foods", "medicines", "diseases"}:
            continue
        records = load_csv(file)
        import_encyclopedia(kind, records)

if __name__ == "__main__":
    main()
