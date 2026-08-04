package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.exception.AccessDeniedException;
import com.innuva.schoolmanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserBehavior {

    private final UserRepository userRepository;

    public UserBehavior(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private boolean hasRight(Long userId, String rightName) {

        List<String> rights =
                userRepository.findRightNamesByUserId(userId);

        return rights.contains(rightName);
    }

    public boolean canViewStudent(Long userId) {
        return hasRight(userId, "CanViewStudent");
    }

    public boolean canAddStudent(Long userId) {
        return hasRight(userId, "CanAddStudent");
    }

    public boolean canEditStudent(Long userId) {
        return hasRight(userId, "CanEditStudent");
    }

    public boolean canDeleteStudent(Long userId) {
        return hasRight(userId, "CanDeleteStudent");
    }

    public void requireCanViewStudent(Long userId) {
        if (!canViewStudent(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to view students"
            );
        }
    }

    public void requireCanAddStudent(Long userId) {
        if (!canAddStudent(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to add students"
            );
        }
    }

    public void requireCanEditStudent(Long userId) {
        if (!canEditStudent(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to edit students"
            );
        }
    }

    public void requireCanDeleteStudent(Long userId) {
        if (!canDeleteStudent(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to delete students"
            );
        }
    }
}