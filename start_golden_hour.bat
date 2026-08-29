@echo off
echo ======================================================================
echo  GOLDEN HOUR - Cybercrime Cash-Out Intelligence Console (SIH26184)
echo  Ministry of Home Affairs - Indian Cyber Crime Coordination Centre
echo ======================================================================
echo.
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Golden Hour Backend" cmd /k ".\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "Golden Hour Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Golden Hour Console is active!
echo Browser URL: http://localhost:5173
echo API Docs:    http://127.0.0.1:8000/docs
echo ======================================================================
