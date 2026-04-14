"""
SmartChain AI Service — FastAPI + Google Gemini 1.5 Flash
==========================================================
Copilot chat  → Gemini 1.5 Flash (smart, shipment-context-aware)
Simulation    → deterministic risk engine + Gemini insight generation
Fallback      → full rule-based engine if Gemini key missing / quota hit

The app NEVER breaks regardless of Gemini API availability.
"""

import os
import random
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# ── Robust .env loading (works on Windows regardless of working directory) ────
try:
    from dotenv import load_dotenv
    # Try multiple possible locations for the .env file
    _here       = Path(__file__).parent.resolve()
    _env_paths  = [
        _here / ".env",                        # ai-service/.env  (correct)
        _here.parent / "ai-service" / ".env",  # if run from root
        Path(".env"),                           # current working dir
    ]
    _loaded = False
    for _p in _env_paths:
        if _p.exists():
            load_dotenv(dotenv_path=_p, override=True)
            print(f"✅  Loaded .env from: {_p}")
            _loaded = True
            break
    if not _loaded:
        print("⚠️  No .env file found — checking system environment variables")
except ImportError:
    print("⚠️  python-dotenv not installed — run: pip install python-dotenv")

<<<<<<< HEAD
# ── Gemini Setup ───────────────────────────��──────────────────────────────────
=======
# ── Gemini Setup ──────────────────────────────────────────────────────────────
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip().strip('"').strip("'")
gemini_model   = None
GEMINI_ENABLED = False

print(f"🔑  GEMINI_API_KEY detected: {'YES (length=' + str(len(GEMINI_API_KEY)) + ')' if GEMINI_API_KEY else 'NO — key is empty'}")

_INVALID_VALUES = ("your_gemini_api_key_here", "", "none", "null", "undefined")

