const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/students
const getAll = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { tasks: true } },
      },
    });
    res.json(students);
  } catch (err) {
    console.error('getAll students error:', err);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
};

// POST /api/students
const create = async (req, res) => {
  try {
    const { name, class: studentClass } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Student name is required.' });
    }
    if (!studentClass || !studentClass.trim()) {
      return res.status(400).json({ error: 'Student class is required.' });
    }

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        class: studentClass.trim(),
      },
    });

    res.status(201).json(student);
  } catch (err) {
    console.error('create student error:', err);
    res.status(500).json({ error: 'Failed to create student.' });
  }
};

// PUT /api/students/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, class: studentClass } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Student name is required.' });
    }
    if (!studentClass || !studentClass.trim()) {
      return res.status(400).json({ error: 'Student class is required.' });
    }

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        name: name.trim(),
        class: studentClass.trim(),
      },
    });

    res.json(student);
  } catch (err) {
    console.error('update student error:', err);
    res.status(500).json({ error: 'Failed to update student.' });
  }
};

// DELETE /api/students/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Cascade delete handles associated tasks automatically
    await prisma.student.delete({ where: { id } });

    res.json({ message: 'Student and associated tasks deleted.' });
  } catch (err) {
    console.error('delete student error:', err);
    res.status(500).json({ error: 'Failed to delete student.' });
  }
};

module.exports = { getAll, create, update, remove };
