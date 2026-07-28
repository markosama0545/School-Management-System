package com.innuva.schoolmanagementsystem.repository;

import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolClassRepository
        extends JpaRepository<SchoolClass, Long> {
}