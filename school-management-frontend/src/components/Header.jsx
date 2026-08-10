import logo from "../assets/logo.jpg";

function Header({ currentUser, onLogout }) {
    return (
        <header className="shared-header">
            <div className="header-brand">
                <img src={logo} alt="INNUVA Logo" className="header-logo" />
                <span className="header-title">INNUVA School Management System</span>
            </div>
            <div className="header-user-info">
                <span className="header-user-name">{currentUser.username}</span>
                <span className="header-role-badge">{currentUser.roleName}</span>
                <button onClick={onLogout} className="header-logout-button">
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Header;
