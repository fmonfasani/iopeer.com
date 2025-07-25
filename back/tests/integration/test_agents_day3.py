# ============================================
# test_agents_day3.py
# Script para probar todos los agentes del Día 3
# ============================================

import requests
import json
from typing import Dict, Any

class AgentTester:
    """Clase para probar los agentes de IOPeer"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def test_agents_endpoint(self) -> Dict[str, Any]:
        """Prueba el endpoint /agents"""
        print("🧪 Probando endpoint /agents...")
        
        try:
            response = self.session.get(f"{self.base_url}/agents/")
            response.raise_for_status()
            
            agents = response.json()
            print(f"✅ Encontrados {len(agents)} agentes:")
            
            for agent in agents:
                print(f"   - {agent['name']} ({agent['agent_id']})")
                print(f"     Acciones: {len(agent['actions'])} disponibles")
                print(f"     Estado: {agent['status']}")
                print()
            
            return {"status": "success", "agents": agents}
        
        except Exception as e:
            print(f"❌ Error probando /agents: {e}")
            return {"status": "error", "error": str(e)}
    
    def test_ui_component_generator(self) -> Dict[str, Any]:
        """Prueba el UIComponentGeneratorAgent"""
        print("🧪 Probando UIComponentGeneratorAgent...")
        
        test_request = {
            "agent_id": "ui_component_generator",
            "action": "generate_component",
            "data": {
                "type": "button",
                "framework": "react",
                "style_library": "tailwind",
                "props": {
                    "variant": "primary",
                    "size": "md"
                },
                "description": "Botón principal para CTAs"
            }
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/agents/ui_component_generator/execute",
                json=test_request
            )
            response.raise_for_status()
            
            result = response.json()
            if result.get("result", {}).get("status") == "success":
                data = result["result"]["data"]
                print(f"✅ Componente generado exitosamente:")
                print(f"   - Tipo: {data['component_type']}")
                print(f"   - Framework: {data['framework']}")
                print(f"   - Archivo: {data['main_file']['filename']}")
                print(f"   - Dependencias: {len(data['dependencies'])}")
                print()
                return {"status": "success", "data": data}
            else:
                print(f"❌ Error en generación: {result}")
                return {"status": "error", "result": result}
        
        except Exception as e:
            print(f"❌ Error probando UIComponentGenerator: {e}")
            return {"status": "error", "error": str(e)}
    
    def test_data_analyst(self) -> Dict[str, Any]:
        """Prueba el DataAnalystAgent"""
        print("🧪 Probando DataAnalystAgent...")
        
        test_request = {
            "agent_id": "data_analyst",
            "action": "analyze_metrics",
            "data": {
                "metrics": {
                    "page_views": [1000, 1200, 1150, 1300, 1250],
                    "conversions": [50, 60, 55, 65, 70],
                    "revenue": [5000, 6000, 5500, 6500, 7000]
                },
                "time_period": "last_5_days",
                "comparison_period": "previous_5_days"
            }
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/agents/data_analyst/execute",
                json=test_request
            )
            response.raise_for_status()
            
            result = response.json()
            if result.get("result", {}).get("status") == "success":
                data = result["result"]["data"]
                print(f"✅ Análisis completado exitosamente:")
                print(f"   - Métricas analizadas: {data['summary']['total_metrics']}")
                print(f"   - Métricas mejorando: {data['summary']['improving_metrics']}")
                print(f"   - Performance general: {data['summary']['overall_performance']}")
                print(f"   - Insights generados: {len(data['insights'])}")
                print()
                return {"status": "success", "data": data}
            else:
                print(f"❌ Error en análisis: {result}")
                return {"status": "error", "result": result}
        
        except Exception as e:
            print(f"❌ Error probando DataAnalyst: {e}")
            return {"status": "error", "error": str(e)}
    
    def test_content_writer(self) -> Dict[str, Any]:
        """Prueba el ContentWriterAgent"""
        print("🧪 Probando ContentWriterAgent...")
        
        test_request = {
            "agent_id": "content_writer",
            "action": "write_blog_post",
            "data": {
                "topic": "Inteligencia Artificial en el desarrollo web",
                "tone": "professional",
                "word_count": 600,
                "target_audience": "desarrolladores"
            }
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/agents/content_writer/execute",
                json=test_request
            )
            response.raise_for_status()
            
            result = response.json()
            if result.get("result", {}).get("status") == "success":
                data = result["result"]["data"]
                print(f"✅ Contenido generado exitosamente:")
                print(f"   - Tipo: {data['content_type']}")
                print(f"   - Título: {data['title']}")
                print(f"   - Secciones: {len(data['sections'])}")
                print(f"   - Tiempo de lectura: {data['meta']['estimated_reading_time']}")
                print()
                return {"status": "success", "data": data}
            else:
                print(f"❌ Error en generación de contenido: {result}")
                return {"status": "error", "result": result}
        
        except Exception as e:
            print(f"❌ Error probando ContentWriter: {e}")
            return {"status": "error", "error": str(e)}
    
    def test_agent_capabilities(self, agent_id: str) -> Dict[str, Any]:
        """Prueba las capacidades de un agente específico"""
        print(f"🧪 Probando capacidades de {agent_id}...")
        
        try:
            response = self.session.get(f"{self.base_url}/agents/{agent_id}/capabilities")
            response.raise_for_status()
            
            capabilities = response.json()
            print(f"✅ Capacidades de {agent_id}:")
            print(f"   - Acciones: {len(capabilities['actions'])}")
            print(f"   - Descripción: {capabilities['description']}")
            print(f"   - Features: {len(capabilities['features'])}")
            print()
            
            return {"status": "success", "capabilities": capabilities}
        
        except Exception as e:
            print(f"❌ Error probando capacidades de {agent_id}: {e}")
            return {"status": "error", "error": str(e)}
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Ejecuta todas las pruebas"""
        print("🚀 Iniciando pruebas completas del Día 3...\n")
        
        results = {}
        
        # Prueba 1: Endpoint de agentes
        results["agents_endpoint"] = self.test_agents_endpoint()
        
        # Prueba 2: UIComponentGenerator
        results["ui_component_generator"] = self.test_ui_component_generator()
        
        # Prueba 3: DataAnalyst
        results["data_analyst"] = self.test_data_analyst()
        
        # Prueba 4: ContentWriter
        results["content_writer"] = self.test_content_writer()
        
        # Prueba 5: Capacidades de agentes
        agent_ids = ["ui_component_generator", "data_analyst", "content_writer"]
        results["capabilities"] = {}
        for agent_id in agent_ids:
            results["capabilities"][agent_id] = self.test_agent_capabilities(agent_id)
        
        # Resumen final
        print("📊 RESUMEN DE PRUEBAS:")
        print("=" * 50)
        
        total_tests = len([k for k in results.keys() if k != "capabilities"]) + len(results.get("capabilities", {}))
        successful_tests = 0
        
        for test_name, result in results.items():
            if test_name == "capabilities":
                for agent_id, cap_result in result.items():
                    status = "✅" if cap_result.get("status") == "success" else "❌"
                    print(f"{status} Capacidades {agent_id}")
                    if cap_result.get("status") == "success":
                        successful_tests += 1
            else:
                status = "✅" if result.get("status") == "success" else "❌"
                print(f"{status} {test_name}")
                if result.get("status") == "success":
                    successful_tests += 1
        
        print(f"\n🎯 RESULTADO: {successful_tests}/{total_tests} pruebas exitosas")
        
        if successful_tests == total_tests:
            print("🎉 ¡TODOS LOS AGENTES FUNCIONAN CORRECTAMENTE!")
            print("✅ Día 3 completado exitosamente")
        else:
            print("⚠️  Algunos tests fallaron. Revisar logs arriba.")
        
        return results

