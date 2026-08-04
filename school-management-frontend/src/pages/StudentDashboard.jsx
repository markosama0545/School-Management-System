import { useEffect, useState } from "react";
import { getStudentDashboard } from "../api/studentApi";

function StudentDashboard({ currentUser, onLogout }) {
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            const data = await getStudentDashboard(currentUser.userId);
            setDashboard(data);
        } catch (error) {
            console.error(error);
            setError("Could not load the student dashboard");
        }
    }

    if (error) {
        return (
            <main className="app">
                <p>{error}</p>
                <button onClick={onLogout}>Logout</button>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="app">
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className="app">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {dashboard.name}</h1>
                    <p>Student ID: {dashboard.studentId}</p>
                    <p>Class: {dashboard.className}</p>
                </div>

                <button onClick={onLogout}>
                    Logout
                </button>
            </div>

            <section className="dashboard-section">
                <h2>Classmates</h2>

                {dashboard.classmates.length === 0 ? (
                    <p>No classmates found.</p>
                ) : (
                    <ul>
                        {dashboard.classmates.map((classmate) => (
                            <li key={classmate}>
                                {classmate}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="dashboard-section">
                <h2>Courses and Grades</h2>

                <table>
                    <thead>
                    <tr>
                        <th>Course</th>
                        <th>Teacher</th>
                        <th>Grade</th>
                    </tr>
                    </thead>

                    <tbody>
                    {dashboard.courses.map((course) => (
                        <tr key={course.courseName}>
                            <td>{course.courseName}</td>
                            <td>{course.teacherName}</td>
                            <td>{course.grade}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}

export default StudentDashboard;