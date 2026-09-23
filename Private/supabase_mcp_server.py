"""
Ali CNC & PAI Supabase FastMCP Server
Exposes live Supabase PostgREST & RPC endpoints to Antigravity and Cursor.
Authenticated via PAI Service Role credentials from C:\\Ali CNC\\DSKP SNAP X 18SEP26\\PAI\\.env
"""

import os
import sys
import json
import httpx
from typing import Optional, Dict, Any
from mcp.server.fastmcp import FastMCP

# Supabase Credentials (PAI Master Vault)
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://slwehnfipdsnpmgycuwx.supabase.co").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.getenv(
    "SUPABASE_SERVICE_ROLE_KEY",
    "REDACTED_SUPABASE_KEY"
)
SUPABASE_PROJECT_REF = os.getenv("SUPABASE_PROJECT_REF", "slwehnfipdsnpmgycuwx")

mcp = FastMCP("Supabase PAI Sentinel")

def get_headers(prefer: Optional[str] = None) -> Dict[str, str]:
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    if prefer:
        headers["Prefer"] = prefer
    return headers

@mcp.tool()
def supabase_status() -> str:
    """Verify live connectivity, project reference, and status of Supabase PAI database."""
    try:
        url = f"{SUPABASE_URL}/rest/v1/"
        resp = httpx.get(url, headers=get_headers(), timeout=15.0)
        return json.dumps({
            "status": "ONLINE" if resp.status_code == 200 else f"HTTP_{resp.status_code}",
            "project_ref": SUPABASE_PROJECT_REF,
            "supabase_url": SUPABASE_URL,
            "auth_mode": "service_role",
            "postgrest_active": resp.status_code == 200
        }, indent=2)
    except Exception as e:
        return json.dumps({
            "status": "OFFLINE",
            "project_ref": SUPABASE_PROJECT_REF,
            "supabase_url": SUPABASE_URL,
            "error": str(e)
        }, indent=2)

@mcp.tool()
def supabase_list_tables() -> str:
    """Inspect OpenAPI schema to list all database tables and views in Supabase."""
    try:
        url = f"{SUPABASE_URL}/rest/v1/"
        resp = httpx.get(url, headers=get_headers(), timeout=15.0)
        if resp.status_code == 200:
            spec = resp.json()
            definitions = list(spec.get("definitions", {}).keys())
            paths = list(spec.get("paths", {}).keys())
            return json.dumps({
                "tables_and_views": definitions,
                "endpoints": paths
            }, indent=2)
        return f"Error ({resp.status_code}): {resp.text}"
    except Exception as e:
        return f"Supabase Error: {str(e)}"

@mcp.tool()
def supabase_select(table: str, columns: str = "*", match_column: str = "", match_value: str = "", limit: int = 50) -> str:
    """Query rows from a Supabase table with optional column matching filter and row limit."""
    try:
        url = f"{SUPABASE_URL}/rest/v1/{table}?select={columns}&limit={limit}"
        if match_column and match_value:
            url += f"&{match_column}=eq.{match_value}"
        resp = httpx.get(url, headers=get_headers(), timeout=20.0)
        if resp.status_code == 200:
            return json.dumps(resp.json(), indent=2)
        return f"Select Error ({resp.status_code}): {resp.text}"
    except Exception as e:
        return f"Supabase Select Error: {str(e)}"

@mcp.tool()
def supabase_insert(table: str, data_json: str) -> str:
    """Insert one or multiple rows (JSON object or JSON array string) into a Supabase table."""
    try:
        payload = json.loads(data_json)
        url = f"{SUPABASE_URL}/rest/v1/{table}"
        headers = get_headers(prefer="return=representation")
        resp = httpx.post(url, headers=headers, json=payload, timeout=20.0)
        if resp.status_code in (200, 201):
            return json.dumps(resp.json(), indent=2)
        return f"Insert Error ({resp.status_code}): {resp.text}"
    except Exception as e:
        return f"Supabase Insert Error: {str(e)}"

