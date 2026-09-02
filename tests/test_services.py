"""Unit test cho các service thống kê thuần (không qua HTTP)."""

import math
from statistics import fmean, pstdev

import pytest

from services.clt_service import sample_means, theoretical_mean_se
from services.distributions_service import box_muller_samples, uniform_samples
from services.histogram_service import histogram_bins
from services.inverse_service import (
    exponential_samples,
    geometric_general_samples,
    geometric_samples,
    rayleigh_samples,
    theory_points,
)


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


def test_clt_uniform_converges_to_theory():
    se = theoretical_mean_se(50, "uniform")[1]
    means = sample_means(
        n_simulations=3000, sample_size=50, distribution="uniform", seed=99
    )
    assert abs(fmean(means) - 0.5) < 3 * se


def test_clt_exponential_converges_to_theory():
    se = theoretical_mean_se(40, "exponential")[1]
    means = sample_means(
        n_simulations=3000, sample_size=40, distribution="exponential", seed=7
    )
    assert abs(fmean(means) - 1.0) < 3 * se


def test_clt_spread_close_to_theoretical_se():
    se = theoretical_mean_se(30, "uniform")[1]
    means = sample_means(n_simulations=4000, sample_size=30, seed=5)
    assert abs(pstdev(means) - se) / se < 0.15


def test_clt_reproducible_with_same_seed():
    first = sample_means(20, 5, "uniform", seed=3)
    second = sample_means(20, 5, "uniform", seed=3)
    assert first == second


def test_clt_rejects_unknown_distribution():
    with pytest.raises(ValueError):
        sample_means(10, 5, "cauchy")


def test_histogram_counts_sum_to_total():
    xs = uniform_samples(n=1000, seed=2)
    bins = histogram_bins(xs, n_bins=10)
    assert sum(b["count"] for b in bins) == 1000


def test_histogram_edges_are_contiguous():
    xs = box_muller_samples(n=200, seed=3)
    bins = histogram_bins(xs, n_bins=8)
    for prev, cur in zip(bins, bins[1:]):
        assert cur["lower"] == prev["upper"]


def test_histogram_handles_constant_series():
    bins = histogram_bins([5.0] * 50, n_bins=4)
    assert sum(b["count"] for b in bins) == 50
    assert bins[0]["count"] == 50  # width fallback -> mọi điểm ở bin đầu


def test_histogram_rejects_non_positive_nbins():
    with pytest.raises(ValueError):
        histogram_bins([1.0, 2.0], n_bins=0)


def test_histogram_empty_input_returns_empty():
    assert histogram_bins([], n_bins=5) == []


# ---------- inverse transform service ----------


def test_geometric_reproducible_with_same_seed():
    assert geometric_samples(n=50, seed=1) == geometric_samples(n=50, seed=1)


def test_geometric_mean_close_to_one_over_one_minus_p():
    samples = geometric_samples(n=8000, p=0.3, seed=42)
    assert abs(fmean(samples) - 1 / 0.7) < 0.1


def test_geometric_values_are_positive_integers():
    samples = geometric_samples(n=500, p=0.5, seed=3)
    assert all(x >= 1 and float(x).is_integer() for x in samples)


def test_exponential_mean_close_to_one_over_lambda():
    samples = exponential_samples(n=8000, lam=3.0, seed=42)
    assert abs(fmean(samples) - 1 / 3.0) < 0.05


def test_exponential_values_are_positive():
    assert all(x > 0 for x in exponential_samples(n=500, lam=2.0, seed=5))


def test_rayleigh_mean_close_to_sigma_sqrt_pi_over_2():
    samples = rayleigh_samples(n=8000, sigma=2.0, seed=42)
    expected = 2.0 * math.sqrt(math.pi / 2)
    assert abs(fmean(samples) - expected) < 0.1


def test_geometric_general_matches_closed_form():
    closed = geometric_samples(n=2000, p=0.25, seed=11)
    general = geometric_general_samples(n=2000, p=0.25, seed=11)
    assert abs(fmean(closed) - fmean(general)) < 0.15


def test_inverse_rejects_invalid_params():
    with pytest.raises(ValueError):
        geometric_samples(n=5, p=1.5)
    with pytest.raises(ValueError):
        exponential_samples(n=5, lam=0.0)
    with pytest.raises(ValueError):
        rayleigh_samples(n=5, sigma=-1.0)


def test_inverse_handles_zero_n():
    assert geometric_samples(n=0) == []
    assert exponential_samples(n=0) == []
    assert rayleigh_samples(n=0) == []
    assert geometric_general_samples(n=0) == []


def test_theory_points_geometric_is_pmf():
    pts = theory_points("geometric", p=0.3)
    assert len(pts) == 20
    assert pts[0]["x"] == 1.0
    assert abs(pts[0]["y"] - 0.7) < 1e-9
    assert abs(sum(pt["y"] for pt in pts) - 1.0) < 0.001  # 0.7·(1−0.3^20)


def test_theory_points_rayleigh_pdf_at_zero_is_zero():
    pts = theory_points("rayleigh", sigma=2.0, x_max=6.0)
    assert pts[0] == {"x": 0.0, "y": 0.0}
    assert pts[-1]["x"] == 6.0


def test_theory_points_rejects_unknown_distribution():
    with pytest.raises(ValueError):
        theory_points("cauchy")
