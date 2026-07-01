package com.jefferson.bookfly_api.dto.user;

import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.User;

public record UserMovimentSummary(
        Long userId,
        String name,
        Role role
) {
   public static UserMovimentSummary from(User user){
       if (user == null) {
           return null; // tirar daqui quando tiver o spring security
       }
       return new UserMovimentSummary(
                user.getId(),
               user.getName(),
               user.getRole()
       );
   }
}
