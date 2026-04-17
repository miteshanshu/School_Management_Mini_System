export default function StudentList({ students, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="loading-overlay">
        <span className="spinner" />
        Loading students…
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">👨‍🎓</div>
          <p>No students yet.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click "Add Student" to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper animate-fade-in">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Class</th>
            <th>Tasks</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {index + 1}
              </td>
              <td>
                <span className="font-medium">{student.name}</span>
              </td>
              <td>
                <span
                  style={{
                    background: 'rgba(79,110,247,0.12)',
                    color: 'var(--accent-1)',
                    padding: '2px 10px',
                    borderRadius: '99px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}
                >
                  {student.class}
                </span>
              </td>
              <td>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {student._count?.tasks ?? 0} task{student._count?.tasks !== 1 ? 's' : ''}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {new Date(student.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    id={`edit-student-${student.id}`}
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit(student)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    id={`delete-student-${student.id}`}
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(student.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
