package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.interfaces.IRecordStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Embeddable
public class RecordStatus implements IRecordStatus {
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecordStatusValue status = RecordStatusValue.ACTIVE;

    @Column(name = "status_date_time",nullable = false)
    private LocalDateTime dateTime = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "status_user_id")
    private User byUser;

    public RecordStatus() {
    }

    public RecordStatus(RecordStatusValue status, LocalDateTime dateTime, User byUser) {
        this.status = status;
        this.dateTime = dateTime;
        this.byUser = byUser;
    }

    @Override
    public void delete(User user) {
        this.status = RecordStatusValue.DELETED;
        this.dateTime = LocalDateTime.now();
        this.byUser = user;
    }

    @Override
    public void active(User user) {
        this.status= RecordStatusValue.ACTIVE;
        this.dateTime = LocalDateTime.now();
        this.byUser = user;
    }


    public RecordStatusValue getStatus() {
        return status;
    }

    public void setStatus(RecordStatusValue status) {
        this.status = status;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public User getByUser() {
        return byUser;
    }

    public void setByUser(User byUser) {
        this.byUser = byUser;
    }
}