if GEMINI_API_KEY and GEMINI_API_KEY.lower() not in _INVALID_VALUES:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={
                "temperature":       0.7,
                "top_p":             0.92,
                "top_k":             40,
                "max_output_tokens": 512,
            },
            safety_settings=[
                {"category": "HARM_CATEGORY_HARASSMENT",        "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH",       "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ],
        )
        # ── Warm-up test call to confirm key is valid ─────────────────────────
        test = gemini_model.generate_content("Say OK")
        _ = test.text  # will raise if key is invalid
        GEMINI_ENABLED = True
        print("✅  Gemini 1.5 Flash copilot ENABLED and verified!")
    except Exception as e:
        print(f"❌  Gemini init/verify failed: {e}")
        print("    → Check your API key at https://aistudio.google.com/apikey")
        print("    → Falling back to rule-based responses")
else:
    print("ℹ️  GEMINI_API_KEY not set — using rule-based copilot")
    print("    → Add your key to ai-service/.env file")
    print("    → Get a free key at: https://aistudio.google.com/apikey")


# ── FastAPI App ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="SmartChain AI Service",
    description="Gemini-powered logistics copilot + deterministic risk simulation",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic Models ───────────────────────────────────────────────────────────

class ShipmentInput(BaseModel):
    id:           str
    source:       Optional[str]   = ""
    destination:  Optional[str]   = ""
    status:       Optional[str]   = "In Transit"
    riskScore:    Optional[float] = 0
    speedKmph:    Optional[float] = 60
    speedFactor:  Optional[float] = 1.0
    etaMinutes:   Optional[float] = 0
    progressPct:  Optional[float] = 0
    active:       Optional[bool]  = True
    cargoType:    Optional[str]   = "General"
    temperatureC: Optional[float] = None

class SimulateRequest(BaseModel):
    disruption: str = Field(..., description="storm | traffic | strike")
    shipments:  List[ShipmentInput]

class SimulateResponse(BaseModel):
    shipments:   List[Dict[str, Any]]
    insight:     str
    speedFactor: float
    events:      Optional[List[Dict[str, Any]]] = []

class ChatRequest(BaseModel):
    query:   str
    context: Optional[Dict[str, Any]] = {}

class ChatResponse(BaseModel):
    response:   str
    confidence: float = 1.0
    source:     str   = "gemini-1.5-flash"
<<<<<<< HEAD
    # compatibility fields
    reply:      Optional[str] = None
    mode:       Optional[str] = None
=======
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec


# ── Disruption Config ─────────────────────────────────────────────────────────

DISRUPTION_CONFIG: Dict[str, Any] = {
    "storm": {
        "risk_delta_range": (28, 44),
        "speed_factor":     0.45,
        "fallback_insights": [
            (
                "Cyclonic system over Bay of Bengal severely impacting coastal routes. "
                "S103 (Chennai–Kolkata) faces highest exposure — immediate inland rerouting via NH-44 advised. "
                "Expect 55% speed reduction and 40+ point risk increase on coastal segments. "
                "Activate emergency freight contracts for cold-chain cargo."
            ),
            (
                "Severe storm front moving NE at 28 km/h. Port operations at Chennai and Visakhapatnam suspended. "
                "Coastal NH-16 at 60% capacity. Recommend activating air freight for pharmaceutical cargo. "
                "Road corridors showing 3.2× accident probability vs baseline."
            ),
        ],
    },
    "traffic": {
        "risk_delta_range": (10, 22),
        "speed_factor":     0.72,
        "fallback_insights": [
            (
                "Heavy congestion on NH-48 (Mumbai–Delhi) and Bengaluru Outer Ring Road. "
                "Average delay: 2.4 hrs on urban segments. "
                "Time-window rescheduling reduces fuel cost by ~18%. "
                "S101 advised to hold at Ahmedabad hub for 3 hrs to bypass peak window."
            ),
            (
                "Traffic surge linked to festival weekend — NH-8 and NH-44 at 94% saturation. "
                "Delhi NCR gridlocked until 22:00 IST. "
                "Activate night-transit windows for S101 and S105."
            ),
        ],
    },
    "strike": {
        "risk_delta_range": (32, 52),
        "speed_factor":     0.25,
        "fallback_insights": [
            (
                "Nationwide transport workers' action — throughput at Mumbai, Delhi, Kolkata reduced 75%. "
                "Activate emergency air freight for cold-chain cargo (S102) immediately. "
                "Ground ops expected in 48–72 hrs. Daily revenue exposure: ₹2.4 Cr."
            ),
            (
                "Strike escalating — Truckers' Federation extended action by 48 hrs. "
                "S102 pharmaceutical SLA breach in 18 hrs if not rerouted. "
                "Board-level escalation recommended. Railway freight booking open."
            ),
        ],
    },
}


# ── Gemini Prompt Builders ────────────────────────────────────────────────────

def build_chat_prompt(query: str, ctx: Dict[str, Any]) -> str:
    high_risk = ctx.get("highRisk", [])
    delayed   = ctx.get("delayed", [])
    active_ct = ctx.get("activeShipments", 0)
    total_ct  = ctx.get("totalShipments", 0)
    sim_on    = ctx.get("simulationActive", False)
    last_sim  = ctx.get("lastSimulation", "none")

    high_risk_summary = (
        "\n".join(f"  - {h['id']}: risk {h['riskScore']}/100, status {h['status']}" for h in high_risk)
        if high_risk else "  None"
    )
    delayed_summary = ", ".join(delayed) if delayed else "None"

    return f"""You are SmartChain Copilot — an expert AI embedded in a real-time supply chain command center.

LIVE FLEET DATA:
- Total shipments: {total_ct}
- Active in transit: {active_ct}
- High-risk shipments (risk ≥75):
{high_risk_summary}
- Delayed shipments: {delayed_summary}
- Active disruption simulation: {"YES — " + last_sim.upper() if sim_on and last_sim else "No"}

SYSTEM CONTEXT:
- Risk scale: 0–39 Low | 40–74 Medium | 75–100 High (requires action)
- Rerouting options:
    Route A: −₹6,200 cost · +110 min ETA · −15 risk pts (budget, slower)
    Route B: +₹18,400 cost · −25 min ETA · −22 risk pts (express, recommended for high risk)
- Disruption impacts: storm=55% speed loss | traffic=28% | strike=75%
- All routes are India-wide logistics corridors

RESPONSE RULES:
1. Be concise and actionable — max 120 words
2. Use **bold** for shipment IDs, risk scores, and key numbers
3. Always reference specific IDs (S101, S104, etc.) when present in context
4. If recommending rerouting, state Route A or B with the trade-off clearly
5. If no issues, confirm fleet is healthy confidently
6. Respond like an expert operations manager, not a generic chatbot
7. Use emojis sparingly — only for status indicators (🚨 ✅ ⚠️ 🔀)

USER QUESTION: {query}

Answer:"""


def build_simulation_insight_prompt(disruption: str, speed_factor: float, high_risk_ids: List[str], total: int) -> str:
    speed_loss = round((1 - speed_factor) * 100)
    return f"""You are a senior logistics intelligence analyst.

A {disruption.upper()} disruption has just been applied to an India-wide freight fleet.
- Total shipments affected: {total}
- Speed reduction: {speed_loss}%
- High-risk shipments now (score ≥75): {high_risk_ids if high_risk_ids else 'none'}
- Key India corridors: Mumbai–Delhi (NH-48), Bangalore–Hyderabad (NH-44), Chennai–Kolkata (NH-16)

Write ONE sharp operational insight paragraph (max 55 words) for the operations control room.
- Be specific to Indian logistics geography
- Mention which shipments/corridors are most affected
- State the single most important recommended action
- No bullet points. No preamble. Start directly with the insight.

Insight:"""


# ── Rule-Based Fallback ───────────────────────────────────────────────────────

def rule_based_response(query: str, ctx: Dict[str, Any]) -> str:
    q         = query.lower().strip()
    high_risk = ctx.get("highRisk", [])
    delayed   = ctx.get("delayed", [])
    active_ct = ctx.get("activeShipments", 0)
    total_ct  = ctx.get("totalShipments", 0)
    sim_on    = ctx.get("simulationActive", False)
    last_sim  = ctx.get("lastSimulation", None)
    top       = high_risk[0] if high_risk else None

    if any(k in q for k in ["hello", "hi", "hey", "help", "what can", "who are"]):
        return (
            "👋 Hello! I'm **SmartChain Copilot** — your AI logistics assistant.\n\n"
            "I have live visibility into your fleet. Ask me about:\n"
            "• Risk levels and critical alerts\n"
            "• ETA estimates and schedule adherence\n"
            "• Rerouting recommendations with cost/time trade-offs\n"
            "• Delay root-cause analysis\n"
            "• Disruption simulation insights"
        )

    if any(k in q for k in ["highest risk", "most risk", "dangerous", "critical", "worst", "priority"]):
        if not top:
            return "✅ All shipments are within safe thresholds (below 75/100). Fleet operating normally — no action required."
        return (
            f"🚨 **{top['id']}** is the highest-risk shipment at **{top['riskScore']}/100** (status: {top['status']}).\n\n"
            f"Recommend rerouting via **Route B** (Express Corridor) — reduces risk by ~22 pts and cuts ETA by 25%.\n"
            f"Use the Reroute button in the Shipment Registry table."
        )

    if any(k in q for k in ["delay", "late", "delayed", "behind", "schedule", "overdue"]):
        if not delayed:
            return f"✅ No shipments are delayed. All **{active_ct}** active routes are progressing on schedule."
        ids = ", ".join(f"**{d}**" for d in delayed)
        return (
            f"⚠️ **{len(delayed)}** shipment(s) currently delayed: {ids}.\n\n"
            f"Primary cause: high risk score combined with speed factor below 0.3. "
            f"**Route B** rerouting reduces ETA by 25% and lowers risk by 22 pts — recommended for SLA recovery."
        )

    if any(k in q for k in ["eta", "when", "arriv", "time", "how long", "estimate"]):
        note = (
            f"⚠️ **{len(high_risk)}** high-risk shipment(s) have degraded ETAs due to speed reductions. Rerouting may recover schedule."
            if high_risk else "All ETAs are tracking within normal parameters."
        )
        return f"📦 **{active_ct}** of {total_ct} shipments in active transit. Check the Shipment Registry for per-route ETAs in real-time.\n\n{note}"

    if any(k in q for k in ["reroute", "alternative", "corridor", "bypass", "divert", "route"]):
        if not top:
            return "ℹ️ No shipments currently qualify for emergency rerouting (risk threshold: ≥75). All shipments within safe parameters."
        return (
            f"🔀 **Rerouting recommended** for **{top['id']}** (risk: {top['riskScore']}/100).\n\n"
            f"**Route A** — −₹6,200 · +110 min ETA · −15 risk pts *(budget option)*\n"
            f"**Route B** — +₹18,400 · −25 min ETA · −22 risk pts *(recommended for time-sensitive cargo)*\n\n"
            f"Click **Reroute** next to {top['id']} in the Shipment Registry to proceed."
        )

    if any(k in q for k in ["simulation", "storm", "traffic", "strike", "disruption", "simulate", "weather"]):
        if sim_on and last_sim:
            return (
                f"⚡ **{last_sim.upper()}** simulation is currently active fleet-wide.\n\n"
                f"Speed factor has been reduced and risk scores elevated across all active shipments. "
                f"Review the AI Insights panel for priority actions and use rerouting to mitigate critical exposure."
            )
        return (
            "🌩 **Available disruption simulations:**\n\n"
            "• **Storm** — 55% speed reduction · +35 avg risk\n"
            "• **Traffic** — 28% speed reduction · +15 avg risk\n"
            "• **Strike** — 75% speed reduction · +40 avg risk\n\n"
            "Select a scenario in the **Simulation Engine** panel and click Run — results propagate instantly across all dashboard panels."
        )

    if any(k in q for k in ["speed", "slow", "fast", "performance", "km", "velocity"]):
        return (
            f"📊 Speed data updates every second via Socket.IO.\n\n"
            f"Check the **Telemetry Panel** for rolling average speed chart across all active shipments. "
            + (f"⚠️ **{len(high_risk)}** shipment(s) running below optimal speed due to elevated risk — rerouting can restore normal speed factors." if high_risk else "All vehicles running at normal speed.")
        )

    if any(k in q for k in ["temperature", "temp", "cold", "heat", "cargo"]):
        return (
            "🌡️ Temperature telemetry is tracked per-shipment in real-time.\n\n"
            "Cold-chain cargo (Pharmaceuticals) should remain below 0°C. "
            "The AI Insights panel will automatically flag any shipment exceeding its cargo temperature threshold. "
            "Click a truck marker on the map to see live temperature readings."
        )

    if any(k in q for k in ["status", "summary", "overview", "report", "fleet", "all shipment"]):
        n = len(high_risk)
        priority_str = ", ".join(f"**{h['id']}**" for h in high_risk)
        return (
            f"📋 **Fleet Status Report**\n\n"
            f"• Total: **{total_ct}** shipments\n"
            f"• Active in transit: **{active_ct}**\n"
            f"• High-risk (≥75): **{n}**\n"
            f"• Delayed: **{len(delayed)}**\n"
            f"• Disruption active: **{'Yes — ' + last_sim.upper() if sim_on and last_sim else 'No'}**\n\n"
            + (f"🚨 Immediate action required for: {priority_str}" if n else "✅ No critical issues — fleet operating normally.")
        )

    if any(k in q for k in ["risk score", "risk level", "how risky", "safe"]):
        n = len(high_risk)
        return (
            f"📊 **Fleet Risk Overview**\n\n"
            f"• **{n}** shipment(s) in critical zone (risk ≥ 75)\n"
            f"• Risk scores update every second based on route conditions, speed factors, and simulation overlays\n\n"
            + (f"Priority attention for: {', '.join('**'+h['id']+'**' for h in high_risk)}. Rerouting recommended." if n else "✅ All shipments within safe parameters.")
        )

    # Default
    return (
        f"I have live visibility into your **{total_ct}** shipments (**{active_ct}** active).\n\n"
        "Try asking:\n"
        "• *'Which shipment is highest risk?'*\n"
        "• *'Are any shipments delayed?'*\n"
        "• *'Should I reroute any shipments?'*\n"
        "• *'Give me a fleet status report'*\n"
        "• *'What is the ETA for active routes?'*"
    )


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status":         "ok",
        "service":        "smartchain-ai-service",
        "version":        "2.0.0",
        "gemini_enabled": GEMINI_ENABLED,
        "model":          "gemini-1.5-flash" if GEMINI_ENABLED else "rule-based-fallback",
        "capabilities":   ["simulate-risk", "chat-response"],
    }


