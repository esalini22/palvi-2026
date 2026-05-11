from fastapi import (
    FastAPI,
)
from fastapi.middleware.cors import CORSMiddleware

ALLOWED_ORIGIN = f"http://localhost:5173"

from endpoints import router

# --- Inicialización de la Aplicación FastAPI ---
app = FastAPI(
    title="Backend con FastAPI",
    description="Backend del ejercicio de postulación.",
    version="2.0.0",
)

origins = [ALLOWED_ORIGIN]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Can also use ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=3000,
        reload=False,
    )