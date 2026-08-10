package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.AdminDashboardSummaryResponse;
import com.innuva.schoolmanagementsystem.service.AdminDashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin-dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/summary")
    public AdminDashboardSummaryResponse getSummary(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return adminDashboardService.getSummary(userId);
    }
}
