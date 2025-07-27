from agenthub.ui_component_generator import UIComponentGeneratorAgent


class UIGeneratorAgent(UIComponentGeneratorAgent):
    """Alias of UIComponentGeneratorAgent with simplified agent ID."""

    def __init__(self) -> None:
        super().__init__()
        self.agent_id = "ui_generator"
        self.name = "UI Generator"
