package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.PagedResponse;
import com.innuva.schoolmanagementsystem.dto.TeacherCourseInfo;
import com.innuva.schoolmanagementsystem.dto.TeacherDashboardSummaryResponse;
import com.innuva.schoolmanagementsystem.dto.TeacherStudentInfo;
import com.innuva.schoolmanagementsystem.service.TeacherDashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-dashboard")
public class TeacherDashboardController {

    private final TeacherDashboardService teacherDashboardService;

    public TeacherDashboardController(
            TeacherDashboardService teacherDashboardService
    ) {
        this.teacherDashboardService = teacherDashboardService;
    }

    @GetMapping("/summary")
    public TeacherDashboardSummaryResponse getSummary(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return teacherDashboardService.getSummary(userId);
    }

    @GetMapping("/courses")
    public List<TeacherCourseInfo> getCourses(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return teacherDashboardService.getCourses(userId);
    }

    @GetMapping("/courses/{courseId}/classes/{classId}/students")
    public PagedResponse<TeacherStudentInfo> getCourseStudentsPaged(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long courseId,
            @PathVariable Long classId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return teacherDashboardService.getCourseStudentsPaged(userId, courseId, classId, page, size);
    }
}