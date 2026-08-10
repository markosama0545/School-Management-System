import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import { ArrowLeft, Users, School, User } from "lucide-react";
import { getStudentClassmates, getStudentSummary } from "../api/studentApi";

const PAGE_SIZE = 10;

export default function StudentClassPage({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const [classmates, setClassmates] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [summary, setSummary] = useState(null);

    const load = useCallback(async (pg) => {
        try {
            setLoading(true);
            setError("");
            const data = await getStudentClassmates(currentUser.userId, pg, PAGE_SIZE);
            setClassmates(data.content);
            setPage(data.page);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            setError("Could not load classmates.");
        } finally {
            setLoading(false);
        }
    }, [currentUser.userId]);

    useEffect(() => {
        load(0);
        getStudentSummary(currentUser.userId).then(setSummary).catch(() => {});
    }, [currentUser.userId, load]);

    const className = summary?.className || "My Class";

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />

            <main className="page-content page-content--wide">
                {/* Page header */}
                <div className="page-header">
                    <div className="page-header__left">
                        <button className="back-btn" onClick={() => navigate("/student")}>
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="page-title">{className}</h1>
                        <p className="page-subtitle">My Class &middot; {totalElements} classmate{totalElements !== 1 ? "s" : ""}</p>
                    </div>
                </div>

                {/* Two-column layout */}
                <div className="class-page-grid">

                    {/* LEFT — Class Overview card */}
                    <aside className="class-overview-card">
                        <div className="class-overview-card__icon-wrap">
                            <School size={32} />
                        </div>
                        <h2 className="class-overview-card__name">{className}</h2>
                        <div className="class-overview-card__stat">
                            <Users size={15} />
                            <span>
                                {loading
                                    ? "Loading…"
                                    : `${totalElements} classmate${totalElements !== 1 ? "s" : ""}`}
                            </span>
                        </div>

                        <hr className="class-overview-card__divider" />

                        <p className="class-overview-card__label">Current page</p>
                        <p className="class-overview-card__value">
                            {totalPages > 0 ? `${page + 1} / ${totalPages}` : "—"}
                        </p>

                        {totalElements > 0 && (
                            <>
                                <p className="class-overview-card__label" style={{ marginTop: "12px" }}>Showing</p>
                                <p className="class-overview-card__value">
                                    {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalElements)} of {totalElements}
                                </p>
                            </>
                        )}
                    </aside>

                    {/* RIGHT — Classmates card */}
                    <div className="mgmt-card class-mates-card">
                        {/* Card header */}
                        <div className="class-mates-card__header">
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Users size={18} style={{ color: "var(--primary)" }} />
                                <span className="class-mates-card__title">Classmates</span>
                            </div>
                            {!loading && !error && (
                                <span className="class-mates-card__count">
                                    {totalElements} student{totalElements !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="loading-state"><div className="loading-spinner" /><p>Loading classmates…</p></div>
                        ) : error ? (
                            <div className="error-state"><p>{error}</p></div>
                        ) : classmates.length === 0 ? (
                            <div className="empty-state">
                                <Users size={36} />
                                <p>No classmates found.</p>
                            </div>
                        ) : (
                            <>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "56px" }}>#</th>
                                            <th>Student Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classmates.map((name, i) => (
                                            <tr key={i}>
                                                <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                                                    {page * PAGE_SIZE + i + 1}
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <span className="classmate-avatar">
                                                            <User size={13} />
                                                        </span>
                                                        {name}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    totalElements={totalElements}
                                    size={PAGE_SIZE}
                                    onPageChange={load}
                                />
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
