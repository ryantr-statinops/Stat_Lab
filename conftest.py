"""Đưa backend/fastapi vào sys.path để test API với cùng ngữ cảnh import như khi chạy uvicorn."""

import os
import sys

BACKEND_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "backend", "fastapi"
)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
