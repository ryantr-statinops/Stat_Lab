"""
Service xử lý Linear Congruential Generator
Chuyển đổi logic từ file R gốc sang Python
"""
import numpy as np
from typing import List


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