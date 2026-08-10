import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import { ArrowLeft, School, ChevronRight } from "lucide-react";

export default function TeacherCourseClassesPage({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { courseId } = useParams(); // FIXED: Read real courseId from route params instead of state.courseId

    const courseName = state?.courseName || "Course Details";
    const classes = state?.classes || [];

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main className="page-content page-content--mgmt">
                <div className="page-header">
                    <div className="page-header__left">
                        <button className="back-btn" onClick={() => navigate("/teacher/courses")}>
                            <ArrowLeft size={16} /> Back to Courses
                        </button>
                        <h1 className="page-title">{courseName}</h1>
                        <p className="page-subtitle">Select a class section to view student grades</p>
                    </div>
                </div>

                {classes.length === 0 ? (
                    <div className="empty-state">
                        <School size={36} style={{ color: "var(--text-muted)", marginBottom: "12px" }} />
                        <p>No classes assigned to this course.</p>
                    </div>
                ) : (
                    <div className="teacher-classes-list-enhanced" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {classes.map(cl => (
                            <button
                                key={cl.classId}
                                className="mgmt-nav-card"
                                onClick={() => navigate(`/teacher/courses/${courseId}/classes/${cl.classId}`, { 
                                    state: { 
                                        courseName, 
                                        className: cl.className 
                                    } 
                                })}
                                style={{
                                    padding: "20px 24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    textAlign: "left",
                                    background: "var(--card-bg)",
                                    border: "1.5px solid var(--border)",
                                    borderRadius: "14px"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div 
                                        style={{
                                            width: "44px",
                                            height: "44px",
                                            borderRadius: "10px",
                                            background: "rgba(255,107,43,0.06)",
                                            border: "1px solid rgba(255,107,43,0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "var(--primary)"
                                        }}
                                    >
                                        <School size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 2px 0", color: "var(--text-primary)" }}>
                                            {cl.className}
                                        </h3>
                                        <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                                            Manage grades and performance records
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: "600", fontSize: "13px" }}>
                                    <span>Manage Class</span>
                                    <ChevronRight size={16} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
