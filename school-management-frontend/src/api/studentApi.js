import axios from "axios";
import {API_BASE_URL} from "./apiConfig";

const api = axios.create({
    baseURL: API_BASE_URL
});

export async function getUserRights(userId) {
    const response = await api.get(
        `/users/${userId}/rights`
    );

    return response.data;
}

export async function getStudents(userId) {
    const response = await api.get("/students", {
        headers: {
            "X-User-Id": userId
        },
        params: {
            page: 0,
            size: 1000, // Load large amount for legacy dropdown compatibility if needed
            sortBy: "id",
            direction: "asc"
        }
    });

    return response.data;
}

export async function getStudentsPaged(userId, page = 0, size = 5, sortBy = "id", direction = "asc") {
    const response = await api.get("/students", {
        headers: {
            "X-User-Id": userId
        },
        params: {
            page,
            size,
            sortBy,
            direction
        }
    });

    return response.data;
}

export async function searchStudentsPaged(userId, name, page = 0, size = 5, sortBy = "id", direction = "asc") {
    const response = await api.get("/students/search", {
        headers: {
            "X-User-Id": userId
        },
        params: {
            name,
            page,
            size,
            sortBy,
            direction
        }
    });

    return response.data;
}

export async function getAdminSummary(userId) {
    const response = await api.get("/admin-dashboard/summary", {
        headers: {
            "X-User-Id": userId
        }
    });
    return response.data;
}

export async function getStudentSummary(userId) {
    const response = await api.get("/student-dashboard/summary", {
        headers: {
            "X-User-Id": userId
        }
    });
    return response.data;
}

export async function getStudentCourses(userId) {
    const response = await api.get("/student-dashboard/courses", {
        headers: {
            "X-User-Id": userId
        }
    });
    return response.data;
}

export async function getStudentClassmates(userId, page = 0, size = 10) {
    const response = await api.get("/student-dashboard/classmates", {
        headers: {
            "X-User-Id": userId
        },
        params: {
            page,
            size
        }
    });
    return response.data;
}

export async function login(username, password) {
    const response = await api.post("/auth/login", {
        username,
        password
    });

    return response.data;
}

export async function getStudentDashboard(userId) {
    const response = await api.get(
        "/student-dashboard",
        {
            headers: {
                "X-User-Id": userId
            }
        }
    );

    return response.data;
}

export async function addStudentWithAccount(
    userId,
    studentData
) {
    const response = await api.post(
        "/students/with-account",
        studentData,
        {
            headers: {
                "X-User-Id": userId
            }
        }
    );

    return response.data;
}

export async function updateStudent(
    userId,
    studentId,
    studentData
) {
    const response = await api.put(
        `/students/${studentId}`,
        studentData,
        {
            headers: {
                "X-User-Id": userId
            }
        }
    );

    return response.data;
}

export async function deleteStudent(userId, studentId) {
    await api.delete(
        `/students/${studentId}`,
        {
            headers: {
                "X-User-Id": userId
            }
        }
    );
}

export default api;