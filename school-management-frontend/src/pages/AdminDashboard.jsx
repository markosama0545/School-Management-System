import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { Users, GraduationCap, School, BookOpen, ChevronRight } from "lucide-react";
import { getAdminSummary } from "../api/studentApi";

export default function AdminDashboard({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSummary() {
            try {
                setLoading(true);
                setError("");
                const data = await getAdminSummary(currentUser.userId);
                setSummary(data);
            } catch (err) {
                console.error(err);
                setError("Could not load dashboard summary.");
            } finally {
                setLoading(false);
            }
        }
        loadSummary();
    }, [currentUser.userId]);

    const navCards = [
        {
            label: "Students Management",
            icon: Users,
            path: "/admin/students",
            description: "Add, edit, delete and manage student accounts"
        },
        {
            label: "Teachers Management",
            icon: GraduationCap,
            path: "/admin/teachers",
            description: "Add, edit, delete and manage teacher accounts"
        },
        {
            label: "Classes Management",
            icon: School,
            path: "/admin/classes",
            description: "Create and manage school classes"
        },
        {
            label: "Courses Management",
            icon: BookOpen,
            path: "/admin/courses",
            description: "Assign teachers and classes to courses"
        }
    ];

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />

            <main className="page-content page-content--wide">
                {/* Page header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Admin Dashboard</h1>
                        <p className="page-subtitle">System overview and management navigation</p>
                    </div>
                </div>

                {/* Summary cards */}
                <section className="admin-summary-grid">
                    {loading ? (
                        <>
                            <div className="skeleton-card-pulse" />
                            <div className="skeleton-card-pulse" />
                            <div className="skeleton-card-pulse" />
                            <div className="skeleton-card-pulse" />
                        </>
                    ) : error ? (
                        <div className="error-state" style={{ gridColumn: "1/-1" }}>
                            <p>{error}</p>
                        </div>
                    ) : summary ? (
                        <>
                            <StatCard
                                icon={Users}
                                label="Total Students"
                                value={summary.studentCount}
                                accent="#ff6b2b"
                            />
                            <StatCard
                                icon={GraduationCap}
                                label="Total Teachers"
                                value={summary.teacherCount}
                                accent="#ff6b2b"
                            />
                            <StatCard
                                icon={School}
                                label="Total Classes"
                                value={summary.classCount}
                                accent="#ff6b2b"
                            />
                            <StatCard
                                icon={BookOpen}
                                label="Total Courses"
                                value={summary.courseCount}
                                accent="#ff6b2b"
                            />
                        </>
                    ) : null}
                </section>

                {/* Navigation cards */}
                <section style={{ marginTop: "2rem" }}>
                    <h2 className="section-title">Management</h2>
                    <div className="mgmt-nav-grid">
                        {navCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <button
                                    key={card.path}
                                    className="mgmt-nav-card"
                                    onClick={() => navigate(card.path)}
                                >
                                    <div className="mgmt-nav-card__icon">
                                        <Icon size={26} />
                                    </div>
                                    <div className="mgmt-nav-card__body">
                                        <span className="mgmt-nav-card__label">{card.label}</span>
                                        <span className="mgmt-nav-card__desc">{card.description}</span>
                                    </div>
                                    <ChevronRight size={20} className="mgmt-nav-card__arrow" />
                                </button>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}