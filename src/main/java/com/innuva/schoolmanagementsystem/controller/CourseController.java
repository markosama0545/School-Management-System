package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.CourseRequest;
import com.innuva.schoolmanagementsystem.dto.CourseResponse;
import com.innuva.schoolmanagementsystem.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(courseService.getAllCourses(userId));
    }

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CourseRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(courseService.createCourse(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request
    ) {
        return ResponseEntity.ok(courseService.updateCourse(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id
    ) {
        courseService.deleteCourse(userId, id);
        return ResponseEntity.noContent().build();
    }
}
