package com.innuva.schoolmanagementsystem.controller;

import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import com.innuva.schoolmanagementsystem.service.SchoolClassService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}