def main():
    """Función principal para ejecutar pruebas"""
    print("🎯 IOPeer MVP - Pruebas del Día 3")
    print("=" * 50)
    print()
    
    # Verificar que el servidor esté corriendo
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code != 200:
            print("❌ El servidor no está respondiendo en http://localhost:8000")
            print("💡 Asegúrate de ejecutar: uvicorn main:app --reload")
            return
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor en http://localhost:8000")
        print("💡 Asegúrate de ejecutar: uvicorn main:app --reload")
        return
    
    tester = AgentTester()
    results = tester.run_all_tests()
    
    # Guardar resultados
    with open("test_results_day3.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n📄 Resultados guardados en: test_results_day3.json")

if __name__ == "__main__":
    main()

# ============================================
# Comandos para ejecutar las pruebas
# ============================================

"""
INSTRUCCIONES DE USO:

1. Asegúrate de que el backend esté corriendo:
   cd back
   uvicorn main:app --reload

2. En otra terminal, ejecuta las pruebas:
   python test_agents_day3.py

3. También puedes probar endpoints individuales con curl:

   # Listar agentes
   curl http://localhost:8000/agents/

   # Obtener capacidades de un agente
   curl http://localhost:8000/agents/ui_component_generator/capabilities

   # Ejecutar agente UI Generator
   curl -X POST http://localhost:8000/agents/ui_component_generator/execute \
   -H "Content-Type: application/json" \
   -d '{
     "agent_id": "ui_component_generator",
     "action": "generate_component",
     "data": {
       "type": "button",
       "framework": "react",
       "style_library": "tailwind"
     }
   }'

4. Verificar en el frontend:
   - Ir a http://localhost:3000/agents
   - Debería mostrar los 3 agentes
   - Probar interacciones desde la UI

CHECKLIST DÍA 3:
□ Backend corriendo sin errores
□ Endpoint /agents devuelve 3 agentes
□ UIComponentGenerator genera código React
□ DataAnalyst procesa métricas
□ ContentWriter crea contenido
□ Frontend conecta con backend
□ Todas las pruebas pasan
"""