"""
Test cases cho LCG service
"""
import pytest
from backend.fastapi.services.lcg_service import (
    lcg_cycle_length,
    lcg_generator,
    lcg_steps,
)


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


def test_lcg_steps_matches_manual_r_table():
    """Đối chiếu bảng tính tay cho X0=3,a=7,c=4,m=99 — như lcg_table trong R"""
    steps = lcg_steps(3, 7, 5, 4, 99)
    assert [(s["index"], s["equation"], s["xn"]) for s in steps] == [
        (1, 25, 25),
        (2, 179, 80),
        (3, 564, 69),
        (4, 487, 91),
        (5, 641, 47),
    ]


def test_lcg_steps_chain_property():
    """equation(i) = a·xn(i-1)+c với xn(0)=X0; xn(i) = equation(i) % m"""
    prev = 3
    for s in lcg_steps(3, 7, 6, 4, 99):
        assert s["equation"] == 7 * prev + 4
        assert s["xn"] == s["equation"] % 99
        prev = s["xn"]


def test_lcg_steps_empty_when_n_zero():
    assert lcg_steps(3, 7, 0, 4, 99) == []