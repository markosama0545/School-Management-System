import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import "./App.css";

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