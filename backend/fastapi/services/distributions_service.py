"""
Service lấy mẫu các phân phối xác suất cơ bản.

Box-Muller: từ 2 biến ngẫu nhiên đều U1, U2 ~ Uniform(0, 1),
hai đại lượng sau là độc lập và có phân phối chuẩn tắc:
    Z0 = sqrt(-2 ln U1) · cos(2π U2)
    Z1 = sqrt(-2 ln U1) · sin(2π U2)
"""
import math
import random
from typing import List, Optional


def box_muller_samples(
    mean: float = 0.0,
    std: float = 1.0,
    n: int = 1000,
    seed: Optional[int] = None,
) -> List[float]:
    """
    Sinh n mẫu N(mean, std^2) bằng biến đổi Box-Muller.

    Dùng random.Random(seed) để có thể tái lập kết quả khi truyền seed.
    """
    if n <= 0:
        return []

    rng = random.Random(seed)
    samples: List[float] = []

    while len(samples) < n:
        u1 = rng.random()
        u2 = rng.random()
        if u1 <= 0.0:  # tránh log(0)
            continue
        radius = math.sqrt(-2.0 * math.log(u1))
        angle = 2.0 * math.pi * u2
        samples.append(mean + std * radius * math.cos(angle))
        if len(samples) < n:
            samples.append(mean + std * radius * math.sin(angle))

    return samples


def uniform_samples(n: int = 1000, seed: Optional[int] = None) -> List[float]:
    """Sinh n mẫu đều trên [0, 1) — phân phối nền cho demo CLT."""
    if n <= 0:
        return []
    rng = random.Random(seed)
    return [rng.random() for _ in range(n)]
