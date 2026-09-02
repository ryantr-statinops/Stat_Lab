"""
FastAPI Backend cho Statistical Computing Lab
Endpoint chính: /api/v1/lcg
"""
import math
from typing import List, Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
from services.lcg_service import lcg_cycle_length, lcg_generator, lcg_steps

app = FastAPI(
    title="Statistical Computing Lab API",
    version="0.1.0"
)

# Cho phép frontend Next.js ở local gọi API từ trình duyệt.
# Khi deploy production, thêm origin thật của bạn (VD https://statlab.vercel.app).
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # frontend/vite-app: dev server (:5173) và preview bản production (:4173)
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LcgStep(BaseModel):
    index: int
    equation: int
    xn: int


class LCGResponse(BaseModel):
    sequence: List[int]
    count: int
    theoretical_max_period: int
    cycle_length: Optional[int] = None
    notes: List[str] = []
    steps: List[LcgStep] = []


@app.get("/api/v1/lcg", response_model=LCGResponse)
async def generate_lcg(
    X0: int = Query(3, description="Giá trị khởi đầu"),
    a: int = Query(7, description="Hệ số nhân"),
    n: int = Query(100, ge=1, le=10000, description="Số lần sinh"),
    c: int = Query(4, description="Hệ số cộng"),
    m: int = Query(9999, gt=0, description="Modulo")
):
    """
    Tạo dãy số ngẫu nhiên Linear Congruential Generator
    
    Công thức: X[i] = (a * X[i-1] + c) % m
    """
    steps = lcg_steps(X0=X0, a=a, n=n, c=c, m=m)
    sequence = [s["xn"] for s in steps]

    # Phân tích chu kỳ: chỉ quét khi m ở mức hợp lý để giữ response nhanh
    cycle_length: Optional[int] = None
    notes: List[str] = []
    if m <= 100_000:
        cycle_length = lcg_cycle_length(X0=X0, a=a, c=c, m=m)
        if cycle_length is not None and cycle_length < m:
            notes.append(
                f"Chu kỳ thực tế ({cycle_length}) ngắn hơn m — dãy sẽ lặp sớm. "
                "Để đạt chu kỳ đầy đủ (Hull-Dobell): gcd(c, m) = 1; "
                "a - 1 chia hết cho mọi ước nguyên tố của m; "
                "nếu m chia hết cho 4 thì a - 1 chia hết cho 4."
            )
    else:
        notes.append("m > 100000 nên bỏ qua phân tích chu kỳ để giữ response nhanh.")

    return LCGResponse(
        sequence=sequence,
        count=len(sequence),
        theoretical_max_period=m,
        cycle_length=cycle_length,
        notes=notes,
        steps=[LcgStep(**s) for s in steps],
    )


class CltResponse(BaseModel):
    distribution: str
    n_simulations: int
    sample_size: int
    sample_means: List[float]
    empirical_mean: float
    empirical_std: float
    theoretical_mean: float
    theoretical_se: float


@app.get("/api/v1/clt", response_model=CltResponse)
async def run_clt(
    n_simulations: int = Query(500, ge=10, le=20000, description="Số lần lấy mẫu"),
    sample_size: int = Query(30, ge=2, le=10000, description="Kích thước mỗi mẫu"),
    distribution: str = Query(
        "uniform",
        pattern="^(uniform|exponential)$",
        description="Phân phối nền của từng mẫu",
    ),
    seed: Optional[int] = Query(None, description="Seed để tái lập kết quả"),
):
    """
    Mô phỏng Định lý Giới hạn Trung tâm.

    Trả về dãy trung bình mẫu cùng đại lượng thực nghiệm (mean, std)
    để so sánh với lý thuyết N(μ, σ²/n).
    """
    means = sample_means(
        n_simulations=n_simulations,
        sample_size=sample_size,
        distribution=distribution,
        seed=seed,
    )

    mu, se = theoretical_mean_se(sample_size, distribution)

    count = len(means)
    emp_mean = sum(means) / count
    emp_var = sum((x - emp_mean) ** 2 for x in means) / (count - 1)

    return CltResponse(
        distribution=distribution,
        n_simulations=n_simulations,
        sample_size=sample_size,
        sample_means=means,
        empirical_mean=emp_mean,
        empirical_std=math.sqrt(emp_var),
        theoretical_mean=mu,
        theoretical_se=se,
    )


class NormalResponse(BaseModel):
    samples: List[float]
    count: int
    sample_mean: float
    sample_std: float


