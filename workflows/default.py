# agenthub/workflows/default.py
from ..orchestrator import orchestrator

def register_default_workflows():
    """Registra workflows predefinidos"""
    
    # Workflow básico de desarrollo de API
    orchestrator.register_workflow(
        name="api_development",
        tasks=[
            "backend_agent.analyze_requirements",
            "backend_agent.suggest_architecture", 
            "backend_agent.generate_api",
            "qa_agent.validate_api_spec",
            "qa_agent.generate_tests"
        ]
    )
    
    # Workflow de testing completo
    orchestrator.register_workflow(
        name="full_testing_suite",
        tasks=[
            "qa_agent.test_api",
            "qa_agent.analyze_code_quality",
            "qa_agent.performance_test",
            "qa_agent.security_scan"
        ]
    )
    
    # Workflow de desarrollo con QA
    orchestrator.register_workflow(
        name="dev_with_qa",
        tasks=[
            "backend_agent.generate_model",
            "backend_agent.generate_crud",
            "qa_agent.generate_tests",
            "qa_agent.test_api"
        ]
    )
    
    # Workflow de análisis de código
    orchestrator.register_workflow(
        name="code_analysis",
        tasks=[
            "qa_agent.analyze_code_quality",
            "qa_agent.security_scan"
        ]
    )
    
    # Workflow paralelo de testing
    orchestrator.register_workflow(
        name="parallel_testing",
        tasks=[
            "qa_agent.test_api",
            "qa_agent.performance_test",
            "qa_agent.security_scan"
        ],
        parallel=True
    )

# Auto-registrar al importar
register_default_workflows()