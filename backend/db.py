#simulador de mongodb hecha con IA

import json

class Collection:
    def __init__(self, documents=None):
        self.documents = documents or []

    def insert_one(self, document):
        self.documents.append(document)
        return {
            "inserted_id": len(self.documents) - 1
        }

    def find_one(self, query=None):
        query = query or {}

        for doc in self.documents:
            if self._matches(doc, query):
                return doc

        return None

    def find(self, query=None):
        query = query or {}

        return [
            doc for doc in self.documents
            if self._matches(doc, query)
        ]

    def update_one(self, query, update):
        doc = self.find_one(query)

        if not doc:
            return {
                "matched_count": 0,
                "modified_count": 0
            }

        if "$set" in update:
            for key, value in update["$set"].items():
                self._set_nested(doc, key, value)

        return {
            "matched_count": 1,
            "modified_count": 1
        }

    def delete_one(self, query):
        for i, doc in enumerate(self.documents):
            if self._matches(doc, query):
                del self.documents[i]

                return {
                    "deleted_count": 1
                }

        return {
            "deleted_count": 0
        }

    def _matches(self, doc, query):
        for key, expected in query.items():
            value = self._get_nested(doc, key)

            if value != expected:
                return False

        return True

    # -------------------------
    # DOT NOTATION SUPPORT
    # -------------------------
    def _get_nested(self, doc, key):
        keys = key.split(".")
        value = doc

        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return None

        return value

    def _set_nested(self, doc, key, value):
        keys = key.split(".")
        target = doc

        for k in keys[:-1]:
            if k not in target:
                target[k] = {}

            target = target[k]

        target[keys[-1]] = value


# ==========================================
# DATABASE
# ==========================================

class FakeMongoDB:
    def __init__(self):
        self.collections = {}

    def create_collection(self, name, documents=None):
        self.collections[name] = Collection(documents)

    def __getitem__(self, name):
        return self.collections[name]


# ==========================================
# LOAD JSON
# ==========================================

with open("metrics.json", "r") as f:
    raw_data = json.load(f)

db = FakeMongoDB()

# Convert top-level keys into documents
datasets = []

for dataset_name, dataset_data in raw_data.items():
    datasets.append({
        "name": dataset_name,
        **dataset_data
    })

db.create_collection("datasets", datasets)

# ==========================================
# EXAMPLES
# ==========================================

'''
datasets_collection = db["datasets"]

dataset = datasets_collection.find_one({
    "name": "A"
})

print("\nDATASET:")
print(dataset["name"])

all_datasets = datasets_collection.find()

print("\nTOTAL DATASETS:")
print(len(all_datasets))

datasets_collection.update_one(
    {"name": "A"},
    {
        "$set": {
            "metadata.days": 500
        }
    }
)

updated = datasets_collection.find_one({
    "name": "A"
})

print("\nUPDATED DAYS:")
print(updated["metadata"]["days"])

result = datasets_collection.delete_one({
    "name": "B"
})

print("\nDELETE RESULT:")
print(result)


db["datasets"].find()
db["datasets"].find_one({...})
db["datasets"].insert_one({...})
db["datasets"].update_one({...})
db["datasets"].delete_one({...})
'''