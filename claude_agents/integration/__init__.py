"""
External system integration
Integration with n8n, memory systems, and other external services
"""

from .n8n_connector.connector import N8NConnector

__all__ = ["N8NConnector"]
