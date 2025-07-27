import requests
import json


def test_api():
    """Quick API test after setup"""
    base_url = "http://localhost:8000"

    tests = [
        ("Root endpoint", "GET", "/"),
        ("Health check", "GET", "/health"),
        ("Agents list", "GET", "/agents"),
        ("Frontend config", "GET", "/frontend/config"),
        ("UI Generator details", "GET", "/agents/ui_generator"),
        ("Workflows list", "GET", "/workflows"),
    ]

    print("\N{test tube} Running quick API tests...\n")

    for test_name, method, endpoint in tests:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)

            if response.status_code == 200:
                print(f"\N{check mark} {test_name}: OK")

                # Show key data for some endpoints
                if endpoint == "/":
                    data = response.json()
                    print(
                        f"   \N{bar chart} Agents: {data.get('agents')}, Workflows: {data.get('workflows')}"
                    )
                elif endpoint == "/agents":
                    data = response.json()
                    agents = [agent['agent_id'] for agent in data.get('agents', [])]
                    print(f"   \N{robot} Loaded agents: {agents}")

            else:
                print(f"\N{cross mark} {test_name}: HTTP {response.status_code}")

        except requests.exceptions.ConnectionError:
            print(f"\N{electric plug} {test_name}: Server not running")
        except Exception as e:
            print(f"\N{cross mark} {test_name}: {str(e)}")

    print("\n\N{test tube} Quick tests complete!")


if __name__ == "__main__":
    test_api()
