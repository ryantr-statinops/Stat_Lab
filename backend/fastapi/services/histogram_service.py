"""
Chia dãy giá trị thành các bins khoảng đều cho biểu đồ histogram.

Binning chạy server-side để frontend không phải tải toàn bộ mẫu thô
khi n lớn.
"""
from typing import Dict, List, Sequence


def histogram_bins(values: Sequence[float], n_bins: int = 20) -> List[Dict[str, float]]:
    """
    Chia values thành n_bins khoảng đều và đếm số điểm trong từng khoảng.

    - Giá trị trùng cạnh trên của bin cuối được gán vào bin cuối.
    - Khi mọi giá trị bằng nhau (width = 0), dùng độ rộng 1.0 để tránh
      chia cho 0 — toàn bộ điểm rơi vào bin đầu tiên.

    Trả về danh sách {"lower", "upper", "count"} liền kề, tăng dần.
    """
    if n_bins < 1:
        raise ValueError("n_bins phải >= 1")
    if len(values) == 0:
        return []

    lo = min(values)
    hi = max(values)
    width = (hi - lo) / n_bins
    if width == 0:
        width = 1.0

    counts = [0] * n_bins
    for v in values:
        idx = int((v - lo) / width)
        if idx >= n_bins:
            idx = n_bins - 1
        counts[idx] += 1

    return [
        {
            "lower": lo + i * width,
            "upper": lo + (i + 1) * width,
            "count": counts[i],
        }
        for i in range(n_bins)
    ]
