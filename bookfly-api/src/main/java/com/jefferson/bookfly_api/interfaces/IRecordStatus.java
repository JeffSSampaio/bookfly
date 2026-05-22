package com.jefferson.bookfly_api.interfaces;

import com.jefferson.bookfly_api.models.User;

public interface IRecordStatus {
    public void delete(User user);
    public void active(User user);
}
