"""
Mô phỏng Central Limit Theorem (CLT).

Với các mẫu kích thước n rút từ phân phối bất kỳ có kỳ vọng μ và
phương sai σ² hữu hạn, trung bình mẫu X̄ tiệm cận N(μ, σ²/n).
"""
import math
import random
from typing import List, Optional, Tuple

SUPPORTED_DISTRIBUTIONS = ("uniform", "exponential")


def sample_means(
    n_simulations: int,
    sample_size: int,
    distribution: str = "uniform",
    seed: Optional[int] = None,
) -> List[float]:
    """
    Chạy n_simulations lượt: mỗi lượt lấy mẫu sample_size giá trị
    từ phân phối nền và ghi lại trung bình của mẫu đó.
    """
    if distribution not in SUPPORTED_DISTRIBUTIONS:
        raise ValueError(f"Phân phối nền không hỗ trợ: {distribution}")
    if n_simulations <= 0 or sample_size <= 0:
        return []

    rng = random.Random(seed)
    means: List[float] = []

    for _ in range(n_simulations):
        if distribution == "uniform":
            xs = [rng.random() for _ in range(sample_size)]
        else:  # exponential(rate=1): f(x) = e^(-x), x >= 0
            xs = [rng.expovariate(1.0) for _ in range(sample_size)]
        means.append(sum(xs) / sample_size)

    return means


def theoretical_mean_se(sample_size: int, distribution: str) -> Tuple[float, float]:
    """
    Trả về (μ, SE = σ/√n) theo lý thuyết của trung bình mẫu.

      uniform[0,1):     μ = 1/2, σ² = 1/12
      exponential(λ=1): μ = 1,   σ² = 1
    """
    if sample_size < 1:
        raise ValueError("sample_size phải >= 1")
    if distribution == "uniform":
        return 0.5, math.sqrt((1.0 / 12.0) / sample_size)
    if distribution == "exponential":
        return 1.0, math.sqrt(1.0 / sample_size)
    raise ValueError(f"Phân phối nền không hỗ trợ: {distribution}")
