import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Model Imports (for seeding)
import User from './models/User.js';
import Student from './models/Student.js';
import FeeLedger from './models/FeeLedger.js';
import Invoice from './models/Invoice.js';
import Expense from './models/Expense.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '25mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Seed function
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    let employee = null;

    if (userCount === 0) {
      console.log('No users found. Seeding default accounts...');
      
      const superAdmin = await User.create({
        name: 'Director Jane',
        email: 'owner@academy.com',
        password: 'password123',
        role: 'Super Admin',
        department: 'Executive',
        designation: 'Academy Director',
        salary: 120000
      });

      const admin = await User.create({
        name: 'Coordinator Alex',
        email: 'finance@academy.com',
        password: 'password123',
        role: 'Admin',
        department: 'Finance & HR',
        designation: 'Accounts Manager',
        salary: 60000
      });

      employee = await User.create({
        name: 'Instructor Bob',
        email: 'faculty@academy.com',
        password: 'password123',
        role: 'Employee',
        department: 'Academic',
        designation: 'Lead Web Instructor',
        salary: 45000,
        teachingHours: 32
      });

      console.log('Seeded Users: owner@academy.com, finance@academy.com, faculty@academy.com');
    } else {
      employee = await User.findOne({ role: 'Employee' });
    }

    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      console.log('Seeding initial student records...');
      const student1 = await Student.create({
        rollNumber: 'AG-2026-ST001',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        batchId: 'BATCH-WEB-01',
        courseName: 'Full-Stack Web Development',
        status: 'Active'
      });

      await FeeLedger.create({
        studentId: student1._id,
        totalPackageAmount: 60000,
        amountPaid: 20000,
        balanceDue: 40000,
        paymentStatus: 'Partially Paid'
      });

      await Invoice.create({
        invoiceNumber: 'INV-2026-00001',
        studentId: student1._id,
        amount: 20000,
        dueDate: '2026-06-15',
        status: 'Paid',
        paymentMethod: 'Bank Transfer',
        paidOn: new Date('2026-06-14'),
        particulars: 'First Installment - Course Tuition Fee'
      });

      await Invoice.create({
        invoiceNumber: 'INV-2026-00002',
        studentId: student1._id,
        amount: 20000,
        dueDate: '2026-08-15',
        status: 'Pending',
        particulars: 'Second Installment - Course Tuition Fee'
      });

      await Invoice.create({
        invoiceNumber: 'INV-2026-00003',
        studentId: student1._id,
        amount: 20000,
        dueDate: '2026-10-15',
        status: 'Pending',
        particulars: 'Third Installment - Course Tuition Fee'
      });

      const student2 = await Student.create({
        rollNumber: 'AG-2026-ST002',
        name: 'Charlie Smith',
        email: 'charlie@example.com',
        batchId: 'BATCH-MOBILE-02',
        courseName: 'Mobile App Development',
        status: 'Active'
      });

      await FeeLedger.create({
        studentId: student2._id,
        totalPackageAmount: 50000,
        amountPaid: 0,
        balanceDue: 50000,
        paymentStatus: 'Unpaid'
      });

      await Invoice.create({
        invoiceNumber: 'INV-2026-00004',
        studentId: student2._id,
        amount: 25000,
        dueDate: '2026-07-20',
        status: 'Pending',
        particulars: 'First Installment - Mobile Course'
      });

      await Invoice.create({
        invoiceNumber: 'INV-2026-00005',
        studentId: student2._id,
        amount: 25000,
        dueDate: '2026-09-20',
        status: 'Pending',
        particulars: 'Second Installment - Mobile Course'
      });
    }

    const expenseCount = await Expense.countDocuments();
    if (expenseCount === 0 && employee) {
      await Expense.create({
        employeeId: employee._id,
        title: 'Whiteboard Markers & Stationary',
        amount: 1500,
        date: '2026-07-10',
        status: 'Approved',
        description: 'Supplies for Classroom 3B'
      });

      await Expense.create({
        employeeId: employee._id,
        title: 'Lab Router Replacement',
        amount: 5400,
        date: '2026-07-15',
        status: 'Pending',
        description: 'Replacement of faulty lab gateway'
      });
    }

    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Seeding error (handled gracefully):', err.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
  } catch (err) {
    console.log('Failed to connect to MongoDB, starting Express anyway. Server will work on mock data operations or retry connections.');
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
