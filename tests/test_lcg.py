"""
Test cases cho LCG service
"""
import pytest
from backend.fastapi.services.lcg_service import lcg_cycle_length, lcg_generator


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
    """Test tính nhất quán của sequence

    Tính tay theo công thức X(i) = (7 * X(i-1) + 4) % 99 với X0 = 3:
      (7*3+4)%99=25 -> (7*25+4)%99=80 -> (7*80+4)%99=69
      -> (7*69+4)%99=91 -> (7*91+4)%99=47
    """
    result = lcg_generator(X0=3, a=7, n=5, c=4, m=99)
    expected = [25, 80, 69, 91, 47]
    assert result == expected


def test_lcg_modulo_constraint():
    """Test các giá trị luôn nhỏ hơn m"""
    result = lcg_generator(X0=3, a=7, n=100, c=4, m=99)
    assert all(0 <= x < 99 for x in result)


def test_lcg_cycle_full_period():
    """X0=0, a=5, c=1, m=8 thỏa Hull-Dobell -> chu kỳ đầy đủ = 8"""
    assert lcg_cycle_length(0, 5, 1, 8) == 8


def test_lcg_cycle_short_period():
    """Tham số không thỏa Hull-Dobell -> chu kỳ ngắn hơn m"""
    cycle = lcg_cycle_length(3, 7, 4, 99)
    assert cycle is not None and 0 < cycle < 99


def test_lcg_cycle_returns_none_beyond_limit():
    """max_steps nhỏ hơn chu kỳ thật -> trả về None"""
    assert lcg_cycle_length(0, 5, 1, 8, max_steps=3) is None