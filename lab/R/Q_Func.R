## Tinh ham thong ke kiem dinh Q

    CSSF = function(N, m, n_group) {
      X = (0:(N - 1)) %% m

      group_size = m / n_group
      Ej = N / n_group
      Oj = numeric(n_group)

      for (j in 1:n_group) {
        lower_bound = (j - 1) * group_size
        upper_bound = j * group_size - 1

        Oj[j] = sum(X >= lower_bound & X <= upper_bound)
      }

      Q = sum((Oj - Ej)^2 / Ej)
      return(Q)
    }

    CSSF(10^6, 1024, 16)
