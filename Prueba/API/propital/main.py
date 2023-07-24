from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from router import property
from app.exceptions.UnAuthorizedException import UnAuthorizedException

app = FastAPI(version="0.1", debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(property.router)


@app.get("/", description="This is a test route with no effect on the backend.")
async def root():
    return {"message": f"Hello World. Welcome to FastAPI! "}


@app.exception_handler(HTTPException)
async def http_exception_handler(exc) -> JSONResponse:
    """Handles HTTPExceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(UnAuthorizedException)
async def unauthorized_exception_handler(exc) -> JSONResponse:
    """Handles UnAuthorizedExceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return {"detail": exc.errors(), "body": exc.body}
