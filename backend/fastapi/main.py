"""
FastAPI Backend cho Statistical Computing Lab
Endpoint chính: /api/v1/lcg
"""
from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI(
    title="Statistical Computing Lab API",
    version="0.1.0"
)


class LCGResponse(BaseModel):
    sequence: List[int]
    count: int


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
    sequence = []
    x = X0
    
    for i in range(n):
        x = (a * x + c) % m
        sequence.append(x)
    
    return LCGResponse(sequence=sequence, count=len(sequence))


@app.get("/")
async def root():
    return {"message": "Statistical Computing Lab API", "version": "0.1.0"}