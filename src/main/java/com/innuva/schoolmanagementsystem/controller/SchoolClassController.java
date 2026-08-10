package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.dto.SchoolClassRequest;
import com.innuva.schoolmanagementsystem.dto.SchoolClassResponse;
import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import com.innuva.schoolmanagementsystem.service.SchoolClassService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class SchoolClassController {

    private final SchoolClassService schoolClassService;

    public SchoolClassController(
            SchoolClassService schoolClassService
    ) {
        this.schoolClassService = schoolClassService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolClass> getClassById(
            @PathVariable Long id
    ) {
        return schoolClassService
                .getClassById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<SchoolClassResponse>> getAllClasses(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return ResponseEntity.ok(
                schoolClassService.getAllClasses(userId)
        );
    }

    @GetMapping("/paged")
    public ResponseEntity<com.innuva.schoolmanagementsystem.dto.PagedResponse<SchoolClassResponse>> getClassesPaged(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return ResponseEntity.ok(
                schoolClassService.getClassesPaged(userId, page, size, sortBy, direction)
        );
    }

    @PostMapping
    public ResponseEntity<SchoolClassResponse> createClass(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody SchoolClassRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(schoolClassService.createClass(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolClassResponse> updateClass(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody SchoolClassRequest request
    ) {
        return ResponseEntity.ok(
                schoolClassService.updateClass(userId, id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id
    ) {
        schoolClassService.deleteClass(userId, id);
        return ResponseEntity.noContent().build();
    }
}