package com.innuva.schoolmanagementsystem.repository;

import com.innuva.schoolmanagementsystem.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {

    Optional<Grade> findByStudent_IdAndCourse_Id(
            Long studentId,
            Long courseId
    );
}