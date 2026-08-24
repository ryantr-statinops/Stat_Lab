"""Unit test cho các service thống kê thuần (không qua HTTP)."""

from statistics import fmean, pstdev

from services.distributions_service import box_muller_samples, uniform_samples


def test_box_muller_reproducible_with_same_seed():
    first = box_muller_samples(n=20, seed=42)
    second = box_muller_samples(n=20, seed=42)
    assert first == second


def test_box_muller_matches_requested_normal_params():
    samples = box_muller_samples(mean=10.0, std=2.0, n=8000, seed=123)
    assert abs(fmean(samples) - 10.0) < 0.1
    assert abs(pstdev(samples) - 2.0) < 0.15


def test_uniform_samples_stay_in_unit_range():
    xs = uniform_samples(n=500, seed=1)
    assert all(0.0 <= x < 1.0 for x in xs)


def test_uniform_and_box_muller_handle_zero_n():
    assert box_muller_samples(n=0) == []
    assert uniform_samples(n=0) == []
