"""Kiểm thử endpoint qua TestClient (HTTP in-memory)."""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_root_ok():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["message"] == "Statistical Computing Lab API"


def test_lcg_default_response_has_analysis_fields():
    res = client.get("/api/v1/lcg")
    assert res.status_code == 200
    body = res.json()
    assert body["count"] == len(body["sequence"])
    # Tham số mặc định X0=3,a=7,c=4,m=99 có chu kỳ thực tế = 9
    assert body["cycle_length"] == 9
    assert body["theoretical_max_period"] == 99


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
