"""Service modules cho Statistical Computing Lab."""

from .lcg_service import (
    lcg_generator,
    lcg_cycle_length,
    lcg_steps,
    lcg_with_numpy,
)

__all__ = [
    "lcg_generator",
    "lcg_cycle_length",
    "lcg_steps",
    "lcg_with_numpy",
]
