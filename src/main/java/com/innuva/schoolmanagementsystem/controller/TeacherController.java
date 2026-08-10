package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.TeacherRequest;
import com.innuva.schoolmanagementsystem.dto.TeacherResponse;
import com.innuva.schoolmanagementsystem.service.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.innuva.schoolmanagementsystem.dto.CreateTeacherRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(
            TeacherService teacherService
    ) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public ResponseEntity<List<TeacherResponse>> getTeachers() {
        return ResponseEntity.ok(
                teacherService.getTeachers()
        );
    }

    @GetMapping("/paged")
    public ResponseEntity<com.innuva.schoolmanagementsystem.dto.PagedResponse<TeacherResponse>> getTeachersPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return ResponseEntity.ok(
                teacherService.getTeachersPaged(page, size, sortBy, direction)
        );
    }


    @PostMapping("/with-account")
    public ResponseEntity<TeacherResponse> createTeacherWithAccount(
            @Valid @RequestBody CreateTeacherRequest request
    ) {
        TeacherResponse response =
                teacherService.createTeacherWithAccount(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @PutMapping("/{id}")
    public ResponseEntity<TeacherResponse> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherRequest request
    ) {
        return ResponseEntity.ok(
                teacherService.updateTeacher(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(
            @PathVariable Long id
    ) {
        teacherService.deleteTeacher(id);

        return ResponseEntity.noContent().build();
    }

}