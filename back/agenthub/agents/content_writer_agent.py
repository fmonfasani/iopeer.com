# ============================================
# back/agenthub/agents/content_writer_agent.py
# Agente especializado en creación de contenido
# ============================================

import re
from typing import Any, Dict, List
from datetime import datetime
from agenthub.base_agent import BaseAgent

class ContentWriterAgent(BaseAgent):
    """
    Agente especializado en creación de contenido para marketing, blogs, 
    redes sociales y documentación técnica.
    """
    
    def __init__(self):
        super().__init__("content_writer", "Content Writer AI")
        self.content_templates = self._load_content_templates()
        self.writing_styles = {
            "professional": "Tono profesional y formal",
            "casual": "Tono casual y conversacional", 
            "technical": "Tono técnico y detallado",
            "marketing": "Tono persuasivo y llamativo",
            "educational": "Tono educativo y explicativo"
        }
    
    def handle(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Maneja las peticiones de creación de contenido"""
        action = message.get("action")
        data = message.get("data", {})
        
        try:
            if action == "write_blog_post":
                return self._write_blog_post(data)
            elif action == "create_social_media":
                return self._create_social_media(data)
            elif action == "generate_product_description":
                return self._generate_product_description(data)
            elif action == "write_email_campaign":
                return self._write_email_campaign(data)
            elif action == "create_landing_copy":
                return self._create_landing_copy(data)
            elif action == "write_documentation":
                return self._write_documentation(data)
            elif action == "generate_seo_content":
                return self._generate_seo_content(data)
            elif action == "create_press_release":
                return self._create_press_release(data)
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
    
    def _write_blog_post(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera un post de blog completo"""
        topic = data.get("topic", "Tecnología")
        style = data.get("style", "professional")
        word_count = data.get("word_count", 800)
        keywords = data.get("keywords", [])
        target_audience = data.get("target_audience", "profesionales")
        
        # Generar título llamativo
        title = self._generate_blog_title(topic, keywords)
        
        # Generar estructura del post
        sections = [
            "Introducción",
            f"¿Qué es {topic}?",
            f"Beneficios de {topic}",
            f"Cómo implementar {topic}",
            "Mejores prácticas",
            "Conclusión"
        ]
        
        # Generar contenido para cada sección
        content_sections = []
        for section in sections:
            section_content = self._generate_section_content(
                section, topic, style, target_audience
            )
            content_sections.append({
                "heading": section,
                "content": section_content
            })
        
        # Generar meta descripción
        meta_description = self._generate_meta_description(topic, keywords)
        
        # Compilar post completo
        full_post = self._compile_blog_post(title, content_sections, keywords)
        
        return {
            "status": "success",
            "data": {
                "title": title,
                "content": full_post,
                "sections": content_sections,
                "meta_description": meta_description,
                "estimated_reading_time": f"{max(1, word_count // 200)} min",
                "word_count": len(full_post.split()),
                "seo_keywords": keywords,
                "style": style,
                "target_audience": target_audience
            }
        }
    
    def _create_social_media(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea contenido para redes sociales"""
        platform = data.get("platform", "linkedin").lower()
        topic = data.get("topic", "tecnología")
        style = data.get("style", "professional")
        include_hashtags = data.get("include_hashtags", True)
        include_call_to_action = data.get("include_call_to_action", True)
        
        platform_specs = {
            "twitter": {"max_chars": 280, "hashtag_count": 2},
            "linkedin": {"max_chars": 3000, "hashtag_count": 5},
            "facebook": {"max_chars": 2000, "hashtag_count": 3},
            "instagram": {"max_chars": 2200, "hashtag_count": 10}
        }
        
        specs = platform_specs.get(platform, platform_specs["linkedin"])
        
        # Generar contenido principal
        main_content = self._generate_social_content(topic, style, platform, specs["max_chars"])
        
        # Generar hashtags
        hashtags = []
        if include_hashtags:
            hashtags = self._generate_hashtags(topic, specs["hashtag_count"])
        
        # Generar call to action
        cta = ""
        if include_call_to_action:
            cta = self._generate_cta(platform)
        
        # Compilar post final
        final_post = main_content
        if cta:
            final_post += f"\n\n{cta}"
        if hashtags:
            final_post += f"\n\n{' '.join(hashtags)}"
        
        return {
            "status": "success",
            "data": {
                "platform": platform,
                "content": final_post,
                "main_content": main_content,
                "hashtags": hashtags,
                "call_to_action": cta,
                "character_count": len(final_post),
                "max_characters": specs["max_chars"],
                "within_limits": len(final_post) <= specs["max_chars"],
                "estimated_engagement": self._estimate_engagement(platform, final_post)
            }
        }
    
    def _generate_product_description(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera descripción de producto optimizada"""
        product_name = data.get("product_name", "Producto")
        features = data.get("features", [])
        benefits = data.get("benefits", [])
        target_audience = data.get("target_audience", "consumidores")
        price_range = data.get("price_range", "medio")
        
        # Generar titular principal
        headline = f"{product_name}: La solución perfecta para {target_audience}"
        
        # Generar descripción principal
        main_description = f"""
{product_name} es la herramienta ideal para {target_audience} que buscan 
una solución eficiente y confiable. Diseñado pensando en la facilidad de uso 
y máximo rendimiento.
"""
        
        # Generar lista de características
        features_section = "\n".join([f"✅ {feature}" for feature in features])
        
        # Generar beneficios
        benefits_section = "\n".join([f"🎯 {benefit}" for benefit in benefits])
        
        # Generar llamada a la acción
        cta = "¡Obtén tu {product_name} hoy mismo y descubre la diferencia!"
        
        full_description = f"""
{headline}

{main_description.strip()}

CARACTERÍSTICAS PRINCIPALES:
{features_section}

BENEFICIOS CLAVE:
{benefits_section}

{cta}
""".strip()
        
        return {
            "status": "success",
            "data": {
                "product_name": product_name,
                "headline": headline,
                "full_description": full_description,
                "main_description": main_description.strip(),
                "features_section": features_section,
                "benefits_section": benefits_section,
                "call_to_action": cta,
                "word_count": len(full_description.split()),
                "target_audience": target_audience,
                "optimization_score": self._calculate_optimization_score(full_description)
            }
        }
    
    def _write_email_campaign(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea campaña de email marketing"""
        campaign_type = data.get("type", "newsletter")
        subject_line = data.get("subject_line", "")
        target_audience = data.get("target_audience", "suscriptores")
        goal = data.get("goal", "engagement")
        personalization = data.get("personalization", True)
        
        # Generar línea de asunto si no se proporciona
        if not subject_line:
            subject_line = self._generate_subject_line(campaign_type, goal)
        
        # Generar contenido del email
        email_content = self._generate_email_content(
            campaign_type, target_audience, goal, personalization
        )
        
        # Generar versión de vista previa
        preview_text = email_content[:150] + "..."
        
        # Generar variaciones del asunto
        subject_variations = [
            subject_line,
            self._generate_subject_line(campaign_type, goal),
            self._generate_subject_line(campaign_type, goal)
        ]
        
        return {
            "status": "success",
            "data": {
                "campaign_type": campaign_type,
                "subject_line": subject_line,
                "subject_variations": subject_variations,
                "email_content": email_content,
                "preview_text": preview_text,
                "target_audience": target_audience,
                "goal": goal,
                "personalization_enabled": personalization,
                "estimated_open_rate": self._estimate_open_rate(subject_line),
                "recommended_send_time": "Martes 10:00 AM",
                "content_length": len(email_content.split())
            }
        }
    
    def _create_landing_copy(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea copy para landing page"""
        product_service = data.get("product_service", "Servicio")
        value_proposition = data.get("value_proposition", "Solución innovadora")
        target_audience = data.get("target_audience", "profesionales")
        pain_points = data.get("pain_points", [])
        
        # Generar headline principal
        headline = f"{value_proposition} para {target_audience}"
        
        # Generar subheadline
        subheadline = f"Resuelve {', '.join(pain_points[:2])} de forma simple y efectiva"
        
        # Generar secciones de la landing
        sections = {
            "hero": {
                "headline": headline,
                "subheadline": subheadline,
                "cta_primary": f"Comenzar con {product_service}"
            },
            "benefits": self._generate_benefits_section(product_service, pain_points),
            "features": self._generate_features_section(product_service),
            "testimonials": self._generate_testimonials_section(),
            "pricing": self._generate_pricing_section(product_service),
            "faq": self._generate_faq_section(product_service),
            "footer_cta": {
                "headline": f"¿Listo para transformar tu experiencia con {product_service}?",
                "cta": "Empezar Ahora"
            }
        }
        
        return {
            "status": "success",
            "data": {
                "product_service": product_service,
                "value_proposition": value_proposition,
                "target_audience": target_audience,
                "sections": sections,
                "complete_copy": self._compile_landing_copy(sections),
                "conversion_optimization_tips": [
                    "Usar prueba social en testimonios",
                    "Incluir garantía de satisfacción",
                    "Optimizar CTAs con colores contrastantes",
                    "Agregar countdown timer para urgencia"
                ]
            }
        }
    
    def _write_documentation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera documentación técnica"""
        doc_type = data.get("type", "user_manual")
        product_name = data.get("product_name", "Software")
        features = data.get("features", [])
        audience_level = data.get("audience_level", "intermediate")
        
        # Generar estructura de documentación
        structure = self._generate_doc_structure(doc_type, features)
        
        # Generar contenido para cada sección
        documentation = {}
        for section in structure:
            documentation[section] = self._generate_doc_section(
                section, product_name, audience_level
            )
        
        # Generar tabla de contenidos
        toc = self._generate_table_of_contents(structure)
        
        return {
            "status": "success",
            "data": {
                "doc_type": doc_type,
                "product_name": product_name,
                "table_of_contents": toc,
                "documentation": documentation,
                "complete_doc": self._compile_documentation(toc, documentation),
                "audience_level": audience_level,
                "estimated_reading_time": f"{len(structure) * 3} minutos",
                "sections_count": len(structure)
            }
        }
    
    def _generate_seo_content(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Genera contenido optimizado para SEO"""
        primary_keyword = data.get("primary_keyword", "tecnología")
        secondary_keywords = data.get("secondary_keywords", [])
        content_type = data.get("content_type", "article")
        target_length = data.get("target_length", 1000)
        
        # Generar título SEO
        seo_title = f"{primary_keyword.title()}: Guía Completa 2025"
        
        # Generar meta descripción
        meta_description = f"Descubre todo sobre {primary_keyword}. Guía completa con tips, mejores prácticas y ejemplos. ¡Lee más!"
        
        # Generar contenido principal
        content = self._generate_seo_optimized_content(
            primary_keyword, secondary_keywords, target_length
        )
        
        # Análisis SEO
        seo_analysis = self._analyze_seo_content(content, primary_keyword, secondary_keywords)
        
        return {
            "status": "success",
            "data": {
                "seo_title": seo_title,
                "meta_description": meta_description,
                "content": content,
                "primary_keyword": primary_keyword,
                "secondary_keywords": secondary_keywords,
                "word_count": len(content.split()),
                "seo_score": seo_analysis["score"],
                "keyword_density": seo_analysis["keyword_density"],
                "recommendations": seo_analysis["recommendations"],
                "readability_score": "Buena (nivel universitario)"
            }
        }
    
    # ============================================
    # Métodos auxiliares de generación
    # ============================================
    
    def _generate_blog_title(self, topic: str, keywords: List[str]) -> str:
        """Genera título atractivo para blog"""
        templates = [
            f"Todo lo que necesitas saber sobre {topic}",
            f"{topic}: Guía completa para principiantes",
            f"Cómo dominar {topic} en 2025",
            f"Los secretos de {topic} que nadie te cuenta",
            f"{topic} paso a paso: Tutorial definitivo"
        ]
        return templates[0]  # Usar el primero por simplicidad
    
    def _generate_section_content(self, section: str, topic: str, style: str, audience: str) -> str:
        """Genera contenido para una sección específica"""
        if "introducción" in section.lower():
            return f"""
En el mundo actual, {topic} se ha convertido en una herramienta fundamental para {audience}. 
Esta guía te ayudará a entender los conceptos clave y cómo aplicarlos en tu contexto.

La importancia de {topic} radica en su capacidad para transformar la manera en que trabajamos 
y nos relacionamos con la tecnología. A lo largo de este artículo, exploraremos los aspectos 
más relevantes que todo profesional debe conocer.
""".strip()
        elif "qué es" in section.lower():
            return f"""
{topic} es una metodología/tecnología/concepto que permite optimizar procesos y mejorar resultados. 
Se caracteriza por su enfoque práctico y su adaptabilidad a diferentes contextos empresariales.

Las principales características incluyen:
• Facilidad de implementación
• Resultados medibles
• Escalabilidad
• Compatibilidad con sistemas existentes
""".strip()
        else:
            return f"Contenido detallado sobre {section} en el contexto de {topic}."
    
    def _generate_social_content(self, topic: str, style: str, platform: str, max_chars: int) -> str:
        """Genera contenido para redes sociales"""
        if platform == "linkedin":
            return f"""
🚀 ¿Sabías que {topic} puede transformar tu productividad?

En mi experiencia trabajando con equipos de alto rendimiento, he observado que quienes dominan {topic} logran:

✅ Mejor eficiencia operacional
✅ Resultados más consistentes  
✅ Mayor satisfacción en el trabajo

La clave está en empezar con pequeños pasos y ser constante.

¿Cuál ha sido tu experiencia con {topic}?
""".strip()
        else:
            return f"Descubre cómo {topic} puede cambiar tu forma de trabajar. Tips y consejos prácticos."
    
    def _generate_hashtags(self, topic: str, count: int) -> List[str]:
        """Genera hashtags relevantes"""
        base_hashtags = [
            f"#{topic.replace(' ', '').lower()}",
            "#productividad",
            "#tecnologia", 
            "#innovacion",
            "#business",
            "#emprendimiento",
            "#marketing",
            "#growth",
            "#tips",
            "#trends2025"
        ]
        return base_hashtags[:count]
    
    def _generate_cta(self, platform: str) -> str:
        """Genera call to action"""
        ctas = {
            "linkedin": "👉 ¿Te ha resultado útil? Comparte tu experiencia en los comentarios",
            "twitter": "💬 Cuéntanos tu opinión",
            "facebook": "👍 ¡Dale like si te pareció interesante!",
            "instagram": "💝 Guarda este post para consultarlo más tarde"
        }
        return ctas.get(platform, "¡Comparte tu opinión!")
    
    def _load_content_templates(self) -> Dict[str, str]:
        """Carga templates de contenido"""
        return {
            "blog_intro": "En el mundo actual de {topic}...",
            "email_greeting": "Hola {name}, espero que estés teniendo una excelente semana...",
            "social_hook": "🚀 ¿Sabías que {fact}?",
            "landing_headline": "La solución que estabas buscando para {problem}"
        }
    
    def _estimate_engagement(self, platform: str, content: str) -> str:
        """Estima engagement basado en contenido"""
        factors = {
            "has_emoji": "📊" in content or "🚀" in content,
            "has_question": "?" in content,
            "has_call_to_action": any(word in content.lower() for word in ["comparte", "comenta", "like"]),
            "optimal_length": 100 < len(content) < 500
        }
        
        score = sum(factors.values())
        if score >= 3:
            return "Alto (8-12%)"
        elif score >= 2:
            return "Medio (4-8%)"
        else:
            return "Bajo (1-4%)"
    
    def _calculate_optimization_score(self, content: str) -> str:
        """Calcula score de optimización"""
        factors = {
            "has_benefits": any(word in content.lower() for word in ["beneficio", "ventaja"]),
            "has_features": "✅" in content,
            "has_cta": any(word in content.lower() for word in ["obtén", "compra", "descarga"]),
            "optimal_length": 150 < len(content.split()) < 300
        }
        
        score = (sum(factors.values()) / len(factors)) * 100
        return f"{score:.0f}% optimizado"
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Retorna las capacidades del agente"""
        return {
            "actions": [
                "write_blog_post",
                "create_social_media",
                "generate_product_description", 
                "write_email_campaign",
                "create_landing_copy",
                "write_documentation",
                "generate_seo_content",
                "create_press_release"
            ],
            "description": "Agente especializado en creación de contenido para marketing y comunicación",
            "supported_platforms": ["LinkedIn", "Twitter", "Facebook", "Instagram"],
            "content_types": ["Blog posts", "Social media", "Email campaigns", "Landing pages", "Documentation"],
            "writing_styles": list(self.writing_styles.keys()),
            "features": [
                "Contenido optimizado para SEO",
                "Múltiples estilos de escritura",
                "Análisis de engagement",
                "Generación de hashtags",
                "Optimización por plataforma"
            ]
        }