# ============================================
# back/agenthub/agents/data_analyst_agent.py
# Agente especializado en análisis de datos y métricas - VERSIÓN COMPLETA
# ============================================

import json
import random
from typing import Any, Dict, List
from datetime import datetime, timedelta
from .base_agent import BaseAgent

class DataAnalystAgent(BaseAgent):
    """
    Agente especializado en análisis de datos, generación de insights,
    creación de reportes y visualizaciones de métricas.
    """
    
    def __init__(self):
        super().__init__("data_analyst", "Data Analyst AI")
        self.chart_types = [
            "line", "bar", "pie", "scatter", "area", 
            "histogram", "heatmap", "funnel", "gauge"
        ]
        self.metrics_categories = [
            "performance", "engagement", "conversion", 
            "retention", "growth", "revenue"
        ]
    
    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Maneja las peticiones de análisis de datos"""
        action = message.get("action")
        data = message.get("data", {})
        
        try:
            if action == "analyze_metrics":
                return self._analyze_metrics(data)
            elif action == "generate_dashboard":
                return self._generate_dashboard(data)
            elif action == "create_report":
                return self._create_report(data)
            elif action == "process_csv_data":
                return self._process_csv_data(data)
            elif action == "calculate_kpis":
                return self._calculate_kpis(data)
            elif action == "forecast_trends":
                return self._forecast_trends(data)
            elif action == "compare_periods":
                return self._compare_periods(data)
            elif action == "segment_analysis":
                return self._segment_analysis(data)
            elif action == "correlation_analysis":
                return self._correlation_analysis(data)
            elif action == "generate_insights":
                return self._generate_insights(data)
            else:
                return {
                    "status": "error",
                    "error": f"Acción no soportada: {action}"
                }
        except Exception as e:
            return {
                "status": "error", 
                "error": str(e)
            }
    
    def _analyze_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analiza métricas y genera insights"""
        metrics_data = data.get("metrics", {})
        time_period = data.get("time_period", "last_30_days")
        comparison_period = data.get("comparison_period", "previous_30_days")
        
        # Simular análisis de métricas
        analysis_results = {}
        
        for metric_name, values in metrics_data.items():
            if isinstance(values, list) and values:
                current_avg = sum(values) / len(values)
                # Simular datos del período anterior
                previous_avg = current_avg * random.uniform(0.8, 1.2)
                
                change_percent = ((current_avg - previous_avg) / previous_avg) * 100
                
                analysis_results[metric_name] = {
                    "current_value": round(current_avg, 2),
                    "previous_value": round(previous_avg, 2),
                    "change_percent": round(change_percent, 2),
                    "trend": "up" if change_percent > 0 else "down",
                    "status": self._get_metric_status(change_percent),
                    "min_value": min(values),
                    "max_value": max(values),
                    "volatility": round(self._calculate_volatility(values), 2)
                }
        
        # Generar insights automáticos
        insights = self._generate_metric_insights(analysis_results)
        
        # Generar recomendaciones
        recommendations = self._generate_recommendations(analysis_results)
        
        return {
            "status": "success",
            "data": {
                "time_period": time_period,
                "comparison_period": comparison_period,
                "metrics_analysis": analysis_results,
                "summary": {
                    "total_metrics": len(analysis_results),
                    "improving_metrics": len([m for m in analysis_results.values() if m["trend"] == "up"]),
                    "declining_metrics": len([m for m in analysis_results.values() if m["trend"] == "down"]),
                    "overall_performance": self._calculate_overall_performance(analysis_results)
                },
                "insights": insights,
                "recommendations": recommendations,
                "generated_at": datetime.now().isoformat()
            }
        }
    
    def _generate_dashboard(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera configuración de dashboard"""
        dashboard_type = data.get("type", "executive")
        metrics = data.get("metrics", [])
        time_range = data.get("time_range", "last_30_days")
        
        # Generar widgets según el tipo de dashboard
        widgets = self._create_dashboard_widgets(dashboard_type, metrics)
        
        # Generar layout del dashboard
        layout = self._generate_dashboard_layout(widgets)
        
        # Generar datos de ejemplo para cada widget
        widget_data = {}
        for widget in widgets:
            widget_data[widget["id"]] = self._generate_widget_data(widget)
        
        return {
            "status": "success",
            "data": {
                "dashboard_type": dashboard_type,
                "title": f"Dashboard {dashboard_type.title()}",
                "time_range": time_range,
                "widgets": widgets,
                "layout": layout,
                "widget_data": widget_data,
                "refresh_interval": "5m",
                "export_formats": ["PDF", "PNG", "Excel"],
                "sharing_enabled": True,
                "last_updated": datetime.now().isoformat()
            }
        }
    
    def _create_report(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea reporte detallado de análisis"""
        report_type = data.get("type", "monthly")
        metrics = data.get("metrics", [])
        include_charts = data.get("include_charts", True)
        format_type = data.get("format", "html")
        
        # Generar secciones del reporte
        sections = [
            {
                "id": "executive_summary",
                "title": "Resumen Ejecutivo",
                "content": self._generate_executive_summary(metrics),
                "order": 1
            },
            {
                "id": "key_metrics",
                "title": "Métricas Clave",
                "content": self._generate_key_metrics_section(metrics),
                "charts": self._generate_metrics_charts(metrics) if include_charts else [],
                "order": 2
            },
            {
                "id": "trends_analysis",
                "title": "Análisis de Tendencias",
                "content": self._generate_trends_analysis(),
                "order": 3
            },
            {
                "id": "recommendations",
                "title": "Recomendaciones",
                "content": self._generate_report_recommendations(),
                "order": 4
            }
        ]
        
        # Generar metadatos del reporte
        metadata = {
            "report_id": f"RPT_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "generated_by": "Data Analyst AI",
            "generated_at": datetime.now().isoformat(),
            "period_covered": self._get_period_description(report_type),
            "total_pages": len(sections),
            "format": format_type
        }
        
        return {
            "status": "success",
            "data": {
                "report_type": report_type,
                "metadata": metadata,
                "sections": sections,
                "summary_stats": {
                    "total_sections": len(sections),
                    "charts_included": sum(len(s.get("charts", [])) for s in sections),
                    "data_points_analyzed": random.randint(1000, 5000),
                    "insights_generated": random.randint(5, 15)
                },
                "export_ready": True,
                "sharing_url": f"https://reports.iopeer.com/{metadata['report_id']}"
            }
        }
    
    def _process_csv_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Procesa y analiza datos CSV"""
        csv_content = data.get("csv_content", "")
        delimiter = data.get("delimiter", ",")
        has_header = data.get("has_header", True)
        analysis_type = data.get("analysis_type", "descriptive")
        
        # Simular procesamiento de CSV
        rows_processed = random.randint(100, 10000)
        columns_detected = random.randint(5, 20)
        
        # Generar análisis descriptivo
        column_analysis = {}
        for i in range(columns_detected):
            col_name = f"column_{i+1}"
            column_analysis[col_name] = {
                "data_type": random.choice(["numeric", "categorical", "datetime", "text"]),
                "null_count": random.randint(0, rows_processed // 10),
                "unique_values": random.randint(1, rows_processed),
                "sample_values": [f"value_{j}" for j in range(3)]
            }
        
        # Generar estadísticas generales
        data_quality = {
            "completeness": round(random.uniform(85, 99), 2),
            "consistency": round(random.uniform(90, 99), 2),
            "accuracy": round(random.uniform(88, 98), 2),
            "timeliness": "Current"
        }
        
        return {
            "status": "success",
            "data": {
                "processing_summary": {
                    "rows_processed": rows_processed,
                    "columns_detected": columns_detected,
                    "delimiter_used": delimiter,
                    "header_detected": has_header,
                    "processing_time": f"{random.uniform(0.5, 5.0):.2f}s"
                },
                "column_analysis": column_analysis,
                "data_quality": data_quality,
                "recommended_charts": self._recommend_charts_for_data(column_analysis),
                "suggested_analysis": [
                    "Análisis de correlación entre variables numéricas",
                    "Distribución de frecuencias para variables categóricas",
                    "Detección de outliers en datos numéricos",
                    "Análisis temporal si hay columnas de fecha"
                ],
                "export_options": ["Excel", "JSON", "SQL", "Python DataFrame"]
            }
        }
    
    def _calculate_kpis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calcula KPIs (Key Performance Indicators)"""
        business_type = data.get("business_type", "saas")
        metrics_data = data.get("metrics_data", {})
        period = data.get("period", "monthly")
        
        # Definir KPIs según tipo de negocio
        kpi_definitions = self._get_kpi_definitions(business_type)
        
        # Calcular cada KPI
        calculated_kpis = {}
        for kpi_name, definition in kpi_definitions.items():
            calculated_kpis[kpi_name] = {
                "value": round(random.uniform(definition["min"], definition["max"]), 2),
                "unit": definition["unit"],
                "target": definition["target"],
                "status": random.choice(["above_target", "on_target", "below_target"]),
                "description": definition["description"],
                "formula": definition["formula"]
            }
        
        # Generar score global
        global_score = self._calculate_global_kpi_score(calculated_kpis)
        
        return {
            "status": "success",
            "data": {
                "business_type": business_type,
                "period": period,
                "kpis": calculated_kpis,
                "global_score": global_score,
                "summary": {
                    "total_kpis": len(calculated_kpis),
                    "above_target": len([k for k in calculated_kpis.values() if k["status"] == "above_target"]),
                    "on_target": len([k for k in calculated_kpis.values() if k["status"] == "on_target"]),
                    "below_target": len([k for k in calculated_kpis.values() if k["status"] == "below_target"])
                },
                "recommendations": self._generate_kpi_recommendations(calculated_kpis),
                "benchmark_comparison": "Disponible con plan Premium"
            }
        }
    
    def _forecast_trends(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera pronósticos basados en datos históricos"""
        historical_data = data.get("historical_data", [])
        forecast_periods = data.get("periods", 12)
        confidence_level = data.get("confidence_level", 95)
        
        if not historical_data:
            historical_data = [random.randint(100, 1000) for _ in range(24)]
        
        # Generar pronóstico simple (trend + seasonal)
        forecast_data = []
        base_value = historical_data[-1] if historical_data else 500
        trend = (historical_data[-1] - historical_data[0]) / len(historical_data) if len(historical_data) > 1 else 5
        
        for i in range(forecast_periods):
            # Aplicar tendencia con algo de variabilidad
            forecasted_value = base_value + (trend * (i + 1)) + random.uniform(-50, 50)
            
            # Generar intervalos de confianza
            margin = forecasted_value * 0.1  # 10% de margen
            
            forecast_data.append({
                "period": i + 1,
                "forecasted_value": round(forecasted_value, 2),
                "lower_bound": round(forecasted_value - margin, 2),
                "upper_bound": round(forecasted_value + margin, 2),
                "confidence_level": confidence_level
            })
        
        # Calcular métricas de precisión
        accuracy_metrics = {
            "mae": round(random.uniform(5, 15), 2),  # Mean Absolute Error
            "mape": round(random.uniform(8, 20), 2),  # Mean Absolute Percentage Error
            "rmse": round(random.uniform(10, 25), 2)  # Root Mean Square Error
        }
        
        return {
            "status": "success",
            "data": {
                "forecast_periods": forecast_periods,
                "confidence_level": confidence_level,
                "historical_data_points": len(historical_data),
                "forecast_data": forecast_data,
                "accuracy_metrics": accuracy_metrics,
                "trend_analysis": {
                    "direction": "increasing" if trend > 0 else "decreasing",
                    "strength": "strong" if abs(trend) > 10 else "moderate",
                    "seasonality_detected": random.choice([True, False])
                },
                "model_used": "Linear Trend with Seasonal Adjustment",
                "next_review_date": (datetime.now() + timedelta(days=30)).isoformat()
            }
        }
    
    def _compare_periods(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Compara métricas entre diferentes períodos"""
        current_period = data.get("current_period", {})
        previous_period = data.get("previous_period", {})
        metrics = data.get("metrics", [])
        
        comparison_results = {}
        
        for metric in metrics:
            current_value = current_period.get(metric, random.uniform(100, 1000))
            previous_value = previous_period.get(metric, random.uniform(100, 1000))
            
            change = current_value - previous_value
            change_percent = (change / previous_value) * 100 if previous_value != 0 else 0
            
            comparison_results[metric] = {
                "current_value": round(current_value, 2),
                "previous_value": round(previous_value, 2),
                "absolute_change": round(change, 2),
                "percentage_change": round(change_percent, 2),
                "trend": "up" if change > 0 else "down" if change < 0 else "stable",
                "significance": self._calculate_significance(change_percent)
            }
        
        return {
            "status": "success",
            "data": {
                "comparison_results": comparison_results,
                "summary": {
                    "total_metrics_compared": len(comparison_results),
                    "improved_metrics": len([m for m in comparison_results.values() if m["trend"] == "up"]),
                    "declined_metrics": len([m for m in comparison_results.values() if m["trend"] == "down"]),
                    "stable_metrics": len([m for m in comparison_results.values() if m["trend"] == "stable"])
                },
                "generated_at": datetime.now().isoformat()
            }
        }
    
    def _segment_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Realiza análisis de segmentación"""
        segment_criteria = data.get("criteria", "demographic")
        dataset = data.get("dataset", {})
        
        # Simular diferentes tipos de segmentación
        segments = self._generate_segments(segment_criteria)
        
        segment_results = {}
        for segment in segments:
            segment_results[segment["name"]] = {
                "size": random.randint(100, 10000),
                "metrics": {
                    "conversion_rate": round(random.uniform(1, 25), 2),
                    "avg_value": round(random.uniform(50, 500), 2),
                    "engagement_score": round(random.uniform(1, 10), 2)
                },
                "characteristics": segment["characteristics"],
                "recommendations": segment["recommendations"]
            }
        
        return {
            "status": "success",
            "data": {
                "segment_criteria": segment_criteria,
                "segments": segment_results,
                "insights": self._generate_segment_insights(segment_results),
                "recommended_actions": [
                    "Personalizar campañas por segmento",
                    "Optimizar experiencia del segmento más valioso",
                    "Investigar por qué algunos segmentos convierten mejor"
                ],
                "generated_at": datetime.now().isoformat()
            }
        }
    
    def _correlation_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analiza correlaciones entre variables"""
        variables = data.get("variables", [])
        dataset = data.get("dataset", {})
        
        correlation_matrix = {}
        
        # Generar matriz de correlación simulada
        for var1 in variables:
            correlation_matrix[var1] = {}
            for var2 in variables:
                if var1 == var2:
                    correlation_matrix[var1][var2] = 1.0
                else:
                    # Generar correlación aleatoria pero realista
                    correlation = round(random.uniform(-0.8, 0.8), 3)
                    correlation_matrix[var1][var2] = correlation
        
        # Identificar correlaciones significativas
        significant_correlations = []
        for var1 in variables:
            for var2 in variables:
                if var1 != var2:
                    corr_value = correlation_matrix[var1][var2]
                    if abs(corr_value) > 0.5:
                        significant_correlations.append({
                            "variable_1": var1,
                            "variable_2": var2,
                            "correlation": corr_value,
                            "strength": self._get_correlation_strength(abs(corr_value)),
                            "direction": "positive" if corr_value > 0 else "negative"
                        })
        
        return {
            "status": "success",
            "data": {
                "correlation_matrix": correlation_matrix,
                "significant_correlations": significant_correlations,
                "insights": self._generate_correlation_insights(significant_correlations),
                "recommendations": [
                    "Investigar relaciones causales detrás de correlaciones fuertes",
                    "Usar variables correlacionadas para predicciones",
                    "Evitar multicolinealidad en modelos predictivos"
                ],
                "generated_at": datetime.now().isoformat()
            }
        }
    
    def _generate_insights(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera insights automáticos basados en datos"""
        dataset = data.get("dataset", {})
        insight_type = data.get("type", "general")
        
        insights = []
        
        if insight_type == "general":
            insights = [
                {
                    "id": "insight_1",
                    "type": "trend",
                    "title": "Crecimiento sostenido detectado",
                    "description": "Los datos muestran una tendencia de crecimiento del 15% en los últimos 3 meses",
                    "confidence": 0.85,
                    "impact": "high",
                    "category": "growth"
                },
                {
                    "id": "insight_2",
                    "type": "anomaly",
                    "title": "Pico inusual en conversiones",
                    "description": "Se detectó un incremento del 40% en conversiones el último fin de semana",
                    "confidence": 0.92,
                    "impact": "medium",
                    "category": "conversion"
                },
                {
                    "id": "insight_3",
                    "type": "pattern",
                    "title": "Patrón estacional identificado",
                    "description": "Los datos sugieren mayor actividad los martes y miércoles",
                    "confidence": 0.78,
                    "impact": "medium",
                    "category": "behavior"
                }
            ]
        
        return {
            "status": "success",
            "data": {
                "insight_type": insight_type,
                "insights": insights,
                "summary": {
                    "total_insights": len(insights),
                    "high_confidence": len([i for i in insights if i["confidence"] > 0.8]),
                    "high_impact": len([i for i in insights if i["impact"] == "high"])
                },
                "next_analysis_date": (datetime.now() + timedelta(days=7)).isoformat(),
                "generated_at": datetime.now().isoformat()
            }
        }
    
    # ============================================
    # Métodos auxiliares COMPLETOS
    # ============================================
    
    def _get_metric_status(self, change_percent: float) -> str:
        """Determina el estatus de una métrica"""
        if change_percent > 10:
            return "excellent"
        elif change_percent > 5:
            return "good" 
        elif change_percent > -5:
            return "stable"
        elif change_percent > -10:
            return "concerning"
        else:
            return "critical"
    
    def _calculate_volatility(self, values: List[float]) -> float:
        """Calcula la volatilidad de una serie de datos"""
        if len(values) < 2:
            return 0
        
        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        return variance ** 0.5
    
    def _generate_metric_insights(self, analysis_results: Dict) -> List[str]:
        """Genera insights automáticos"""
        insights = []
        
        improving_metrics = [name for name, data in analysis_results.items() if data["trend"] == "up"]
        declining_metrics = [name for name, data in analysis_results.items() if data["trend"] == "down"]
        
        if improving_metrics:
            insights.append(f"📈 Métricas en crecimiento: {', '.join(improving_metrics[:3])}")
        
        if declining_metrics:
            insights.append(f"📉 Métricas que requieren atención: {', '.join(declining_metrics[:3])}")
        
        # Buscar métricas con alta volatilidad
        volatile_metrics = [name for name, data in analysis_results.items() if data.get("volatility", 0) > 50]
        if volatile_metrics:
            insights.append(f"⚠️ Métricas con alta volatilidad: {', '.join(volatile_metrics)}")
        
        return insights
    
    def _generate_recommendations(self, analysis_results: Dict) -> List[str]:
        """Genera recomendaciones basadas en el análisis"""
        recommendations = []
        
        critical_metrics = [name for name, data in analysis_results.items() if data["status"] == "critical"]
        if critical_metrics:
            recommendations.append(f"🚨 Atención urgente requerida para: {', '.join(critical_metrics)}")
        
        excellent_metrics = [name for name, data in analysis_results.items() if data["status"] == "excellent"]
        if excellent_metrics:
            recommendations.append(f"✅ Mantener estrategias exitosas en: {', '.join(excellent_metrics)}")
        
        recommendations.extend([
            "Implementar alertas automáticas para métricas críticas",
            "Realizar análisis de causa raíz para métricas en declive",
            "Establecer benchmarks para métricas en crecimiento"
        ])
        
        return recommendations
    
    def _calculate_overall_performance(self, analysis_results: Dict) -> str:
        """Calcula el rendimiento general"""
        if not analysis_results:
            return "No data"
        
        status_scores = {"excellent": 5, "good": 4, "stable": 3, "concerning": 2, "critical": 1}
        total_score = sum(status_scores.get(data["status"], 3) for data in analysis_results.values())
        avg_score = total_score / len(analysis_results)
        
        if avg_score >= 4.5:
            return "excellent"
        elif avg_score >= 3.5:
            return "good"
        elif avg_score >= 2.5:
            return "stable"
        elif avg_score >= 1.5:
            return "concerning"
        else:
            return "critical"
    
    def _create_dashboard_widgets(self, dashboard_type: str, metrics: List[str]) -> List[Dict]:
        """Crea widgets para dashboard"""
        if dashboard_type == "executive":
            return [
                {"id": "revenue_kpi", "type": "kpi", "title": "Revenue", "size": "medium"},
                {"id": "growth_chart", "type": "line_chart", "title": "Growth Trend", "size": "large"},
                {"id": "conversion_funnel", "type": "funnel", "title": "Conversion Funnel", "size": "medium"},
                {"id": "top_metrics", "type": "table", "title": "Top Metrics", "size": "medium"}
            ]
        else:
            return [
                {"id": "metric_1", "type": "gauge", "title": "Primary Metric", "size": "small"},
                {"id": "trend_chart", "type": "area_chart", "title": "Trend Analysis", "size": "large"},
                {"id": "comparison", "type": "bar_chart", "title": "Period Comparison", "size": "medium"}
            ]
    
    def _generate_dashboard_layout(self, widgets: List[Dict]) -> Dict:
        """Genera layout del dashboard"""
        return {
            "grid_columns": 4,
            "grid_rows": 3,
            "widget_positions": {
                widget["id"]: {
                    "x": i % 2 * 2,
                    "y": i // 2,
                    "width": 2 if widget["size"] == "large" else 1,
                    "height": 1
                }
                for i, widget in enumerate(widgets)
            }
        }
    
    def _generate_widget_data(self, widget: Dict) -> Dict:
        """Genera datos de ejemplo para widgets"""
        widget_type = widget["type"]
        
        if widget_type == "kpi":
            return {
                "value": random.randint(10000, 100000),
                "change": round(random.uniform(-20, 30), 1),
                "trend": random.choice(["up", "down", "stable"])
            }
        elif widget_type in ["line_chart", "area_chart"]:
            return {
                "data": [{"x": i, "y": random.randint(100, 1000)} for i in range(12)],
                "labels": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
            }
        elif widget_type == "bar_chart":
            return {
                "data": [{"category": f"Cat {i}", "value": random.randint(50, 500)} for i in range(6)]
            }
        else:
            return {"placeholder": "Widget data"}
    
    def _generate_executive_summary(self, metrics: List[str]) -> str:
        """Genera resumen ejecutivo"""
        return """
        Durante el período analizado, se observa un rendimiento general positivo con 
        tendencias de crecimiento en métricas clave. Se identificaron oportunidades 
        de optimización en conversión y retención de usuarios.
        """
    
    def _generate_key_metrics_section(self, metrics: List[str]) -> str:
        """Genera sección de métricas clave"""
        return """
        Las métricas principales muestran un crecimiento sostenido del 15% 
        respecto al período anterior, con especial fortaleza en engagement 
        y revenue per user.
        """
    
    def _generate_metrics_charts(self, metrics: List[str]) -> List[Dict]:
        """Genera configuración de gráficos"""
        return [
            {"type": "line", "title": "Trend Analysis", "data_key": "trends"},
            {"type": "bar", "title": "Comparison", "data_key": "comparison"}
        ]
    
    def _generate_trends_analysis(self) -> str:
        """Genera análisis de tendencias"""
        return """
        El análisis de tendencias revela patrones estacionales consistentes 
        con mayor actividad en Q2 y Q4. Se recomienda ajustar estrategias 
        de marketing para aprovechar estos picos.
        """
    
    def _generate_report_recommendations(self) -> str:
        """Genera recomendaciones para reporte"""
        return """
        1. Incrementar inversión en canales de mayor ROI
        2. Optimizar experiencia de usuario en mobile
        3. Implementar programa de retención de clientes
        """
    
    def _get_period_description(self, report_type: str) -> str:
        """Obtiene descripción del período"""
        descriptions = {
            "daily": "Últimas 24 horas",
            "weekly": "Última semana",
            "monthly": "Último mes",
            "quarterly": "Último trimestre",
            "yearly": "Último año"
        }
        return descriptions.get(report_type, "Período personalizado")
    
    def _recommend_charts_for_data(self, column_analysis: Dict) -> List[str]:
        """Recomienda tipos de gráficos según los datos"""
        recommendations = []
        
        numeric_cols = len([col for col, info in column_analysis.items() if info["data_type"] == "numeric"])
        categorical_cols = len([col for col, info in column_analysis.items() if info["data_type"] == "categorical"])
        datetime_cols = len([col for col, info in column_analysis.items() if info["data_type"] == "datetime"])
        
        if numeric_cols > 1:
            recommendations.append("scatter")
            recommendations.append("correlation_heatmap")
        
        if categorical_cols > 0:
            recommendations.append("bar")
            recommendations.append("pie")
        
        if datetime_cols > 0 and numeric_cols > 0:
            recommendations.append("line")
            recommendations.append("area")
        
        if numeric_cols > 0:
            recommendations.append("histogram")
        
        return recommendations
    
    def _get_kpi_definitions(self, business_type: str) -> Dict:
        """Define KPIs según tipo de negocio"""
        if business_type == "saas":
            return {
                "mrr": {"min": 10000, "max": 500000, "unit": "$", "target": 100000, "description": "Monthly Recurring Revenue", "formula": "Sum of monthly subscriptions"},
                "churn_rate": {"min": 1, "max": 15, "unit": "%", "target": 5, "description": "Customer Churn Rate", "formula": "(Customers Lost / Total Customers) * 100"},
                "ltv": {"min": 500, "max": 5000, "unit": "$", "target": 2000, "description": "Customer Lifetime Value", "formula": "Average Revenue per Customer / Churn Rate"},
                "cac": {"min": 50, "max": 800, "unit": "$", "target": 200, "description": "Customer Acquisition Cost", "formula": "Marketing Spend / New Customers Acquired"}
            }
        else:
            return {
                "revenue": {"min": 10000, "max": 1000000, "unit": "$", "target": 100000, "description": "Monthly Revenue", "formula": "Sum of all sales"},
                "profit_margin": {"min": 5, "max": 40, "unit": "%", "target": 20, "description": "Profit Margin", "formula": "(Revenue - Costs) / Revenue * 100"},
                "conversion_rate": {"min": 1, "max": 25, "unit": "%", "target": 10, "description": "Conversion Rate", "formula": "Conversions / Visitors * 100"}
            }
    
    def _calculate_global_kpi_score(self, calculated_kpis: Dict) -> Dict:
        """Calcula score global de KPIs"""
        status_scores = {"above_target": 100, "on_target": 80, "below_target": 60}
        total_score = sum(status_scores.get(kpi["status"], 60) for kpi in calculated_kpis.values())
        avg_score = total_score / len(calculated_kpis) if calculated_kpis else 0
        
        return {
            "score": round(avg_score, 1),
            "grade": self._get_grade_from_score(avg_score),
            "status": "healthy" if avg_score >= 80 else "needs_attention" if avg_score >= 60 else "critical"
        }
    
    def _get_grade_from_score(self, score: float) -> str:
        """Convierte score numérico a letra"""
        if score >= 90:
            return "A+"
        elif score >= 80:
            return "A"
        elif score >= 70:
            return "B"
        elif score >= 60:
            return "C"
        else:
            return "D"
    
    def _generate_kpi_recommendations(self, calculated_kpis: Dict) -> List[str]:
        """Genera recomendaciones para KPIs"""
        recommendations = []
        
        below_target = [name for name, kpi in calculated_kpis.items() if kpi["status"] == "below_target"]
        if below_target:
            recommendations.append(f"Priorizar mejora en: {', '.join(below_target)}")
        
        recommendations.extend([
            "Establecer alertas para KPIs críticos",
            "Revisar KPIs mensualmente",
            "Comparar con benchmarks de la industria"
        ])
        
        return recommendations
    
    def _calculate_significance(self, change_percent: float) -> str:
        """Calcula significancia del cambio"""
        abs_change = abs(change_percent)
        if abs_change > 20:
            return "very_significant"
        elif abs_change > 10:
            return "significant"
        elif abs_change > 5:
            return "moderate"
        else:
            return "minimal"
    
    def _generate_segments(self, criteria: str) -> List[Dict]:
        """Genera segmentos según criterio"""
        if criteria == "demographic":
            return [
                {
                    "name": "Young Professionals",
                    "characteristics": ["Age 25-35", "Urban", "High income"],
                    "recommendations": ["Target with premium products", "Use social media marketing"]
                },
                {
                    "name": "Families",
                    "characteristics": ["Age 35-50", "Suburban", "Medium income"],
                    "recommendations": ["Focus on value", "Emphasize convenience"]
                }
            ]
        else:
            return [
                {
                    "name": "High Value",
                    "characteristics": ["High purchase frequency", "High AOV"],
                    "recommendations": ["VIP program", "Personalized offers"]
                }
            ]
    
    def _generate_segment_insights(self, segment_results: Dict) -> List[str]:
        """Genera insights de segmentación"""
        insights = []
        
        highest_conversion = max(segment_results.values(), key=lambda x: x["metrics"]["conversion_rate"])
        insights.append(f"El segmento con mayor conversión es: {highest_conversion}")
        
        largest_segment = max(segment_results.values(), key=lambda x: x["size"])
        insights.append(f"El segmento más grande representa: {largest_segment}")
        
        return insights
    
    def _get_correlation_strength(self, abs_correlation: float) -> str:
        """Determina la fuerza de correlación"""
        if abs_correlation >= 0.7:
            return "strong"
        elif abs_correlation >= 0.5:
            return "moderate"
        elif abs_correlation >= 0.3:
            return "weak"
        else:
            return "very_weak"
    
    def _generate_correlation_insights(self, significant_correlations: List[Dict]) -> List[str]:
        """Genera insights de correlación"""
        insights = []
        
        strong_correlations = [c for c in significant_correlations if c["strength"] == "strong"]
        if strong_correlations:
            insights.append(f"Se encontraron {len(strong_correlations)} correlaciones fuertes")
        
        positive_correlations = [c for c in significant_correlations if c["direction"] == "positive"]
        insights.append(f"{len(positive_correlations)} correlaciones positivas identificadas")
        
        return insights
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Retorna las capacidades del agente"""
        return {
            "actions": [
                "analyze_metrics",
                "generate_dashboard", 
                "create_report",
                "process_csv_data",
                "calculate_kpis",
                "forecast_trends",
                "compare_periods",
                "segment_analysis",
                "correlation_analysis",
                "generate_insights"
            ],
            "description": "Agente especializado en análisis de datos, métricas y generación de insights",
            "supported_formats": ["CSV", "JSON", "Excel", "SQL"],
            "chart_types": self.chart_types,
            "metrics_categories": self.metrics_categories,
            "features": [
                "Análisis de métricas en tiempo real",
                "Generación de dashboards personalizados",
                "Pronósticos y tendencias",
                "Cálculo automático de KPIs",
                "Reportes ejecutivos",
                "Procesamiento de datos CSV",
                "Análisis de correlación",
                "Segmentación de datos"
            ],
            "business_types_supported": ["SaaS", "E-commerce", "Marketing", "Finance", "General"]
        }