@app.get("/debug")
def debug():
    """Diagnostic endpoint — shows exactly why Gemini may not be working."""
    key      = os.environ.get("GEMINI_API_KEY", "")
    key_safe = f"{key[:8]}...{key[-4:]}" if len(key) > 12 else ("(empty)" if not key else "(too short)")
    return {
        "gemini_enabled":        GEMINI_ENABLED,
        "api_key_present":       bool(key),
        "api_key_preview":       key_safe,
        "api_key_length":        len(key),
        "api_key_looks_valid":   key.startswith("AIza") and len(key) > 30,
        "env_file_hint":         "Make sure ai-service/.env has: GEMINI_API_KEY=AIzaSy...",
        "get_key_url":           "https://aistudio.google.com/apikey",
    }


@app.post("/simulate-risk", response_model=SimulateResponse)
def simulate_risk(req: SimulateRequest):
    disruption = req.disruption.lower()
    if disruption not in DISRUPTION_CONFIG:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown disruption: '{disruption}'. Must be storm | traffic | strike"
        )

    cfg          = DISRUPTION_CONFIG[disruption]
    dmin, dmax   = cfg["risk_delta_range"]
    speed_factor = cfg["speed_factor"]

    updated_shipments = []
    generated_events  = []

    for s in req.shipments:
        delta = random.randint(dmin, dmax)

        # Cargo-type sensitivity multiplier for realism
        multiplier = 1.0
        if s.cargoType:
            cl = s.cargoType.lower()
            if "pharmaceutical" in cl: multiplier = 1.18
            elif "electronics"  in cl: multiplier = 1.12
            elif "cold"         in cl: multiplier = 1.15

        delta    = int(delta * multiplier)
        new_risk = min(100, int(s.riskScore + delta))
        new_spd  = max(5.0, round(s.speedKmph * speed_factor, 1))

        sd = s.model_dump()
        sd.update({"riskScore": new_risk, "speedFactor": speed_factor, "speedKmph": new_spd})
        updated_shipments.append(sd)

        if new_risk >= 75:
            generated_events.append({
                "type":       "risk",
                "shipmentId": s.id,
                "message":    f"{s.id} risk escalated to {new_risk} after {disruption} simulation",
                "severity":   "danger",
            })
        elif delta >= 20:
            generated_events.append({
                "type":       "simulation",
                "shipmentId": s.id,
                "message":    f"{s.id} moderately impacted — risk +{delta} from {disruption}",
                "severity":   "warning",
            })

    # Generate simulation insight — Gemini first, preset fallback
    insight = random.choice(cfg["fallback_insights"])
    if GEMINI_ENABLED:
        try:
            high_risk_ids = [s["id"] for s in updated_shipments if s["riskScore"] >= 75]
            prompt  = build_simulation_insight_prompt(disruption, speed_factor, high_risk_ids, len(updated_shipments))
            resp    = gemini_model.generate_content(prompt)
            gemini_insight = resp.text.strip()
            if gemini_insight and len(gemini_insight) > 20:
                insight = gemini_insight
        except Exception as e:
            print(f"Gemini simulation insight error: {e} — using preset")

    return SimulateResponse(
        shipments=updated_shipments,
        insight=insight,
        speedFactor=speed_factor,
        events=generated_events,
    )


