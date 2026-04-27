package com.jefferson.bookfly_api.dto.user;

import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.User;

public record UserSummary(
        Long id,
        String name,
        String email,
        Role role
) {

    public static UserSummary from(User user){
        return new UserSummary(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
