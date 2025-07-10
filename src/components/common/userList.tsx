export function renderUserList(
    city: string,
    users: { fullName: string; phone: string }[] | undefined
) {
    if (!users?.length) return null;

    return (
        <div key={city} className="mb-4">
            <h4 className="text-sm font-medium text-primary mb-1">
                📍 {city} ({users.length})
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                {users.map((user, idx) => (
                    <li key={idx}>
                        • {user.fullName} – {user.phone}
                    </li>
                ))}
            </ul>
        </div>
    );
}
