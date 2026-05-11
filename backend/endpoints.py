from fastapi import APIRouter
import services as services

router = APIRouter(prefix="/api")

@router.get("/datasets")
async def get_all_datasets():
    return services.dropdown_datasets()

@router.get("/metrics")
async def get_all_metrics(collection: str = ''):
    return services.dropdown_metricas(collection)


@router.get("/days")
async def get_days(collection: str = '', metric: str = ''):
    return services.get_metric_days(collection, metric)
