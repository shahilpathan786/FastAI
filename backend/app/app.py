
from fastapi import FastAPI, Depends
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.router import chatbot2 , youtube2
from app.router import auth
from app.config.app_config import getAppConfig
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes
app.include_router(chatbot2.router, prefix="/api")
app.include_router(youtube2.router, prefix="/api")
app.include_router(auth.router , prefix="/api")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = {}
    for error in exc.errors():
        print(f"The error is: {error}")
        errors[error["loc"][-1]] = error["msg"]

    return JSONResponse(
        {"message": "Validation Error", "errors": errors}, status_code=422
    )


@app.get("/")
def root():
    config = getAppConfig()
    return {
        "message": "Hello, FastAPI",
        "app_name": config.app_name,
        "app_env": config.app_env,
        "database_url": config.database_url,
    }


