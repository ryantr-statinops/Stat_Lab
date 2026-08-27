"""Kiểm thử endpoint qua TestClient (HTTP in-memory)."""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_root_ok():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["message"] == "Statistical Computing Lab API"


def test_lcg_response_has_analysis_fields():
    # Ghim tham số tường minh: chu kỳ của (X0=3,a=7,c=4,m=99) là 9.
    # Lưu ý: default của API là m=9999 (khác ví dụ tài liệu).
    res = client.get("/api/v1/lcg", params={"X0": 3, "a": 7, "n": 10, "c": 4, "m": 99})
    assert res.status_code == 200
    body = res.json()
    assert body["count"] == len(body["sequence"]) == 10
    assert body["cycle_length"] == 9
    assert body["theoretical_max_period"] == 99


def test_lcg_defaults_shape():
    res = client.get("/api/v1/lcg")
    assert res.status_code == 200
    body = res.json()
    assert body["count"] == len(body["sequence"]) == 100
    assert body["theoretical_max_period"] == 9999


def test_lcg_rejects_invalid_n():
    res = client.get("/api/v1/lcg", params={"n": 0})
    assert res.status_code == 422


def test_normal_returns_requested_count():
    res = client.get("/api/v1/normal", params={"n": 50, "seed": 7})
    assert res.status_code == 200
    body = res.json()
    assert len(body["samples"]) == 50
    assert body["sample_std"] > 0


def test_normal_is_reproducible_with_seed():
    first = client.get("/api/v1/normal", params={"n": 30, "seed": 11}).json()["samples"]
    second = client.get("/api/v1/normal", params={"n": 30, "seed": 11}).json()["samples"]
    assert first == second


def test_clt_endpoint_returns_simulation_and_theory():
    res = client.get(
        "/api/v1/clt", params={"n_simulations": 20, "sample_size": 5, "seed": 1}
    )
    assert res.status_code == 200
    body = res.json()
    assert len(body["sample_means"]) == 20
    assert body["theoretical_se"] > 0
    assert body["empirical_std"] > 0


def test_clt_rejects_unknown_distribution():
    res = client.get("/api/v1/clt", params={"distribution": "weibull"})
    assert res.status_code == 422


def test_histogram_endpoint_bin_counts_match_total():
    res = client.get(
        "/api/v1/histogram",
        params={"source": "uniform", "n": 800, "n_bins": 12, "seed": 4},
    )
    assert res.status_code == 200
    body = res.json()
    assert len(body["bins"]) == 12
    assert sum(b["count"] for b in body["bins"]) == 800
    assert body["total"] == 800


def test_histogram_rejects_unknown_source():
    res = client.get("/api/v1/histogram", params={"source": "beta"})
    assert res.status_code == 422


def test_lcg_endpoint_returns_step_table():
    res = client.get(
        "/api/v1/lcg", params={"X0": 3, "a": 7, "n": 5, "c": 4, "m": 99}
    )
    assert res.status_code == 200
    body = res.json()
    assert len(body["steps"]) == 5
    assert body["steps"][0] == {"index": 1, "equation": 25, "xn": 25}
    # Bước sau dùng Xn của bước trước làm đầu vào
    expected_eq2 = 7 * body["steps"][0]["xn"] + 4
    assert body["steps"][1]["equation"] == expected_eq2


def test_lcg_sequence_matches_steps_column():
    res = client.get("/api/v1/lcg", params={"n": 6})
    body = res.json()
    assert [s["xn"] for s in body["steps"]] == body["sequence"]


def test_cors_allows_local_frontend_origin():
    res = client.get("/api/v1/lcg", headers={"Origin": "http://localhost:3000"})
    assert res.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_cors_rejects_unknown_origin():
    res = client.get("/api/v1/lcg", headers={"Origin": "http://evil.example.com"})
    assert res.headers.get("access-control-allow-origin") is None


def test_cors_allows_vite_dev_and_preview_origins():
    for origin in (
        "http://localhost:5173",   # vite dev
        "http://localhost:4173",   # vite preview (production build)
    ):
        res = client.get("/api/v1/lcg", headers={"Origin": origin})
        assert res.headers.get("access-control-allow-origin") == origin
