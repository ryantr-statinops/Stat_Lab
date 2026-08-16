# Laboratory - Statistical Computing Functions

Folder này chứa các file R chứa công thức thống kê và hàm thử nghiệm.

## 📁 Structure
```
lab/
├── README.md          # File này
└── R/                 # Các script R
    ├── LCG.R          # Linear Congruential Generator
```

## 🧪 Sử dụng
```r
# Load script
source("lab/R/LCG.R")

# Chạy hàm
result <- lcg_generator(X0=3, a=7, n=20, c=4, m=99)
print(result)
```