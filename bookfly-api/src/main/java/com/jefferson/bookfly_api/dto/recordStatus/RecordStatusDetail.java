package com.jefferson.bookfly_api.dto.recordStatus;

import com.jefferson.bookfly_api.dto.user.UserSummary;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.models.RecordStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record RecordStatusDetail(
        RecordStatusValue state,
        LocalDateTime dateTime,
        UserSummary byUser
) {
    public static RecordStatusDetail from(RecordStatus recordStatus){
        return new RecordStatusDetail(
                recordStatus.getRecordStatusValue(),
                 recordStatus.getDateTime(),
                UserSummary.from(recordStatus.getByUser())
        );
    }

}
