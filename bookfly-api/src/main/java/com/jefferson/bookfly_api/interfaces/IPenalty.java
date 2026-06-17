package com.jefferson.bookfly_api.interfaces;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface IPenalty {
    public static final BigDecimal valuePenalty = new BigDecimal("1.50");
    public BigDecimal getPaymentAmount(LocalDateTime dateReturnDateLoan, LocalDateTime dateCurrent);
}
