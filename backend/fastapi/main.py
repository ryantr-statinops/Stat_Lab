"""
FastAPI Backend cho Statistical Computing Lab
Endpoint chính: /api/v1/lcg
"""
from typing import List, Optional

from fastapi import FastAPI, Query
from pydantic import BaseModel

from services.lcg_service import lcg_cycle_length, lcg_generator

app = FastAPI(
    title="Statistical Computing Lab API",
    version="0.1.0"
)


class LCGResponse(BaseModel):
    sequence: List[int]
    count: int
    theoretical_max_period: int
    cycle_length: Optional[int] = None
    notes: List[str] = []


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
    sequence = lcg_generator(X0=X0, a=a, n=n, c=c, m=m)

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
    )


@app.get("/")
async def root():
    return {"message": "Statistical Computing Lab API", "version": "0.1.0"}