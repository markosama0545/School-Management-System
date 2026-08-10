import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { BookOpen, Users, Award, ChevronRight, School } from "lucide-react";
import { getStudentSummary } from "../api/studentApi";

export default function StudentDashboard({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError("");
                const data = await getStudentSummary(currentUser.userId);
                setSummary(data);
            } catch {
                setError("Could not load dashboard summary.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [currentUser.userId]);

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main className="page-content page-content--wide">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">
                            {summary ? `Welcome back, ${summary.studentName}` : "Welcome back"}
                        </h1>
                        <p className="page-subtitle">
                            Student ID: <strong>{summary ? summary.studentId : currentUser.userId}</strong>
                        </p>
                    </div>
                </div>

                {/* Summary stats */}
                <section className="admin-summary-grid">
                    {loading ? (
                        <>
                            <div className="skeleton-card-pulse" />
                            <div className="skeleton-card-pulse" />
                            <div className="skeleton-card-pulse" />
                        </>
                    ) : error ? (
                        <div className="error-state" style={{ gridColumn: "1/-1" }}><p>{error}</p></div>
                    ) : summary ? (
                        <>
                            <StatCard icon={BookOpen} label="Enrolled Courses" value={summary.courseCount} />
                            <StatCard
                                icon={Award}
                                label="Average Grade"
                                value={summary.averageGrade !== null && summary.averageGrade !== undefined
                                    ? `${summary.averageGrade.toFixed(1)}%`
                                    : "N/A"}
                            />
                            <StatCard icon={School} label="Class" value={summary.className || "Unassigned"} />
                        </>
                    ) : null}
                </section>

                {/* Navigation */}
                <section style={{ marginTop: "2rem" }}>
                    <h2 className="section-title">My Sections</h2>
                    <div className="mgmt-nav-grid">
                        <button className="mgmt-nav-card" onClick={() => navigate("/student/academic")}>
                            <div className="mgmt-nav-card__icon"><BookOpen size={26} /></div>
                            <div className="mgmt-nav-card__body">
                                <span className="mgmt-nav-card__label">Academic Performance</span>
                                <span className="mgmt-nav-card__desc">View your courses, teachers, and grades</span>
                            </div>
                            <ChevronRight size={20} className="mgmt-nav-card__arrow" />
                        </button>
                        <button className="mgmt-nav-card" onClick={() => navigate("/student/class")}>
                            <div className="mgmt-nav-card__icon"><Users size={26} /></div>
                            <div className="mgmt-nav-card__body">
                                <span className="mgmt-nav-card__label">My Class</span>
                                <span className="mgmt-nav-card__desc">View your classmates</span>
                            </div>
                            <ChevronRight size={20} className="mgmt-nav-card__arrow" />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}