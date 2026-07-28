package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.StudentRequest;
import com.innuva.schoolmanagementsystem.dto.StudentResponse;
import com.innuva.schoolmanagementsystem.entity.Student;
import com.innuva.schoolmanagementsystem.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<StudentResponse> getStudents() {
        return studentService.getStudents();
    }

    @PostMapping
    public StudentResponse saveStudent(
            @RequestBody StudentRequest request) {

        return studentService.saveStudent(request);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(
            @PathVariable Long id
    ) {
        return studentService
                .getStudentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentRequest request) {

        return studentService
                .updateStudent(id, request)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {

        boolean deleted = studentService.deleteStudent(id);

        if (deleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}