"""
Claude Crew Migration System
A hybrid Claude + n8n architecture for AI agency and business process automation
"""

__version__ = "1.0.0"
__author__ = "pbradygeorgen"
__description__ = "Claude crew coordination system with n8n workflow integration"

from .coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
from .core.captain_picard.agent import CaptainPicardAgent
from .integration.n8n_connector.connector import N8NConnector

__all__ = [
    "ObservationLoungeCoordinator",
    "CaptainPicardAgent", 
    "N8NConnector"
]
