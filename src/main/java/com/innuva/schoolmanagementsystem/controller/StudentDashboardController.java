package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.CourseInfo;
import com.innuva.schoolmanagementsystem.dto.PagedResponse;
import com.innuva.schoolmanagementsystem.dto.StudentDashboardSummaryResponse;
import com.innuva.schoolmanagementsystem.service.StudentDashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-dashboard")
public class StudentDashboardController {

    private final StudentDashboardService studentDashboardService;

    public StudentDashboardController(StudentDashboardService studentDashboardService) {
        this.studentDashboardService = studentDashboardService;
    }

    @GetMapping("/summary")
    public StudentDashboardSummaryResponse getSummary(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return studentDashboardService.getSummary(userId);
    }

    @GetMapping("/courses")
    public List<CourseInfo> getCourses(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return studentDashboardService.getCourses(userId);
    }

    @GetMapping("/classmates")
    public PagedResponse<String> getClassmates(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return studentDashboardService.getClassmates(userId, page, size);
    }
}