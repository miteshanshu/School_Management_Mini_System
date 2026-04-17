import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import StudentList from '../components/StudentList';
import StudentForm from '../components/StudentForm';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Form panel state
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    setLoadingStudents(true);
    try {
      const { data } = await api.get('/students');
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchTasks();
  }, [fetchStudents, fetchTasks]);

  // ─── Student handlers ────────────────────────────────────────────────────
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this student and all their tasks?')) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setTasks((prev) => prev.filter((t) => t.studentId !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete student.');
    }
  };

  const handleStudentSaved = (student, isEdit) => {
    if (isEdit) {
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, ...student } : s)));
    } else {
      setStudents((prev) => [student, ...prev]);
    }
    setShowStudentForm(false);
    setEditingStudent(null);
  };

  // ─── Task handlers ───────────────────────────────────────────────────────
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete task.');
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      const { data } = await api.put(`/tasks/${task.id}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update task status.');
    }
  };

  const handleTaskSaved = (task, isEdit) => {
    if (isEdit) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } else {
      setTasks((prev) => [task, ...prev]);
    }
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // ─── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  // ─── Stats ───────────────────────────────────────────────────────────────
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter((t) => t.status === 'PENDING').length;

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">🏫</div>
          School Management
        </div>
        <div className="navbar-right">
          <div className="navbar-admin">
            <div className="admin-dot" />
            {admin.email || 'Admin'}
          </div>
          <button id="logout-btn" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="dashboard-content">
        {/* Stats */}
        <div className="stats-row animate-fade-in">
          <div className="stat-card">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">{students.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{tasks.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completed</span>
            <span className="stat-value" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {completedTasks}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending</span>
            <span className="stat-value" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {pendingTasks}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            id="tab-students"
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👨‍🎓 Students
          </button>
          <button
            id="tab-tasks"
            className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            📋 Tasks
          </button>
        </div>

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">Students</h2>
              <button
                id="add-student-btn"
                className="btn btn-primary"
                onClick={() => {
                  setEditingStudent(null);
                  setShowStudentForm(true);
                }}
              >
                + Add Student
              </button>
            </div>

            {showStudentForm && (
              <StudentForm
                student={editingStudent}
                onSaved={handleStudentSaved}
                onCancel={() => { setShowStudentForm(false); setEditingStudent(null); }}
              />
            )}

            <StudentList
              students={students}
              loading={loadingStudents}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">Tasks</h2>
              <button
                id="add-task-btn"
                className="btn btn-primary"
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
              >
                + Assign Task
              </button>
            </div>

            {showTaskForm && (
              <TaskForm
                task={editingTask}
                students={students}
                onSaved={handleTaskSaved}
                onCancel={() => { setShowTaskForm(false); setEditingTask(null); }}
              />
            )}

            <TaskList
              tasks={tasks}
              loading={loadingTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        )}
      </main>
    </div>
  );
}
