package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.UpdateGradeRequest;
import com.innuva.schoolmanagementsystem.service.GradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @PutMapping
    public ResponseEntity<Void> updateGrade(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UpdateGradeRequest request
    ) {
        gradeService.updateGrade(userId, request);

        return ResponseEntity.noContent().build();
    }
}