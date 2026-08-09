import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const api = axios.create({
    baseURL: API_BASE_URL
});

export async function getClasses(userId) {
    const response = await api.get("/classes", {
        headers: {
            "X-User-Id": userId
        }
    });

    return response.data;
}

export async function createClass(userId, classData) {
    const response = await api.post("/classes", classData, {
        headers: {
            "X-User-Id": userId
        }
    });

    return response.data;
}

export async function updateClass(userId, classId, classData) {
    const response = await api.put(`/classes/${classId}`, classData, {
        headers: {
            "X-User-Id": userId
        }
    });

    return response.data;
}

export async function deleteClass(userId, classId) {
    await api.delete(`/classes/${classId}`, {
        headers: {
            "X-User-Id": userId
        }
    });
}
