import requests
import json


def test_ui_generator():
    """Test UI Generator specifically"""
    base_url = "http://localhost:8000"

    print("\N{artist palette} Testing UI Generator...\n")

    # Test 1: Check if agent exists
    try:
        response = requests.get(f"{base_url}/agents/ui_generator")
        if response.status_code == 200:
            print("\N{check mark} UI Generator agent found")
            data = response.json()
            print(
                f"   \N{clipboard} Actions: {data.get('capabilities', {}).get('actions', [])}"
            )
        else:
            print(f"\N{cross mark} UI Generator agent not found: HTTP {response.status_code}")
            return
    except Exception as e:
        print(f"\N{cross mark} Failed to check UI Generator: {e}")
        return

    # Test 2: Generate a button
    test_cases = [
        {
            "name": "Basic Button",
            "data": {
                "agent_id": "ui_generator",
                "action": "generate_component",
                "data": {
                    "type": "button",
                    "props": {"name": "TestButton", "text": "Click Me", "variant": "primary"},
                },
            },
        },
        {
            "name": "Card Component",
            "data": {
                "agent_id": "ui_generator",
                "action": "generate_component",
                "data": {
                    "type": "card",
                    "props": {"name": "TestCard", "title": "Sample Card", "shadow": "large"},
                },
            },
        },
    ]

    for test_case in test_cases:
        try:
            response = requests.post(
                f"{base_url}/message/send",
                json=test_case["data"],
                headers={"Content-Type": "application/json"},
            )

            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "success":
                    print(f"\N{check mark} {test_case['name']}: Generated successfully")
                    data = result.get("data", {})
                    print(f"   \N{page facing up} File: {data.get('filename')}")
                    print(f"   \N{straight ruler} Lines: {data.get('estimated_lines', 'N/A')}")
                else:
                    print(f"\N{cross mark} {test_case['name']}: {result.get('error')}")
            else:
                print(f"\N{cross mark} {test_case['name']}: HTTP {response.status_code}")

        except Exception as e:
            print(f"\N{cross mark} {test_case['name']}: {str(e)}")

    print("\n\N{artist palette} UI Generator tests complete!")


if __name__ == "__main__":
    test_ui_generator()
