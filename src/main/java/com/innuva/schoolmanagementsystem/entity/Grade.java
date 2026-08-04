package com.innuva.schoolmanagementsystem.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentId")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseId")
    private Course course;

    @Column(name = "GradeValue")
    private Double gradeValue;

    @Column(name = "ExamDate")
    private LocalDate examDate;

    public Grade() {
    }

    public Grade(
            Long id,
            Student student,
            Course course,
            Double gradeValue,
            LocalDate examDate
    ) {
        this.id = id;
        this.student = student;
        this.course = course;
        this.gradeValue = gradeValue;
        this.examDate = examDate;
    }

    public Long getId() {
        return id;
    }

    public Student getStudent() {
        return student;
    }

    public Course getCourse() {
        return course;
    }

    public Double getGradeValue() {
        return gradeValue;
    }

    public LocalDate getExamDate() {
        return examDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setGradeValue(Double gradeValue) {
        this.gradeValue = gradeValue;
    }

    public void setExamDate(LocalDate examDate) {
        this.examDate = examDate;
    }
}