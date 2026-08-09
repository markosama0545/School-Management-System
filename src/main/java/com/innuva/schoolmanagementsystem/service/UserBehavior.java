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

    public boolean canViewClass(Long userId) {
        return hasRight(userId, "CanViewClass");
    }

    public boolean canAddClass(Long userId) {
        return hasRight(userId, "CanAddClass");
    }

    public boolean canEditClass(Long userId) {
        return hasRight(userId, "CanEditClass");
    }

    public boolean canDeleteClass(Long userId) {
        return hasRight(userId, "CanDeleteClass");
    }

    public void requireCanViewClass(Long userId) {
        if (!canViewClass(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to view classes"
            );
        }
    }

    public void requireCanAddClass(Long userId) {
        if (!canAddClass(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to add classes"
            );
        }
    }

    public void requireCanEditClass(Long userId) {
        if (!canEditClass(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to edit classes"
            );
        }
    }

    public void requireCanDeleteClass(Long userId) {
        if (!canDeleteClass(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to delete classes"
            );
        }
    }

    public boolean canViewCourse(Long userId) {
        return hasRight(userId, "CanViewCourse");
    }

    public boolean canAddCourse(Long userId) {
        return hasRight(userId, "CanAddCourse");
    }

    public boolean canEditCourse(Long userId) {
        return hasRight(userId, "CanEditCourse");
    }

    public boolean canDeleteCourse(Long userId) {
        return hasRight(userId, "CanDeleteCourse");
    }

    public void requireCanViewCourse(Long userId) {
        if (!canViewCourse(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to view courses"
            );
        }
    }

    public void requireCanAddCourse(Long userId) {
        if (!canAddCourse(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to add courses"
            );
        }
    }

    public void requireCanEditCourse(Long userId) {
        if (!canEditCourse(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to edit courses"
            );
        }
    }

    public void requireCanDeleteCourse(Long userId) {
        if (!canDeleteCourse(userId)) {
            throw new AccessDeniedException(
                    "You do not have permission to delete courses"
            );
        }
    }
}