@app.get("/api/v1/normal", response_model=NormalResponse)
async def generate_normal(
    mean: float = Query(0.0, description="Kỳ vọng μ"),
    std: float = Query(1.0, gt=0, description="Độ lệch chuẩn σ"),
    n: int = Query(1000, ge=10, le=10000, description="Số mẫu cần sinh"),
    seed: Optional[int] = Query(None, description="Seed để tái lập kết quả"),
):
    """
    Lấy mẫu phân phối chuẩn bằng biến đổi Box-Muller.

    Hai biến đều U1, U2 cho ra hai chuẩn tắc độc lập Z0, Z1.
    """
    samples = box_muller_samples(mean=mean, std=std, n=n, seed=seed)

    total = len(samples)
    sample_mean = sum(samples) / total
    sample_var = sum((x - sample_mean) ** 2 for x in samples) / (total - 1)

    return NormalResponse(
        samples=samples,
        count=total,
        sample_mean=sample_mean,
        sample_std=math.sqrt(sample_var),
    )


class HistogramBin(BaseModel):
    lower: float
    upper: float
    count: int


class HistogramResponse(BaseModel):
    source: str
    total: int
    bin_count: int
    bins: List[HistogramBin]


@app.get("/api/v1/histogram", response_model=HistogramResponse)
async def build_histogram(
    source: str = Query(
        "normal",
        pattern="^(normal|uniform)$",
        description="Nguồn dữ liệu mô phỏng",
    ),
    n: int = Query(5000, ge=100, le=50000, description="Số điểm dữ liệu"),
    n_bins: int = Query(20, ge=5, le=100, description="Số bins"),
    seed: Optional[int] = Query(None, description="Seed để tái lập kết quả"),
):
    """
    Sinh dữ liệu mô phỏng và chia bins ngay trên server.

    Frontend chỉ cần map bins vào biểu đồ cột mà không phải
    tải về toàn bộ mẫu thô.
    """
    if source == "normal":
        values = box_muller_samples(n=n, seed=seed)
    else:
        values = uniform_samples(n=n, seed=seed)

    return HistogramResponse(
        source=source,
        total=len(values),
        bin_count=n_bins,
        bins=histogram_bins(values, n_bins),
    )


@app.get("/")
async def root():
    return {"message": "Statistical Computing Lab API", "version": "0.1.0"}


class TheoryPoint(BaseModel):
    x: float
    y: float


class InverseResponse(BaseModel):
    distribution: str
    n: int
    p: Optional[float] = None
    lam: Optional[float] = None
    sigma: Optional[float] = None
    samples: List[float]
    count: int
    sample_mean: float
    theory: List[TheoryPoint] = []


@app.get("/api/v1/inverse", response_model=InverseResponse)
async def generate_inverse(
    distribution: str = Query(
        "geometric",
        pattern="^(geometric|exponential|rayleigh|geometric_general)$",
        description="Phân phối cần lấy mẫu theo biến đổi ngược",
    ),
    n: int = Query(1000, ge=10, le=10000, description="Số mẫu cần sinh"),
    p: float = Query(0.3, gt=0, lt=1, description="Tham số p (hình học)"),
    lam: float = Query(
        3.0, alias="lambda", gt=0, description="Tham số λ (mũ)"
    ),
    sigma: float = Query(2.0, gt=0, description="Tham số σ (Rayleigh)"),
    seed: Optional[int] = Query(None, description="Seed để tái lập kết quả"),
):
    """
    Lấy mẫu theo phép biến đổi ngược: X = F⁻¹(U) với U ~ Uniform(0, 1).

    Mirror từ lab/R/inverse_transform_examples.R — mỗi phân phối kèm
    đường lý thuyết (pmf/pdf) để phủ lên histogram như overlay trong R.
    """
    if distribution == "geometric":
        samples = geometric_samples(n=n, p=p, seed=seed)
        theory = theory_points("geometric", p=p)
        param = {"p": p}
    elif distribution == "geometric_general":
        samples = geometric_general_samples(n=n, p=p, seed=seed)
        theory = theory_points("geometric_general", p=p)
        param = {"p": p}
    elif distribution == "exponential":
        samples = exponential_samples(n=n, lam=lam, seed=seed)
        x_max = max(samples) * 1.05
        theory = theory_points("exponential", lam=lam, x_max=x_max)
        param = {"lam": lam}
    else:  # rayleigh
        samples = rayleigh_samples(n=n, sigma=sigma, seed=seed)
        x_max = max(samples) * 1.05
        theory = theory_points("rayleigh", sigma=sigma, x_max=x_max)
        param = {"sigma": sigma}

    total = len(samples)
    sample_mean = sum(samples) / total

    return InverseResponse(
        distribution=distribution,
        n=n,
        samples=samples,
        count=total,
        sample_mean=sample_mean,
        theory=theory,
        **param,
    )