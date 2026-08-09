package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.TeacherDashboardResponse;
import com.innuva.schoolmanagementsystem.service.TeacherDashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher-dashboard")
public class TeacherDashboardController {

    private final TeacherDashboardService teacherDashboardService;

    public TeacherDashboardController(
            TeacherDashboardService teacherDashboardService
    ) {
        this.teacherDashboardService = teacherDashboardService;
    }

    @GetMapping
    public TeacherDashboardResponse getDashboard(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return teacherDashboardService.getDashboard(userId);
    }
}