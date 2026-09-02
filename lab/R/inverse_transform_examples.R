## Ví dụ 4: mô phỏng phân phối hình học
#Mô phòng hàm phát sinh SNN theo pp hình học (giống hàm rgeom)

geometric_inverse_transform_generator = function(n, p) {
  U = runif(n)
  X = numeric(n)
  for (i in 1:n) {
    X[i] = ceiling(log(1 - U[i]) / log(p))
  }
  return(X)
}

## use case: geometric_inverse_transform_generator(n, p)
samples_geo = geometric_inverse_transform_generator(100, 0.3)
samples_geo

print(table(samples_geo[1:20]))

par(mfrow = c(1, 1))

hist(samples_geo, breaks = 0:20 - 0.5, freq = FALSE,
     main = "Vi du 4: Geometric (p=0.3)",
     xlab = "x", ylab = "Xac suat",
     col = "lightblue", border = "white")
points(1:20, dgeom(0:19, prob = 0.7), col = "red", pch = 19)
legend("topright", legend = "mô phỏng lý thuyết", col = "red", pch = 19)



## Ví dụ 5: mô phỏng phân phối mũ
#Mô phỏng hàm phát sinh SNN theo pp mũ (giống hàm rexp)

exponential_inverse_transform = function(n, lambda) {
  U = runif(n)
  X = -log(U) / lambda
  return(X)
}

## use case: exponential_inverse_transform(n, lambda)
samples_exp = exponential_inverse_transform(100, 3)
samples_exp


summary(samples_exp)
par(mfrow = c(1, 1))
hist(samples_exp, breaks = 20, freq = FALSE,
     main = "Vi du 5: Exponential (lambda=3)",
     xlab = "x", ylab = "Mat do",
     col = "lightblue", border = "white")
curve(dexp(x, rate = 3), add = TRUE, col = "red", lwd = 2)
legend("topright", legend = "mo phong ly thuyet", col = "red", lwd = 2)



## Ví dụ 6: mô phỏng phân phối Rayleigh
#Mô phỏng hàm phát sinh SNN theo pp Rayleigh

rayleigh_inverse_transform = function(n, sigma) {
  U = runif(n)
  X = sigma * sqrt(-2 * log(1 - U))
  return(X)
}

## use case: rayleigh_inverse_transform(n, sigma)
samples_ray = rayleigh_inverse_transform(100, 2)
samples_ray


summary(samples_ray)
par(mfrow = c(1, 1))
hist(samples_ray, breaks = 20, freq = FALSE,
     main = "Vi du 6: Rayleigh (sigma=2)",
     xlab = "x", ylab = "Mat do",
     col = "lightblue", border = "white")
curve((x/4) * exp(-x^2/8), add = TRUE, col = "red", lwd = 2)
legend("topright", legend = "mo phong ly thuyet", col = "red", lwd = 2)



## Ví dụ 9: mô phỏng phân phối hình học (phương pháp tổng quát)
#Mô phỏng hàm phát sinh SNN theo pp hình học dùng pp tổng quát (giống hàm rgeom)

geometric_inverse_transform_general = function(n, p) {
  U = runif(n)
  X = numeric(n)
  for (i in 1:n) {
    cum_prob = 0
    k = 1
    while (TRUE) {
      cum_prob = cum_prob + p^(k-1) * (1 - p)
      if (cum_prob >= U[i]) {
        X[i] = k
        break
      }
      k = k + 1
    }
  }
  return(X)
}

## use case: geometric_inverse_transform_general(n, p)
samples_geo_gen = geometric_inverse_transform_general(100, 0.25)
samples_geo_gen

print(table(samples_geo_gen[1:20]))
par(mfrow = c(1, 1))
hist(samples_geo_gen, breaks = 0:20 - 0.5, freq = FALSE,
     main = "Vi du 9: Geometric (p=0.25)",
     xlab = "x", ylab = "Xac suat",
     col = "lightblue", border = "white")
points(1:20, dgeom(0:19, prob = 0.75), col = "red", pch = 19)
legend("topright", legend = "Lý thuyết", col = "red", pch = 19)

