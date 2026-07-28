package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import com.innuva.schoolmanagementsystem.repository.SchoolClassRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SchoolClassService {

    private final SchoolClassRepository schoolClassRepository;

    public SchoolClassService(
            SchoolClassRepository schoolClassRepository
    ) {
        this.schoolClassRepository = schoolClassRepository;
    }

    public Optional<SchoolClass> getClassById(Long id) {
        return schoolClassRepository.findById(id);
    }
}