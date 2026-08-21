Uni_distribution = function(X){
  A = runif(1)
  cat('Số tạo ngẫu nhiên: ',A,'\n')
  sum_range = cumsum(X)

  for (i in 1:length(X)){
    if (A <= sum_range[i]){
      return(i)
    }

  }
  
  return(length(X))
}

X = c(1/10, 2/10, 7/10)

Uni_distribution(X)
