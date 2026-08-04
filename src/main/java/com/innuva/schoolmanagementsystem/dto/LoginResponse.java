package com.innuva.schoolmanagementsystem.dto;

import java.util.List;

public class LoginResponse {

    private Long userId;
    private String username;
    private String roleName;
    private List<String> rights;

    public LoginResponse(
            Long userId,
            String username,
            String roleName,
            List<String> rights
    ) {
        this.userId = userId;
        this.username = username;
        this.roleName = roleName;
        this.rights = rights;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getRoleName() {
        return roleName;
    }

    public List<String> getRights() {
        return rights;
    }
}