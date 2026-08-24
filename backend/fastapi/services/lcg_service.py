"""
Service xử lý Linear Congruential Generator
Chuyển đổi logic từ file R gốc sang Python
"""
import numpy as np
from typing import List, Optional


def lcg_generator(X0: int, a: int, n: int, c: int, m: int) -> List[int]:
    """
    Generate Linear Congruential Generator sequence
    
    Args:
        X0: Initial value (seed)
        a: Multiplier coefficient
        n: Number of iterations
        c: Increment coefficient  
        m: Modulus
    
    Returns:
        List of random numbers
    
    Example:
        >>> lcg_generator(X0=3, a=7, n=5, c=4, m=99)
        [25, 80, 69, 91, 47]
    """
    if n <= 0:
        return []
    
    sequence = []
    x = X0
    
    for i in range(n):
        x = (a * x + c) % m
        sequence.append(x)
    
    return sequence


def lcg_cycle_length(
    X0: int, a: int, c: int, m: int, max_steps: int = 100_000
) -> Optional[int]:
    """
    Độ dài chu kỳ thực tế của dãy LCG: số bước nhỏ nhất để giá trị quay về X0.

    Theo định lý Hull-Dobell, dãy có chu kỳ đầy đủ (độ dài m) khi:
      - gcd(c, m) = 1
      - a - 1 chia hết cho mọi ước nguyên tố của m
      - nếu m chia hết cho 4 thì a - 1 cũng chia hết cho 4

    Trả về None nếu không quay lại X0 trong giới hạn max_steps bước
    (tránh quét quá lâu khi m rất lớn).
    """
    x = X0
    limit = min(m, max_steps)
    for i in range(1, limit + 1):
        x = (a * x + c) % m
        if x == X0:
            return i
    return None


def lcg_with_numpy(X0: int, a: int, n: int, c: int, m: int) -> np.ndarray:
    """
    Vectorized version sử dụng numpy
    Tối ưu hơn cho lượng lớn dữ liệu
    """
    sequence = np.zeros(n, dtype=np.int64)
    x = X0
    
    for i in range(n):
        x = (a * x + c) % m
        sequence[i] = x
    
    return sequence