import { useState, useEffect } from 'react';
import api from '../api/api';

export default function StudentForm({ student, onSaved, onCancel }) {
  const isEdit = !!student;

  const [form, setForm] = useState({ name: '', class: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (student) {
      setForm({ name: student.name, class: student.class });
    } else {
      setForm({ name: '', class: '' });
    }
    setErrors({});
    setApiError('');
  }, [student]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.class.trim()) newErrors.class = 'Class is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setApiError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        const { data } = await api.put(`/students/${student.id}`, form);
        onSaved(data, true);
      } else {
        const { data } = await api.post('/students', form);
        onSaved(data, false);
      }
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">{isEdit ? '✏️ Edit Student' : '➕ Add New Student'}</span>
        <button className="btn btn-ghost btn-sm" onClick={onCancel} type="button">✕</button>
      </div>

      {apiError && <div className="alert alert-error">{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="panel-form">
          <div className="form-group">
            <label htmlFor="student-name" className="form-label">Full Name</label>
            <input
              id="student-name"
              name="name"
              type="text"
              className="form-input"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={handleChange}
              autoFocus={!isEdit}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="student-class" className="form-label">Class / Grade</label>
            <input
              id="student-class"
              name="class"
              type="text"
              className="form-input"
              placeholder="e.g. Class 10-A"
              value={form.class}
              onChange={handleChange}
            />
            {errors.class && <span className="form-error">{errors.class}</span>}
          </div>

          <div className="panel-form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button id="student-submit-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving…</>
              ) : isEdit ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
