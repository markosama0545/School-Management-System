function UserSelector({ userId, setUserId }) {
    return (
        <div className="user-selector">

            <label htmlFor="user">
                Current User:
            </label>

            <select
                id="user"
                value={userId}
                onChange={(e) => setUserId(Number(e.target.value))}
            >
                <option value={1}>
                    Admin - Mark
                </option>

                <option value={2}>
                    Teacher - Ahmed
                </option>

                <option value={3}>
                    Student - Mina
                </option>

            </select>

        </div>
    );
}

export default UserSelector;