@app.post("/chat-response", response_model=ChatResponse)
def chat_response(req: ChatRequest):
    query = (req.query or "").strip()
    ctx   = req.context or {}

    if not query:
<<<<<<< HEAD
        text = "Please ask me something about your fleet."
        return ChatResponse(
            response=text,
            reply=text,
            mode="rule",
=======
        return ChatResponse(
            response="Please ask me something about your fleet.",
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
            source="rule-based",
        )

    # ── Try Gemini ────────────────────────────────────────────────────────────
    if GEMINI_ENABLED:
        try:
            prompt   = build_chat_prompt(query, ctx)
            response = gemini_model.generate_content(prompt)
            text     = response.text.strip()
            if text and len(text) > 10:
<<<<<<< HEAD
                return ChatResponse(
                    response=text,
                    reply=text,          # compatibility
                    mode="ai",           # compatibility
                    confidence=0.96,
                    source="gemini-1.5-flash",
                )
=======
                return ChatResponse(response=text, confidence=0.96, source="gemini-1.5-flash")
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
        except Exception as e:
            print(f"Gemini chat error: {e} — falling back to rule-based")

    # ── Rule-based fallback ───────────────────────────────────────────────────
    text = rule_based_response(query, ctx)
<<<<<<< HEAD
    return ChatResponse(
        response=text,
        reply=text,          # compatibility
        mode="rule",         # compatibility
        confidence=0.85,
        source="rule-based-fallback",
    )
=======
    return ChatResponse(response=text, confidence=0.85, source="rule-based-fallback")
>>>>>>> 3c95eaa62eae174f8612007972778fdf2e1ec6ec
