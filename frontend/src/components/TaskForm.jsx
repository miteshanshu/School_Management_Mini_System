import { useState, useEffect } from 'react';
import api from '../api/api';

export default function TaskForm({ task, students, onSaved, onCancel }) {
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: '',
    description: '',
    studentId: '',
    dueDate: '',
    status: 'PENDING',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        studentId: task.studentId || '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        status: task.status || 'PENDING',
      });
    } else {
      setForm({ title: '', description: '', studentId: '', dueDate: '', status: 'PENDING' });
    }
    setErrors({});
    setApiError('');
  }, [task]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Task title is required.';
    if (!form.studentId) newErrors.studentId = 'Please select a student.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      studentId: form.studentId,
      dueDate: form.dueDate || null,
      status: form.status,
    };

    setLoading(true);
    try {
      if (isEdit) {
        const { data } = await api.put(`/tasks/${task.id}`, payload);
        onSaved(data, true);
      } else {
        const { data } = await api.post('/tasks', payload);
        onSaved(data, false);
      }
    } catch (err) {
      const raw = err.response?.data?.error;
      setApiError(typeof raw === 'string' ? raw : raw?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">{isEdit ? '✏️ Edit Task' : '➕ Assign New Task'}</span>
        <button className="btn btn-ghost btn-sm" onClick={onCancel} type="button">✕</button>
      </div>

      {apiError && <div className="alert alert-error">{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="panel-form">
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">Task Title *</label>
            <input
              id="task-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Complete Math Homework"
              value={form.title}
              onChange={handleChange}
              autoFocus={!isEdit}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-student" className="form-label">Assign To *</label>
            <select
              id="task-student"
              name="studentId"
              className="form-select"
              value={form.studentId}
              onChange={handleChange}
            >
              <option value="">— Select a student —</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.class})
                </option>
              ))}
            </select>
            {errors.studentId && <span className="form-error">{errors.studentId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-duedate" className="form-label">Due Date</label>
            <input
              id="task-duedate"
              name="dueDate"
              type="date"
              className="form-input"
              value={form.dueDate}
              onChange={handleChange}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-status" className="form-label">Status</label>
            <select
              id="task-status"
              name="status"
              className="form-select"
              value={form.status}
              onChange={handleChange}
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="task-description" className="form-label">Description (optional)</label>
            <textarea
              id="task-description"
              name="description"
              className="form-textarea"
              placeholder="Add any details about this task…"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="panel-form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button id="task-submit-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving…</>
              ) : isEdit ? 'Update Task' : 'Assign Task'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
