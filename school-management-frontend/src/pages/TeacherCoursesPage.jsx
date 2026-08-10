import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ArrowLeft, BookOpen, ChevronRight, School } from "lucide-react";
import { getTeacherCourses } from "../api/teacherApi";

export default function TeacherCoursesPage({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError("");
                const data = await getTeacherCourses(currentUser.userId);
                setCourses(data);
            } catch {
                setError("Could not load courses.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [currentUser.userId]);

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main className="page-content page-content--mgmt">
                <div className="page-header">
                    <div className="page-header__left">
                        <button className="back-btn" onClick={() => navigate("/teacher")}>
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="page-title">My Courses</h1>
                        <p className="page-subtitle">Select a course to view assigned classes and manage student grades</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state"><div className="loading-spinner" /><p>Loading courses…</p></div>
                ) : error ? (
                    <div className="error-state"><p>{error}</p></div>
                ) : courses.length === 0 ? (
                    <div className="empty-state"><p>No courses assigned yet.</p></div>
                ) : (
                    <div className="teacher-courses-grid-enhanced" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                        {courses.map(course => {
                            const classCount = course.classes?.length || 0;
                            return (
                                <div 
                                    key={course.courseId} 
                                    className="teacher-course-card-enhanced"
                                    style={{
                                        background: "var(--card-bg)",
                                        border: "1.5px solid var(--border)",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        gap: "20px",
                                        boxShadow: "var(--shadow-sm)",
                                        transition: "transform 0.15s, border-color 0.15s"
                                    }}
                                >
                                    <div>
                                        <div 
                                            className="course-icon-wrap"
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                borderRadius: "12px",
                                                background: "rgba(255, 107, 43, 0.08)",
                                                border: "1.5px solid rgba(255, 107, 43, 0.2)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "var(--primary)",
                                                marginBottom: "16px"
                                            }}
                                        >
                                            <BookOpen size={22} />
                                        </div>
                                        <h3 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 6px 0", color: "var(--text-primary)" }}>
                                            {course.courseName}
                                        </h3>
                                        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: 0 }}>
                                            {classCount} class{classCount !== 1 ? "es" : ""} assigned
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => navigate(`/teacher/courses/${course.courseId}/classes`, { 
                                            state: { 
                                                courseName: course.courseName,
                                                classes: course.classes
                                            } 
                                        })}
                                        className="btn-secondary"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "6px",
                                            padding: "11px",
                                            fontWeight: "600",
                                            fontSize: "13.5px",
                                            borderRadius: "10px"
                                        }}
                                    >
                                        <span>View Course Classes</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
