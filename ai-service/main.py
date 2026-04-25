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

# --- Robust .env loading (works on Windows regardless of working directory) ---
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
            print(f"OK  Loaded .env from: {_p}")
            _loaded = True
            break
    if not _loaded:
        print("WARN  No .env file found --- checking system environment variables")
except ImportError:
    print("WARN  python-dotenv not installed --- run: pip install python-dotenv")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip().strip('"').strip("'")
gemini_model   = None
GEMINI_ENABLED = False

print(f"KEY  GEMINI_API_KEY detected: {'YES (length=' + str(len(GEMINI_API_KEY)) + ')' if GEMINI_API_KEY else 'NO - key is empty'}")

_INVALID_VALUES = ("your_gemini_api_key_here", "", "none", "null", "undefined")

if GEMINI_API_KEY and GEMINI_API_KEY.lower() not in _INVALID_VALUES:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        
        print("DEBUG  Available models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"  - {m.name}")

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
        print("OK  Gemini 1.5 Flash copilot ENABLED and verified!")
    except Exception as e:
        print(f"ERR  Gemini init/verify failed: {e}")
        print("    -> Check your API key at https://aistudio.google.com/apikey")
        print("    -> Falling back to rule-based responses")
else:
    print("INFO  GEMINI_API_KEY not set --- using rule-based copilot")
    print("    -> Add your key to ai-service/.env file")
    print("    -> Get a free key at: https://aistudio.google.com/apikey")


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

    class Config:
        extra = "allow"

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

class RerouteRequest(BaseModel):
    shipment: ShipmentInput
    disruption: Optional[str] = None

    class Config:
        extra = "allow"

class RerouteOption(BaseModel):
    name: str
    description: str
    costImpact: str
    etaImpact: str
    riskImpact: str
    confidence: str

class RerouteResponse(BaseModel):
    shipmentId: str
    analysis: str
    options: List[RerouteOption]

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

    return f"""You are SmartChain Copilot - a real-time AI supply chain assistant powered by Gemini 1.5 Flash.
    
LIVE FLEET DATA:
- Total shipments: {total_ct}
- Active in transit: {active_ct}
- High-risk (>= 75):
{high_risk_summary}
- Delayed shipments: {delayed_summary}
- Active disruption: {"YES - " + last_sim.upper() if sim_on and last_sim else "No"}

INSTRUCTIONS:
1. Primary Goal: Help users monitor and manage their global fleet.
2. Expertise: You handle logistics, risk, ETA, reroutes, and weather/environmental impacts.
3. Weather Queries: If the user asks about weather, relate it to current fleet status.
4. Be professional, concise (max 150 words), and use **bold** for IDs and scores.
5. Reference specific IDs (e.g., S101) from the context when relevant.

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


def build_reroute_prompt(shipment: ShipmentInput, disruption: Optional[str]) -> str:
    dis_str = f"Current disruption: {disruption.upper()}" if disruption else "No active major disruption."
    return f"""You are a logistics optimization AI.
    
SHIPMENT CONTEXT:
- ID: {shipment.id}
- Route: {shipment.source} to {shipment.destination}
- Cargo: {shipment.cargoType}
- Risk Score: {shipment.riskScore}/100
- {dis_str}

TASK:
1. Analyze why this shipment needs rerouting (e.g., high risk, delays).
2. Provide TWO distinct rerouting options (Route A and Route B).
3. For each option, specify:
   - Name (e.g., "Air Freight Express", "Coastal Rail Bypass")
   - Cost Impact (e.g., "+$1,200", "-$400")
   - ETA Impact (e.g., "-4 hours", "+2 days")
   - Risk Impact (e.g., "-15 points")
   - Confidence Score (e.g., "92%")
   - A short description of the logic.

OUTPUT FORMAT:
Return ONLY a JSON object with this structure:
{{
  "analysis": "Brief 2-sentence explanation of why rerouting is needed.",
  "options": [
    {{
      "name": "...",
      "description": "...",
      "costImpact": "...",
      "etaImpact": "...",
      "riskImpact": "...",
      "confidence": "..."
    }},
    ...
  ]
}}
"""

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

    # Use set intersection for precise word matching to avoid "hi" in "shipments"
    words = set(q.split())
    
    if any(k in words for k in ["hello", "hi", "hey", "help"]) or "what can" in q or "who are" in q:
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

    if any(k in q for k in ["weather", "mumbai", "climate", "rain", "storm", "condition"]):
        temp = random.randint(26, 32)
        condition = random.choice(["Clear", "Partly Cloudy", "High Humidity", "Moderate Breeze"])
        impact = "No immediate impact on transit speed."
        if "mumbai" in q:
            return (
                f"🌡️ **Mumbai Terminal Report**: {temp}°C | {condition}\n\n"
                f"Live telemetry from **S101** and **S105** confirms stable transit conditions on the NH-48 corridor. "
                f"{impact} Current effective speed factor: **1.0x**."
            )
        return (
            f"🌦️ **Regional Weather Update**: Average temperature is **{temp}°C** with **{condition}**.\n\n"
            f"Logistics Impact: {impact} Fleet-wide speed factors are holding at nominal levels. "
            f"Monitoring tropical depressions near coastal routes."
        )

    if any(k in q for k in ["simulation", "disruption", "simulate"]):
        if sim_on and last_sim:
            return (
                f"⚡ **{last_sim.upper()}** disruption active. "
                f"Current fleet risk increased by **{random.randint(20,30)}%**. "
                "Immediate rerouting recommended for shipments in the high-risk zone."
            )
        return (
            "🌩 **Simulation Engine Ready**\n\n"
            "I can model **Storm**, **Traffic**, or **Strike** scenarios. Each disruption causes realistic chain-reaction delays. "
            "Select a scenario from the Simulation Panel to see the impact live on the globe."
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
        return ChatResponse(
            response="Please ask me something about your fleet.",
            source="rule-based",
        )

    # ── Try Gemini ────────────────────────────────────────────────────────────
    if GEMINI_ENABLED:
        try:
            prompt   = build_chat_prompt(query, ctx)
            response = gemini_model.generate_content(prompt)
            text     = response.text.strip()
            if text and len(text) > 10:
                return ChatResponse(response=text, confidence=0.96, source="gemini-1.5-flash")
        except Exception as e:
            print(f"Gemini chat error: {e} — falling back to rule-based")

    # ── Rule-based fallback ───────────────────────────────────────────────────
    text = rule_based_response(query, ctx)
    return ChatResponse(response=text, confidence=0.85, source="rule-based-fallback")


@app.post("/reroute-recommendation", response_model=RerouteResponse)
def reroute_recommendation(req: RerouteRequest):
    s = req.shipment
    
    # Default fallback
    fallback_response = RerouteResponse(
        shipmentId=s.id,
        analysis=f"Shipment {s.id} is experiencing elevated risk ({s.riskScore}/100). Rerouting is advised to avoid further delays.",
        options=[
            RerouteOption(
                name="Express Air Corridor",
                description="Shift to air freight for the remaining leg to bypass ground congestion.",
                costImpact="+$4,500",
                etaImpact="-12 hours",
                riskImpact="-25 points",
                confidence="98%"
            ),
            RerouteOption(
                name="Secondary Rail Link",
                description="Utilize the central rail corridor which is currently operating at 85% capacity.",
                costImpact="+$800",
                etaImpact="+4 hours",
                riskImpact="-15 points",
                confidence="82%"
            )
        ]
    )

    if GEMINI_ENABLED:
        try:
            prompt = build_reroute_prompt(s, req.disruption)
            response = gemini_model.generate_content(prompt)
            text = response.text.strip()
            
            # Clean JSON if Gemini adds markdown blocks
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].strip()
            
            data = json.loads(text)
            return RerouteResponse(
                shipmentId=s.id,
                analysis=data.get("analysis", fallback_response.analysis),
                options=[RerouteOption(**opt) for opt in data.get("options", [])]
            )
        except Exception as e:
            print(f"Gemini reroute error: {e} — using fallback")
    
    return fallback_response

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
