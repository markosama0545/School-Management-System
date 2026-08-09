package com.innuva.schoolmanagementsystem.repository;

import com.innuva.schoolmanagementsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsernameIgnoreCase(String username);

    Optional<User> findByUsernameIgnoreCaseAndPassword(
            String username,
            String password
    );

    @Query(value = """
            SELECT r.NAME
            FROM users u
            JOIN roles r ON r.ID = u.RoleId
            WHERE u.Id = :userId
            """, nativeQuery = true)
    String findRoleNameByUserId(
            @Param("userId") Long userId
    );

    @Query(value = """
            SELECT r.NAME
            FROM users u
            JOIN rolerights rr ON rr.RoleId = u.RoleId
            JOIN rights r ON r.ID = rr.RightId
            WHERE u.Id = :userId
            """, nativeQuery = true)
    List<String> findRightNamesByUserId(
            @Param("userId") Long userId
    );
}