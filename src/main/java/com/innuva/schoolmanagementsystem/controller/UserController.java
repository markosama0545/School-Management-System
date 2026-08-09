package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.service.UserBehavior;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserBehavior userBehavior;

    public UserController(UserBehavior userBehavior) {
        this.userBehavior = userBehavior;
    }

    @GetMapping("/{userId}/rights")
    public ResponseEntity<Map<String, Boolean>> getUserRights(
            @PathVariable Long userId
    ) {
        Map<String, Boolean> rights = new LinkedHashMap<>();

        rights.put(
                "CanViewStudent",
                userBehavior.canViewStudent(userId)
        );

        rights.put(
                "CanAddStudent",
                userBehavior.canAddStudent(userId)
        );

        rights.put(
                "CanEditStudent",
                userBehavior.canEditStudent(userId)
        );

        rights.put(
                "CanDeleteStudent",
                userBehavior.canDeleteStudent(userId)
        );

        rights.put(
                "CanViewClass",
                userBehavior.canViewClass(userId)
        );

        rights.put(
                "CanAddClass",
                userBehavior.canAddClass(userId)
        );

        rights.put(
                "CanEditClass",
                userBehavior.canEditClass(userId)
        );

        rights.put(
                "CanDeleteClass",
                userBehavior.canDeleteClass(userId)
        );

        return ResponseEntity.ok(rights);
    }
}