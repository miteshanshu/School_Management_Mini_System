export default function TaskList({ tasks, loading, onEdit, onDelete, onToggleStatus }) {
  if (loading) {
    return (
      <div className="loading-overlay">
        <span className="spinner" />
        Loading tasks…
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No tasks assigned yet.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click "Assign Task" to add one.
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
            <th>Title</th>
            <th>Student</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Assigned On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id}>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {index + 1}
              </td>
              <td>
                <div>
                  <span className="font-medium">{task.title}</span>
                  {task.description && (
                    <p style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      marginTop: 2,
                      maxWidth: 260,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {task.description}
                    </p>
                  )}
                </div>
              </td>
              <td>
                <div style={{ fontSize: '0.875rem' }}>
                  <span className="font-medium">{task.student?.name ?? '—'}</span>
                  {task.student?.class && (
                    <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: '0.78rem' }}>
                      {task.student.class}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span className={`badge badge-${task.status === 'COMPLETED' ? 'completed' : 'pending'}`}>
                  {task.status === 'COMPLETED' ? '✓ Completed' : '● Pending'}
                </span>
              </td>
              <td style={{ color: task.dueDate ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.875rem' }}>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })
                  : '—'}
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {new Date(task.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </td>
              <td>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  <button
                    id={`toggle-task-${task.id}`}
                    className={`btn btn-sm ${task.status === 'COMPLETED' ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => onToggleStatus(task)}
                    title={task.status === 'COMPLETED' ? 'Mark as Pending' : 'Mark as Completed'}
                  >
                    {task.status === 'COMPLETED' ? '↩ Undo' : '✓ Complete'}
                  </button>
                  <button
                    id={`edit-task-${task.id}`}
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit(task)}
                  >
                    ✏️
                  </button>
                  <button
                    id={`delete-task-${task.id}`}
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(task.id)}
                  >
                    🗑️
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
