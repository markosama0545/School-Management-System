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
            size: 10,
            sortBy: "id",
            direction: "asc"
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