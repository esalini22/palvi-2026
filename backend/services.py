from fastapi.responses import JSONResponse
from db import db

def dropdown_datasets():
    datasets_collection = db["datasets"]
    query = datasets_collection.find()
    result = [item.get("name") for item in query]
    return JSONResponse(status_code=200, content=result)

def dropdown_metricas(collection: str = ''):
    if collection == '':
        return None
    
    datasets_collection = db["datasets"]
    dataset = datasets_collection.find_one({"name": collection})
    result = []
    query = dataset.get("metadata", {}).get("metrics", [])

    for metric in query:
        result.append(metric)
            
    return JSONResponse(status_code=200, content=result)

def get_metric_days(collection: str = '', metric: str = ''):
    if collection == '' or metric == '':
        return None
    
    datasets_collection = db["datasets"]
    dataset = datasets_collection.find_one({"name": collection})
    result = []
    query = dataset.get("days", [])
    
    for day in query:
        result.append({
            "date": day.get("date"),
            "metric": day.get("metrics").get(metric)
        })
        
    return JSONResponse(status_code=200, content=result)