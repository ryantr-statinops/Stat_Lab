/**
 * Helper thống kê phía client.
 *
 * `histogramBins` là phiên bản TypeScript của
 * backend/fastapi/services/histogram_service.py — giữ cùng quy ước
 * (giá trị trùng cạnh trên của bin cuối rơi vào bin cuối) để hai phía
 * cho kết quả nhất quán.
 */

export type Bin = {
  lower: number;
  upper: number;
  count: number;
};

export type Summary = {
  n: number;
  mean: number;
  std: number;
  min: number;
  max: number;
};

/** Chia dãy giá trị thành nBins khoảng đều và đếm số điểm từng khoảng. */
export function histogramBins(values: number[], nBins: number): Bin[] {
  if (nBins < 1 || values.length === 0) return [];

  const lo = Math.min(...values);
  const hi = Math.max(...values);
  let width = (hi - lo) / nBins;
  if (width === 0) width = 1;

  const counts = new Array<number>(nBins).fill(0);
  for (const v of values) {
    let idx = Math.floor((v - lo) / width);
    if (idx >= nBins) idx = nBins - 1;
    counts[idx] += 1;
  }

  return counts.map((count, i) => ({
    lower: lo + i * width,
    upper: lo + (i + 1) * width,
    count,
  }));
}

/** Thống kê mô tả cơ bản của một mẫu số liệu. */
export function describe(values: number[]): Summary {
  const n = values.length;
  const mean = values.reduce((sum, v) => sum + v, 0) / n;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (n - 1);

  return {
    n,
    mean,
    std: Math.sqrt(variance),
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

/** Nhãn điểm giữa của bin — dùng làm trục X gọn gàng trên biểu đồ. */
export function binLabel(bin: Bin): string {
  return ((bin.lower + bin.upper) / 2).toFixed(2);
}
