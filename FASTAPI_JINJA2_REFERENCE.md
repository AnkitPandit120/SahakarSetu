# Sahakar Sahayak - FastAPI + Jinja2 + HTMX Architecture Implementation

## System Overview
For standalone Python deployments (e.g. Raspberry Pi 4, Edge Kiosks, Debian/Ubuntu micro-servers):

```python
# main.py - FastAPI Reference
from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uuid

app = FastAPI(title="Sahakar Sahayak")
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request, lang: str = "hi", kiosk: bool = False):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "language": lang,
        "is_kiosk": kiosk
    })

@app.post("/chat/message", response_class=HTMLResponse)
async def chat_message(request: Request, query: str = Form(...), language: str = Form("hi")):
    # Process query, perform RAG grounding and return HTMX fragment
    return templates.TemplateResponse("partials/chat_message.html", {
        "request": request,
        "query": query,
        "language": language
    })

@app.post("/grievance/submit", response_class=HTMLResponse)
async def submit_grievance(
    request: Request,
    applicant_name: str = Form(...),
    pacs_name: str = Form(...),
    issue_type: str = Form(...),
    description: str = Form(...)
):
    ticket_id = f"CRCS-2026-{uuid.uuid4().hex[:6].upper()}"
    return templates.TemplateResponse("partials/grievance_success.html", {
        "request": request,
        "ticket_id": ticket_id
    })
```
