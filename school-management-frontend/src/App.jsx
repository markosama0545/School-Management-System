import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import "./App.css";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    if (!currentUser) {
        return <LoginPage onLogin={setCurrentUser} />;
    }

    if (currentUser.roleName === "Student") {
        return (
            <StudentDashboard
                currentUser={currentUser}
                onLogout={() => setCurrentUser(null)}
            />
        );
    }

    if (currentUser.roleName === "Teacher") {
        return (
            <TeacherDashboard
                currentUser={currentUser}
                onLogout={() => setCurrentUser(null)}
            />
        );
    }

    if (currentUser.roleName === "Admin") {
        return (
            <AdminDashboard
                currentUser={currentUser}
                onLogout={() => setCurrentUser(null)}
            />
        );
    }

    return (
        <main className="app">
            <h1>Welcome, {currentUser.username}</h1>
            <p>User ID: {currentUser.userId}</p>
            <p>Role: {currentUser.roleName}</p>

            <button onClick={() => setCurrentUser(null)}>
                Logout
            </button>
        </main>
    );
}




export default App;