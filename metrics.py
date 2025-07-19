# agenthub/metrics.py
import time
from collections import defaultdict, deque
from typing import Dict, Any
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class Metric:
    name: str
    value: float
    timestamp: datetime
    tags: Dict[str, str] = None

class MetricsCollector:
    """Colector de métricas del sistema"""
    
    def __init__(self, max_history=1000):
        self.metrics: Dict[str, deque] = defaultdict(lambda: deque(maxlen=max_history))
        self.counters: Dict[str, int] = defaultdict(int)
        self.timers: Dict[str, list] = defaultdict(list)
        
    def increment(self, name: str, tags: Dict[str, str] = None):
        """Incrementa un contador"""
        key = self._make_key(name, tags)
        self.counters[key] += 1
        
        metric = Metric(name, self.counters[key], datetime.utcnow(), tags)
        self.metrics[key].append(metric)
    
    def gauge(self, name: str, value: float, tags: Dict[str, str] = None):
        """Registra un valor gauge"""
        key = self._make_key(name, tags)
        
        metric = Metric(name, value, datetime.utcnow(), tags)
        self.metrics[key].append(metric)
    
    def timer(self, name: str, tags: Dict[str, str] = None):
        """Context manager para medir tiempo"""
        return TimerContext(self, name, tags)
    
    def histogram(self, name: str, value: float, tags: Dict[str, str] = None):
        """Registra un valor en histograma"""
        key = self._make_key(name, tags)
        self.timers[key].append(value)
        
        # Mantener solo los últimos 1000 valores
        if len(self.timers[key]) > 1000:
            self.timers[key] = self.timers[key][-1000:]
    
    def get_metrics(self, since: datetime = None) -> Dict[str, Any]:
        """Obtiene métricas agregadas"""
        if since is None:
            since = datetime.utcnow() - timedelta(hours=1)
        
        result = {
            "counters": dict(self.counters),
            "histograms": {},
            "recent_metrics": {}
        }
        
        # Procesar histogramas
        for key, values in self.timers.items():
            if values:
                result["histograms"][key] = {
                    "count": len(values),
                    "min": min(values),
                    "max": max(values),
                    "avg": sum(values) / len(values),
                    "p50": self._percentile(values, 50),
                    "p95": self._percentile(values, 95),
                    "p99": self._percentile(values, 99)
                }
        
        # Métricas recientes
        for key, metrics in self.metrics.items():
            recent = [m for m in metrics if m.timestamp >= since]
            if recent:
                result["recent_metrics"][key] = {
                    "count": len(recent),
                    "latest": recent[-1].value,
                    "avg": sum(m.value for m in recent) / len(recent)
                }
        
        return result
    
    def _make_key(self, name: str, tags: Dict[str, str] = None) -> str:
        """Crea clave única para métrica"""
        if not tags:
            return name
        
        tag_str = ",".join(f"{k}={v}" for k, v in sorted(tags.items()))
        return f"{name}[{tag_str}]"
    
    def _percentile(self, values: list, percentile: int) -> float:
        """Calcula percentil de una lista de valores"""
        if not values:
            return 0.0
        
        sorted_values = sorted(values)
        index = (percentile / 100.0) * (len(sorted_values) - 1)
        
        if index.is_integer():
            return sorted_values[int(index)]
        
        lower = sorted_values[int(index)]
        upper = sorted_values[int(index) + 1]
        return lower + (upper - lower) * (index - int(index))

class TimerContext:
    """Context manager para medir tiempo"""
    
    def __init__(self, collector: MetricsCollector, name: str, tags: Dict[str, str] = None):
        self.collector = collector
        self.name = name
        self.tags = tags
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.start_time:
            elapsed = time.time() - self.start_time
            self.collector.histogram(f"{self.name}.duration", elapsed, self.tags)

# Instancia global
metrics = MetricsCollector()