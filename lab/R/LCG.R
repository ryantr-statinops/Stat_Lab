#Linear Congruential Generator
  
LCG = function(X0, a, n, c, m ){
    
    X = numeric(n+1)
    X[1] = X0
    for (i in 2:(n + 1) ){
      X[i] = (a*X[i-1]+c)%%m
    }
    return(X)
  }
##  LCG = function(X0, a, n, c, m )
LCG(3, 7, 20, 4, 3)

lcg_table = function(X0, a, n, c, m ){

  stt = 1:n
  X = numeric(n)
  equation = numeric(n)
  
  for (i in 1:n){
    if (i == 1){
      X[i] = (a * X0 + c) %% m
    } else {
      X[i] = (a * X[i-1] + c) %% m
    }
  }
  
  for (j in 1:n ){
    if (j==1){
      equation[j] = (a * X0 + c)
    } else{
      equation[j] = (a * X[j-1] + c)
    }
  }
  
  result = data.frame(
    n = stt,
    'a*X(n-1) + c' = equation,
    'Xn' = X
  )
  
  return(result)
}

##  LCG = function(X0, a, n, c, m )  
lcg_table(0, 5, 20, 1, 8)

##plan: update các điều kiện thỏa mãn các tính chất của LCG
