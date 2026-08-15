"""
Test cases cho LCG service
"""
import pytest
from backend.fastapi.services.lcg_service import lcg_generator


def test_lcg_basic():
    """Test cơ bản với giá trị mặc định"""
    result = lcg_generator(X0=3, a=7, n=5, c=4, m=99)
    assert len(result) == 5
    assert all(isinstance(x, int) for x in result)


def test_lcg_zero_iterations():
    """Test với n=0"""
    result = lcg_generator(X0=3, a=7, n=0, c=4, m=99)
    assert result == []


def test_lcg_consistency():
    """Test tính nhất quán của sequence"""
    result = lcg_generator(X0=3, a=7, n=5, c=4, m=99)
    expected = [25, 180, 1266, 8930, 6272]  # Các giá trị tính theo công thức
    assert result == expected


def test_lcg_modulo_constraint():
    """Test các giá trị luôn nhỏ hơn m"""
    result = lcg_generator(X0=3, a=7, n=100, c=4, m=99)
    assert all(0 <= x < 99 for x in result)