import { useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet
} from "react-router-dom";
import "./App.css";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminTeachersPage from "./pages/AdminTeachersPage";
import AdminClassesPage from "./pages/AdminClassesPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherCoursesPage from "./pages/TeacherCoursesPage";
import TeacherCourseClassesPage from "./pages/TeacherCourseClassesPage";
import TeacherCourseDetailPage from "./pages/TeacherCourseDetailPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentAcademicPage from "./pages/StudentAcademicPage";
import StudentClassPage from "./pages/StudentClassPage";

/* ------------------------------------------------------------------ */
/* Protected route wrappers                                             */
/* ------------------------------------------------------------------ */

function RequireRole({ currentUser, role, onLogout }) {
    if (!currentUser) return <Navigate to="/" replace />;
    if (currentUser.roleName !== role) return <Navigate to="/" replace />;
    return <Outlet context={{ currentUser, onLogout }} />;
}

/* ------------------------------------------------------------------ */
/* App                                                                  */
/* ------------------------------------------------------------------ */

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    function handleLogin(user) {
        setCurrentUser(user);
    }

    function handleLogout() {
        setCurrentUser(null);
    }

    /* Default redirect after login based on role */
    function defaultPath() {
        if (!currentUser) return "/";
        if (currentUser.roleName === "Admin") return "/admin";
        if (currentUser.roleName === "Teacher") return "/teacher";
        if (currentUser.roleName === "Student") return "/student";
        return "/";
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Login / root */}
                <Route
                    path="/"
                    element={
                        currentUser
                            ? <Navigate to={defaultPath()} replace />
                            : <LoginPage onLogin={handleLogin} />
                    }
                />

                {/* ---- ADMIN ---- */}
                <Route
                    element={
                        <RequireRole
                            currentUser={currentUser}
                            role="Admin"
                            onLogout={handleLogout}
                        />
                    }
                >
                    <Route
                        path="/admin"
                        element={
                            <AdminDashboard
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                    <Route
                        path="/admin/students"
                        element={
                            <AdminStudentsPage
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                    <Route
                        path="/admin/teachers"
                        element={
                            <AdminTeachersPage
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                    <Route
                        path="/admin/classes"
                        element={
                            <AdminClassesPage
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                    <Route
                        path="/admin/courses"
                        element={
                            <AdminCoursesPage
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                </Route>

                {/* ---- TEACHER ---- */}
                <Route
                    element={
                        <RequireRole
                            currentUser={currentUser}
                            role="Teacher"
                            onLogout={handleLogout}
                        />
                    }
                >
                    <Route
                        path="/teacher"
                        element={
                            <TeacherDashboard
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                    <Route
                        path="/teacher/courses"
                        element={
                            <TeacherCoursesPage
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                    <Route
                        path="/teacher/courses/:courseId/classes"
                        element={
                            <TeacherCourseClassesPage
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                    <Route
                        path="/teacher/courses/:courseId/classes/:classId"
                        element={
                            <TeacherCourseDetailPage
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                </Route>

                {/* ---- STUDENT ---- */}
                <Route
                    element={
                        <RequireRole
                            currentUser={currentUser}
                            role="Student"
                            onLogout={handleLogout}
                        />
                    }
                >
                    <Route
                        path="/student"
                        element={
                            <StudentDashboard
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                    <Route
                        path="/student/academic"
                        element={
                            <StudentAcademicPage
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                    <Route
                        path="/student/class"
                        element={
                            <StudentClassPage
                                currentUser={currentUser}
                                onLogout={handleLogout}
                            />
                        }
                    />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;