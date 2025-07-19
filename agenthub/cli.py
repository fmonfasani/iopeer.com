# agenthub/cli.py
import json
from pathlib import Path
from typing import Optional

import click
import requests


@click.group()
@click.option("--host", default="localhost", help="AgentHub host")
@click.option("--port", default=8000, help="AgentHub port")
@click.pass_context
def cli(ctx, host, port):
    """AgentHub CLI - Interact with AgentHub from command line"""
    ctx.ensure_object(dict)
    ctx.obj["base_url"] = f"http://{host}:{port}"


@cli.command()
@click.pass_context
def status(ctx):
    """Get AgentHub status"""
    try:
        response = requests.get(f"{ctx.obj['base_url']}/health")
        if response.status_code == 200:
            data = response.json()
            click.echo(f"✅ AgentHub is {data['status']}")
            click.echo(f"📊 Stats: {data.get('stats', {})}")
        else:
            click.echo(f"❌ AgentHub is not healthy (status: {response.status_code})")
    except requests.exceptions.ConnectionError:
        click.echo("❌ Cannot connect to AgentHub")


@cli.command()
@click.pass_context
def agents(ctx):
    """List all agents"""
    try:
        response = requests.get(f"{ctx.obj['base_url']}/agents")
        if response.status_code == 200:
            data = response.json()
            click.echo(f"🤖 Found {data['total']} agents:")
            for agent in data["agents"]:
                click.echo(
                    f"  - {agent['agent_id']} ({agent['type']}) - {agent['status']}"
                )
        else:
            click.echo(f"❌ Error: {response.status_code}")
    except requests.exceptions.ConnectionError:
        click.echo("❌ Cannot connect to AgentHub")


@cli.command()
@click.argument("agent_id")
@click.argument("action")
@click.option("--data", help="JSON data for the action")
@click.pass_context
def send(ctx, agent_id, action, data):
    """Send message to an agent"""
    try:
        payload = {"agent_id": agent_id, "action": action}

        if data:
            try:
                payload["data"] = json.loads(data)
            except json.JSONDecodeError:
                click.echo("❌ Invalid JSON data")
                return

        response = requests.post(f"{ctx.obj['base_url']}/message/send", json=payload)

        if response.status_code == 200:
            result = response.json()
            click.echo("✅ Message sent successfully")
            click.echo(f"📄 Result: {json.dumps(result['result'], indent=2)}")
        else:
            click.echo(f"❌ Error: {response.status_code} - {response.text}")

    except requests.exceptions.ConnectionError:
        click.echo("❌ Cannot connect to AgentHub")


@cli.command()
@click.pass_context
def workflows(ctx):
    """List all workflows"""
    try:
        response = requests.get(f"{ctx.obj['base_url']}/workflows")
        if response.status_code == 200:
            data = response.json()
            click.echo(f"⚡ Found {data['total']} workflows:")
            for workflow in data["workflows"]:
                click.echo(f"  - {workflow['name']}: {workflow.get('tasks', [])}")
        else:
            click.echo(f"❌ Error: {response.status_code}")
    except requests.exceptions.ConnectionError:
        click.echo("❌ Cannot connect to AgentHub")


@cli.command()
@click.argument("workflow_name")
@click.option("--data", help="JSON data for the workflow")
@click.pass_context
def run(ctx, workflow_name, data):
    """Run a workflow"""
    try:
        payload = {"workflow": workflow_name}

        if data:
            try:
                payload["data"] = json.loads(data)
            except json.JSONDecodeError:
                click.echo("❌ Invalid JSON data")
                return

        response = requests.post(f"{ctx.obj['base_url']}/workflow/start", json=payload)

        if response.status_code == 200:
            result = response.json()
            click.echo("✅ Workflow started successfully")
            click.echo(f"🆔 Execution ID: {result['execution_id']}")
            click.echo(f"⏱️ Duration: {result['execution_time']:.2f}s")
            click.echo(f"📊 Status: {result['status']}")
        else:
            click.echo(f"❌ Error: {response.status_code} - {response.text}")

    except requests.exceptions.ConnectionError:
        click.echo("❌ Cannot connect to AgentHub")


@cli.command()
@click.argument("project_name")
@click.option("--template", default="basic", help="Project template")
def init(project_name, template):
    """Initialize a new AgentHub project"""
    project_path = Path(project_name)

    if project_path.exists():
        click.echo(f"❌ Directory {project_name} already exists")
        return

    click.echo(f"🏗️ Creating new AgentHub project: {project_name}")

    # Crear estructura de directorios
    project_path.mkdir()
    (project_path / "agents").mkdir()
    (project_path / "workflows").mkdir()
    (project_path / "tests").mkdir()

    # Crear archivos básicos
    with open(project_path / "config.yaml", "w") as f:
        f.write(
            """
env: development
host: 0.0.0.0
port: 8000
debug: true
log_level: INFO
"""
        )

    with open(project_path / "registry.json", "w") as f:
        json.dump(
            [{"id": "example_agent", "class": "ExampleAgent", "config": {}}],
            f,
            indent=2,
        )

    with open(project_path / "agents" / "example_agent.py", "w") as f:
        f.write(
            """
from agenthub.agents.base_agent import BaseAgent

class ExampleAgent(BaseAgent):
    def __init__(self):
        super().__init__(agent_id="example_agent", name="Example Agent")

    def handle(self, message):
        action = message.get("action")
        if action == "hello":
            return {"status": "success", "message": "Hello World!"}
        else:
            return {"status": "error", "message": f"Unknown action: {action}"}

    def get_capabilities(self):
        return {
            "actions": ["hello"],
            "description": "Example agent for demonstration"
        }
"""
        )

    click.echo(f"✅ Project {project_name} created successfully!")
    click.echo(f"📁 Next steps:")
    click.echo(f"   cd {project_name}")
    click.echo(f"   agenthub-server")


if __name__ == "__main__":
    cli()
