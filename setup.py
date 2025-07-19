# setup.py
from setuptools import setup, find_packages

setup(
    name="agenthub",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.104.1",
        "uvicorn[standard]>=0.24.0",
        "pydantic>=2.5.0",
        "PyYAML>=6.0.1",
        "click>=8.0.0",
        "requests>=2.31.0"
    ],
    entry_points={
        'console_scripts': [
            'agenthub=agenthub.cli:cli',
            'agenthub-server=agenthub.main:run_server',
        ],
    },
    author="AgentHub Team",
    description="Plataforma de orquestación de agentes IA",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    python_requires=">=3.11",
)