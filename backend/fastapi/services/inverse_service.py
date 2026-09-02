"""
Service lấy mẫu theo phép biến đổi ngược (Inverse Transform).

Ý tưởng chung: nếu U ~ Uniform(0, 1) thì X = F⁻¹(U) có phân phối F.
Mirror từ lab/R/inverse_transform_examples.R:
    geometric_inverse_transform_generator(n, p)        — Ví dụ 4
    exponential_inverse_transform(n, lambda)           — Ví dụ 5
    rayleigh_inverse_transform(n, sigma)               — Ví dụ 6
    geometric_inverse_transform_general(n, p)          — Ví dụ 9
"""
import math
import random
from typing import Dict, List, Optional


def geometric_samples(
    n: int = 1000, p: float = 0.3, seed: Optional[int] = None
) -> List[float]:
    """
    Phân phối hình học hỗ trợ {1, 2, ...}: X = ⌈ln(1−U) / ln(p)⌉.

    P(X = k) = (1 − p) · p^(k−1), kỳ vọng 1/(1−p) — khớp dgeom(k−1, prob = 1−p)
    của R (cùng cách script mẫu overlay dgeom(0:19, prob = 0.7) với p = 0.3).
    """
    if n <= 0:
        return []
    if not 0.0 < p < 1.0:
        raise ValueError("p phải thuộc (0, 1)")

    rng = random.Random(seed)
    xs: List[float] = []
    for _ in range(n):
        u = rng.random()
        while u <= 0.0:  # R runif nằm trong (0,1) — tránh log(0)
            u = rng.random()
        xs.append(float(math.ceil(math.log(1.0 - u) / math.log(p))))
    return xs


def exponential_samples(
    n: int = 1000, lam: float = 3.0, seed: Optional[int] = None
) -> List[float]:
    """Phân phối mũ: X = −ln(U) / λ — tương đương hàm rexp của R."""
    if n <= 0:
        return []
    if lam <= 0.0:
        raise ValueError("lambda phải dương")

    rng = random.Random(seed)
    xs: List[float] = []
    for _ in range(n):
        u = rng.random()
        while u <= 0.0:  # tránh log(0)
            u = rng.random()
        xs.append(-math.log(u) / lam)
    return xs


def rayleigh_samples(
    n: int = 1000, sigma: float = 2.0, seed: Optional[int] = None
) -> List[float]:
    """Phân phối Rayleigh: X = σ·√(−2·ln(1−U)) — mật độ (x/σ²)·e^(−x²/2σ²)."""
    if n <= 0:
        return []
    if sigma <= 0.0:
        raise ValueError("sigma phải dương")

    rng = random.Random(seed)
    return [sigma * math.sqrt(-2.0 * math.log(1.0 - rng.random())) for _ in range(n)]


def geometric_general_samples(
    n: int = 1000, p: float = 0.25, seed: Optional[int] = None
) -> List[float]:
    """
    Hình học bằng phương pháp tổng quát: cộng dồn khối xác suất
    P(X=k) = (1−p)·p^(k−1) (kỳ vọng 1/(1−p)) cho tới khi vượt qua U[i] —
    minh hoạ phép biến đổi ngược cho phân phối rời rạc bất kỳ.
    """
    if n <= 0:
        return []
    if not 0.0 < p < 1.0:
        raise ValueError("p phải thuộc (0, 1)")

    rng = random.Random(seed)
    xs: List[float] = []
    for _ in range(n):
        u = rng.random()
        cum = 0.0
        k = 1
        while True:
            cum += (1.0 - p) * p ** (k - 1)
            if cum >= u or k > 1_000_000:
                break
            k += 1
        xs.append(float(k))
    return xs


def theory_points(
    distribution: str,
    p: float = 0.3,
    lam: float = 3.0,
    sigma: float = 2.0,
    x_max: float = 1.0,
) -> List[Dict[str, float]]:
    """
    Điểm lý thuyết để phủ lên histogram (như points()/curve() trong R):
      - geometric / geometric_general: pmf (1−p)·p^(k−1), k = 1..20
      - exponential: pdf λ·e^(−λx)
      - rayleigh: pdf (x/σ²)·e^(−x²/2σ²)
    """
    if distribution in ("geometric", "geometric_general"):
        return [
            {"x": float(k), "y": (1.0 - p) * p ** (k - 1)} for k in range(1, 21)
        ]

    steps = 40
    pts: List[Dict[str, float]] = []
    for i in range(steps + 1):
        x = x_max * i / steps
        if distribution == "exponential":
            y = lam * math.exp(-lam * x)
        elif distribution == "rayleigh":
            y = (x / sigma**2) * math.exp(-(x**2) / (2.0 * sigma**2))
        else:
            raise ValueError(f"Phân phối không hỗ trợ: {distribution}")
        pts.append({"x": x, "y": y})
    return pts