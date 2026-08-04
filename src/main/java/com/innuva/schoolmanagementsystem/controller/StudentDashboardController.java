package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.StudentDashboardResponse;
import com.innuva.schoolmanagementsystem.service.StudentDashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student-dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentDashboardController {

    private final StudentDashboardService studentDashboardService;

    public StudentDashboardController(
            StudentDashboardService studentDashboardService
    ) {
        this.studentDashboardService = studentDashboardService;
    }

    @GetMapping
    public StudentDashboardResponse getDashboard(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return studentDashboardService.getDashboard(userId);
    }
}