function StatCard({ icon: IconComponent, label, count, value }) {
    const displayValue = value !== undefined ? value : count;
    return (
        <div className="admin-summary-card">
            <div className="admin-summary-icon-container">
                <IconComponent className="admin-summary-icon-svg" size={24} strokeWidth={1.5} />
            </div>
            <div className="admin-summary-info">
                <div className="admin-summary-label">{label}</div>
                <div className="admin-summary-count">{displayValue}</div>
            </div>
        </div>
    );
}

export default StatCard;
