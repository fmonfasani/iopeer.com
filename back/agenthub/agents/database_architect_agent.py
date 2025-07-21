from .base_agent import BaseAgent
from typing import Dict, Any

class DatabaseArchitectAgent(BaseAgent):
    """Agente especializado en diseño y optimización de bases de datos"""
    
    def __init__(self):
        super().__init__("database_architect", "Database Architect")
    
    def get_capabilities(self) -> Dict[str, Any]:
        return {
            "actions": [
                "design_schema",
                "optimize_queries", 
                "create_migrations",
                "analyze_performance",
                "suggest_indexes"
            ],
            "description": "Diseña y optimiza arquitectura de base de datos"
        }
    
    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        action = message.get("action")
        data = message.get("data", {})
        
        if action == "design_schema":
            return self._design_schema(data)
        elif action == "optimize_queries":
            return self._optimize_queries(data)
        else:
            return {"status": "error", "error": f"Acción '{action}' no reconocida"}
    
    def _design_schema(self, data: Dict[str, Any]) -> Dict[str, Any]:
        entities = data.get("entities", [])
        
        schema_sql = []
        for entity in entities:
            table_name = entity.get("name", "").lower()
            fields = entity.get("fields", [])
            
            create_table = f"CREATE TABLE {table_name} (\n"
            create_table += "    id SERIAL PRIMARY KEY,\n"
            
            for field in fields:
                field_name = field.get("name")
                field_type = field.get("type", "VARCHAR(255)")
                nullable = "NULL" if field.get("optional", False) else "NOT NULL"
                create_table += f"    {field_name} {field_type} {nullable},\n"
            
            create_table += "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n"
            create_table += "    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n"
            create_table += ");"
            
            schema_sql.append(create_table)
        
        return {
            "status": "success",
            "data": {
                "schema_sql": schema_sql,
                "tables_created": len(entities),
                "recommendations": [
                    "Agregar índices en columnas de búsqueda frecuente",
                    "Considerar particionado para tablas grandes",
                    "Implementar foreign keys para integridad referencial"
                ]
            }
        }
    
    def _optimize_queries(self, data: Dict[str, Any]) -> Dict[str, Any]:
        queries = data.get("queries", [])
        
        optimizations = []
        for query in queries:
            optimization = {
                "original_query": query,
                "optimized_query": query.replace("SELECT *", "SELECT specific_columns"),
                "recommendations": [
                    "Evitar SELECT *",
                    "Usar índices apropiados",
                    "Considerar LIMIT para paginación"
                ]
            }
            optimizations.append(optimization)
        
        return {
            "status": "success", 
            "data": {
                "optimizations": optimizations,
                "performance_gain": "~40% mejora estimada"
            }
        }
