package com.jefferson.bookfly_api.dto.user;

import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.User;

import java.time.LocalDateTime;

public record UserSummary(
        Long id,
        String name,
        String email,
        String password,
        Role role,
        RecordStatusValue recordStatus,
        LocalDateTime recordDateTime

) {

    public static UserSummary from(User user){
        return new UserSummary(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getRecordStatus().getRecordStatusValue(),
                user.getRecordStatus().getDateTime()
        );
    }
}
