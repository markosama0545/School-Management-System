package com.innuva.schoolmanagementsystem.repository;

import com.innuva.schoolmanagementsystem.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository
        extends JpaRepository<Course, Long> {
}