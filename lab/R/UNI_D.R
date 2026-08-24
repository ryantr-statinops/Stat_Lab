## Example 4, Section 1.2

Uni_distribution = function(X){
  A = runif(1)
  cat('Số tạo ngẫu nhiên: x =',A,'\n')
  sum_range = cumsum(X)

  for (i in 1:length(X)){
    if (A <= sum_range[i]){
      cat('x thuộc khoảng:','[',sum_range[i-1], ',',sum_range[i],']','\n')
      return(i)
    }

  }
  
  return(length(X))
}

X = c(1/10, 2/10, 4/10, 3/10)

Uni_distribution(X)
