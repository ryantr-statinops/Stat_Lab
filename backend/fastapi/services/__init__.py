"""Service modules cho Statistical Computing Lab."""

from .inverse_service import (
    exponential_samples,
    geometric_general_samples,
    geometric_samples,
    rayleigh_samples,
    theory_points,
)
from .lcg_service import (
    lcg_generator,
    lcg_cycle_length,
    lcg_steps,
    lcg_with_numpy,
)

__all__ = [
    "exponential_samples",
    "geometric_general_samples",
    "geometric_samples",
    "lcg_cycle_length",
    "lcg_generator",
    "lcg_steps",
    "lcg_with_numpy",
    "rayleigh_samples",
    "theory_points",
]
