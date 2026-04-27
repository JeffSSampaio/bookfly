package com.jefferson.bookfly_api.dto.user;

import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.User;

public record UserMovimentSummary(
        Long userId,
        String name,
        Role role
) {
   public static UserMovimentSummary from(User user){
       return new UserMovimentSummary(

       );
   }
}
