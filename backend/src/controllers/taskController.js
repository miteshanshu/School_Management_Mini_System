const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/tasks
const getAll = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, name: true, class: true } },
      },
    });
    res.json(tasks);
  } catch (err) {
    console.error('getAll tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

// POST /api/tasks
const create = async (req, res) => {
  try {
    const { title, description, dueDate, studentId, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }
    if (!studentId) {
      return res.status(400).json({ error: 'Student is required.' });
    }

    // Verify student exists
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        studentId,
        status: status || 'PENDING',
      },
      include: {
        student: { select: { id: true, name: true, class: true } },
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('create task error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
};

// PUT /api/tasks/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, studentId, status } = req.body;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: 'Task title cannot be empty.' });
    }

    // If updating student, verify they exist
    if (studentId && studentId !== existing.studentId) {
      const student = await prisma.student.findUnique({ where: { id: studentId } });
      if (!student) {
        return res.status(404).json({ error: 'Student not found.' });
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description ? description.trim() : null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(studentId && { studentId }),
        ...(status && { status }),
      },
      include: {
        student: { select: { id: true, name: true, class: true } },
      },
    });

    res.json(task);
  } catch (err) {
    console.error('update task error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
};

// DELETE /api/tasks/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    await prisma.task.delete({ where: { id } });

    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};

module.exports = { getAll, create, update, remove };
