import sys
import os

# Add parent directory to path so we can import backend
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from mangum import Mangum
    from backend.main import app
    
    # Vercel expects a handler that works with AWS Lambda format
    handler = Mangum(app, lifespan="off")
except Exception as e:
    print(f"Error initializing app: {str(e)}")
    import traceback
    traceback.print_exc()
    
    # Create a minimal error handler
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    error_app = FastAPI()
    
    @error_app.get("/")
    @error_app.post("/")
    @error_app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
    async def catch_all():
        return JSONResponse(
            status_code=500,
            content={
                "error": "Function initialization failed",
                "message": str(e),
                "details": "Check Vercel function logs for more information"
            }
        )
    
    handler = Mangum(error_app, lifespan="off")
