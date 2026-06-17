package com.jefferson.bookfly_api.dto.user;

import com.jefferson.bookfly_api.dto.loan.LoanSummary;
import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.User;

import java.util.List;

public record UserDetail(

        Long id,
        String name,
        String email,
        Role role,
        List<LoanSummary> loans

) {

    public static UserDetail from(User user) {
        return new UserDetail(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getLoans().stream()
                        .map(LoanSummary::from)
                        .toList()
        );
    }
}