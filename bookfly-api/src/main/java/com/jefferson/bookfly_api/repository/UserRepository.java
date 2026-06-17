package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.recordStatus.recordStatusValue = 'ACTIVE'")
    List<User> findAllActive();

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.recordStatus.recordStatusValue = 'ACTIVE'")
    Optional<User> findActiveByEmail(String email);
}