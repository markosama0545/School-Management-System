package com.innuva.schoolmanagementsystem.dto;

public class TeacherResponse {

    private Long id;
    private String name;
    private String phone;
    private String email;

    public TeacherResponse(
            Long id,
            String name,
            String phone,
            String email
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }
}