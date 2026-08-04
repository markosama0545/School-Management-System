package com.innuva.schoolmanagementsystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "Name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TeacherId")
    private Teacher teacher;

    public Course() {
    }

    public Course(
            Long id,
            String name,
            Teacher teacher
    ) {
        this.id = id;
        this.name = name;
        this.teacher = teacher;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }
}