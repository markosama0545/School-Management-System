import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const api = axios.create({ baseURL: API_BASE_URL });

export async function getCourses(userId) {
    const response = await api.get("/courses", {
        headers: { "X-User-Id": userId }
    });
    return response.data;
}

export async function getCoursesPaged(userId, page = 0, size = 5, sortBy = "id", direction = "asc") {
    const response = await api.get("/courses/paged", {
        headers: { "X-User-Id": userId },
        params: { page, size, sortBy, direction }
    });
    return response.data;
}

export async function createCourse(userId, courseData) {
    const response = await api.post("/courses", courseData, {
        headers: { "X-User-Id": userId }
    });
    return response.data;
}

export async function updateCourse(userId, courseId, courseData) {
    const response = await api.put(`/courses/${courseId}`, courseData, {
        headers: { "X-User-Id": userId }
    });
    return response.data;
}

export async function deleteCourse(userId, courseId) {
    await api.delete(`/courses/${courseId}`, {
        headers: { "X-User-Id": userId }
    });
}
