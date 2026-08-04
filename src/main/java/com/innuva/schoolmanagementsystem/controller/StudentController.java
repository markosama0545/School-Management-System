package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.PagedResponse;
import com.innuva.schoolmanagementsystem.dto.StudentRequest;
import com.innuva.schoolmanagementsystem.dto.StudentResponse;
import com.innuva.schoolmanagementsystem.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<StudentResponse>> getStudents(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return ResponseEntity.ok(
                studentService.getStudents(
                        userId,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    @PostMapping
    public ResponseEntity<StudentResponse> saveStudent(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody StudentRequest request
    ) {
        StudentResponse response =
                studentService.saveStudent(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id
    ) {
        StudentResponse response =
                studentService.getStudentById(userId, id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request
    ) {
        return ResponseEntity.ok(
                studentService.updateStudent(
                        userId,
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id
    ) {
        studentService.deleteStudent(userId, id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<StudentResponse>> searchStudents(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return ResponseEntity.ok(
                studentService.searchStudents(
                        userId,
                        name,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

}