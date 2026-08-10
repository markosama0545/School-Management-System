import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { School, Users, BookOpen, ChevronRight } from "lucide-react";
import { getTeacherSummary } from "../api/teacherApi";

export default function TeacherDashboard({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSummaryData() {
            try {
                setLoading(true);
                setError("");
                const data = await getTeacherSummary(currentUser.userId);
                setSummary(data);
            } catch {
                setError("Could not load dashboard summary.");
            } finally {
                setLoading(false);
            }
        }
        loadSummaryData();
    }, [currentUser.userId]);

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />
            
            {/* Limit container to management width around 1250px for visual balance */}
            <main className="page-content page-content--mgmt">
                
                {/* Welcoming Header Area */}
                <div className="page-header" style={{ marginBottom: "2rem" }}>
                    <div>
                        <h1 className="page-title" style={{ fontSize: "26px" }}>Teacher Dashboard</h1>
                        <p className="page-subtitle" style={{ fontSize: "14.5px" }}>
                            {summary ? `Welcome back, ${summary.teacherName}` : "Manage your courses, classes and student grades"}
                        </p>
                    </div>
                </div>

                {/* Summary counters in one clean row */}
                <section className="admin-summary-grid" style={{ marginBottom: "2.5rem" }}>
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
                            <StatCard icon={BookOpen} label="My Courses" value={summary.courseCount} accent="#ff6b2b" />
                            <StatCard icon={School} label="My Classes" value={summary.classCount} accent="#ff6b2b" />
                            <StatCard icon={Users} label="My Students" value={summary.studentCount} accent="#ff6b2b" />
                        </>
                    ) : null}
                </section>

                {/* Single Intentional Landing Action Row */}
                <section style={{ marginTop: "1rem" }}>
                    <div className="mgmt-nav-grid">
                        <button 
                            className="mgmt-nav-card" 
                            onClick={() => navigate("/teacher/courses")}
                            style={{ 
                                padding: "28px 24px",
                                background: "var(--card-bg)",
                                border: "1.5px solid var(--border)",
                                borderRadius: "14px"
                            }}
                        >
                            <div className="mgmt-nav-card__icon" style={{ background: "rgba(255, 107, 43, 0.08)", color: "var(--primary)" }}>
                                <BookOpen size={28} />
                            </div>
                            <div className="mgmt-nav-card__body" style={{ marginLeft: "16px" }}>
                                <span className="mgmt-nav-card__label" style={{ fontSize: "16px", fontWeight: "700" }}>Manage My Courses</span>
                                <span className="mgmt-nav-card__desc" style={{ fontSize: "13.5px", marginTop: "4px", color: "var(--text-secondary)" }}>
                                    View your assigned courses, classes and manage student grades.
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: "600", fontSize: "14px", marginLeft: "auto" }}>
                                <span>Open My Courses</span>
                                <ChevronRight size={18} />
                            </div>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}