@mcp.tool()
def supabase_update(table: str, match_column: str, match_value: str, update_json: str) -> str:
    """Update rows in a Supabase table where match_column equals match_value."""
    try:
        payload = json.loads(update_json)
        url = f"{SUPABASE_URL}/rest/v1/{table}?{match_column}=eq.{match_value}"
        headers = get_headers(prefer="return=representation")
        resp = httpx.patch(url, headers=headers, json=payload, timeout=20.0)
        if resp.status_code in (200, 204):
            return json.dumps(resp.json() if resp.text else {"status": "updated"}, indent=2)
        return f"Update Error ({resp.status_code}): {resp.text}"
    except Exception as e:
        return f"Supabase Update Error: {str(e)}"

@mcp.tool()
def supabase_delete(table: str, match_column: str, match_value: str) -> str:
    """Delete rows from a Supabase table where match_column equals match_value."""
    try:
        url = f"{SUPABASE_URL}/rest/v1/{table}?{match_column}=eq.{match_value}"
        resp = httpx.delete(url, headers=get_headers(), timeout=20.0)
        if resp.status_code in (200, 204):
            return json.dumps({"status": "deleted", "filter": f"{match_column}={match_value}"})
        return f"Delete Error ({resp.status_code}): {resp.text}"
    except Exception as e:
        return f"Supabase Delete Error: {str(e)}"

@mcp.tool()
def supabase_rpc(function_name: str, args_json: str = "{}") -> str:
    """Invoke a Supabase RPC stored procedure / PostgreSQL function."""
    try:
        payload = json.loads(args_json)
        url = f"{SUPABASE_URL}/rest/v1/rpc/{function_name}"
        resp = httpx.post(url, headers=get_headers(), json=payload, timeout=25.0)
        if resp.status_code in (200, 201):
            return json.dumps(resp.json(), indent=2)
        return f"RPC Error ({resp.status_code}): {resp.text}"
    except Exception as e:
        return f"Supabase RPC Error: {str(e)}"

@mcp.tool()
def supabase_get_memories(category: str = "", limit: int = 20) -> str:
    """Retrieve PAI long-term memory vault entries (category optional: identity, workshop, hardware, projects, ledger)."""
    try:
        url = f"{SUPABASE_URL}/rest/v1/memories?select=id,category,sneak_key,title,content,created_at&order=created_at.desc&limit={limit}"
        if category:
            url += f"&category=eq.{category}"
        resp = httpx.get(url, headers=get_headers(), timeout=20.0)
        if resp.status_code == 200:
            return json.dumps(resp.json(), indent=2)
        return f"Memories Error ({resp.status_code}): {resp.text}"
    except Exception as e:
        return f"Supabase Memories Error: {str(e)}"

@mcp.tool()
def supabase_log_memory(category: str, title: str, content: str, sneak_key: str = "") -> str:
    """Store a high-signal memory into PAI memory vault with category and optional sneak_key."""
    try:
        payload = {
            "category": category,
            "title": title,
            "content": content,
            "sneak_key": sneak_key or None,
            "metadata": {"source": "antigravity_mcp"}
        }
        url = f"{SUPABASE_URL}/rest/v1/memories"
        resp = httpx.post(url, headers=get_headers(prefer="return=representation"), json=payload, timeout=20.0)
        if resp.status_code in (200, 201):
            return json.dumps(resp.json(), indent=2)
        return f"Log Memory Error ({resp.status_code}): {resp.text}"
    except Exception as e:
        return f"Supabase Log Memory Error: {str(e)}"

@mcp.tool()
def supabase_get_agent_prompts() -> str:
    """Retrieve active AI personas and system instructions from the agent_prompts table."""
    try:
        url = f"{SUPABASE_URL}/rest/v1/agent_prompts?select=*&is_active=eq.true"
        resp = httpx.get(url, headers=get_headers(), timeout=20.0)
        if resp.status_code == 200:
            return json.dumps(resp.json(), indent=2)
        return f"Agent Prompts Error ({resp.status_code}): {resp.text}"
    except Exception as e:
        return f"Supabase Prompts Error: {str(e)}"

if __name__ == "__main__":
    mcp.run(transport="stdio")
