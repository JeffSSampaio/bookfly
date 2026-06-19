package com.jefferson.bookfly_api.dto.user;

import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.User;

public record UserSummaryPrincipal(
        Long userId,
        String name,
        Role role
) {
   public static UserSummaryPrincipal from(User user){
       return new UserSummaryPrincipal(
                user.getId(),
               user.getName(),
               user.getRole()
       );
   }
}
