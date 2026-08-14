import Student from '../models/Student.js';
import FeeLedger from '../models/FeeLedger.js';
import Invoice from '../models/Invoice.js';

// Helper to generate Roll Number
const generateRollNumber = async () => {
  const count = await Student.countDocuments();
  const year = new Date().getFullYear();
  let candidate = `AG-${year}-ST${String(count + 1).padStart(3, '0')}`;
  let exists = await Student.findOne({ rollNumber: candidate });
  let attempts = 0;
  while (exists && attempts < 20) {
    attempts++;
    candidate = `AG-${year}-ST${String(count + 1 + attempts).padStart(3, '0')}`;
    exists = await Student.findOne({ rollNumber: candidate });
  }
  return candidate;
};

// Register Student & Generate Ledger & Invoices
export const registerStudent = async (req, res) => {
  const { name, email, batchId, courseName, totalPackageAmount, installments, admissionDate } = req.body;

  try {
    let studentEmail = undefined;
    if (email && typeof email === 'string' && email.trim() !== '') {
      const cleanEmail = email.trim();
      const studentExists = await Student.findOne({ email: cleanEmail });
      if (studentExists) {
        return res.status(400).json({ message: 'Student with this email already exists' });
      }
      studentEmail = cleanEmail;
    }

    const rollNumber = await generateRollNumber();

    // 1. Create Student
    const student = await Student.create({
      rollNumber: req.body.customId || rollNumber,
      name,
      email: studentEmail,
      batchId: batchId ? batchId.trim() : '',
      courseName,
      status: 'Active',
      isConfidentialFee: req.body.isConfidentialFee || false,
      dob: req.body.dob || '',
      admissionDate: admissionDate || req.body.admissionDate || new Date().toISOString().split('T')[0],
      phoneNumber: req.body.phoneNumber || '',
      fatherName: req.body.fatherName || '',
      motherName: req.body.motherName || '',
      parentsPhone: req.body.parentsPhone || '',
      address: req.body.address || '',
      qualification: req.body.qualification || '',
      profileImage: req.body.profileImage || null,
      idPhoto: req.body.idPhoto || null,
      sslcPhoto: req.body.sslcPhoto || null
    });

    // 2. Create Student Fees Ledger
    const ledger = await FeeLedger.create({
      studentId: student._id,
      totalPackageAmount: parseFloat(totalPackageAmount || 45000),
      amountPaid: 0,
      balanceDue: parseFloat(totalPackageAmount || 45000),
      paymentStatus: 'Unpaid'
    });

    // 3. Create Dynamic Invoices
    const createdInvoices = [];
    const baseCount = await Invoice.countDocuments();

    if (installments && installments.length > 0) {
      // Custom installments provided
      for (let i = 0; i < installments.length; i++) {
        const inst = installments[i];
        const timeSuffix = Date.now().toString().slice(-4);
        const invoiceNum = `INV-2026-${String(baseCount + i + 1).padStart(4, '0')}-${timeSuffix}${i+1}`;
        const invoice = await Invoice.create({
          invoiceNumber: invoiceNum,
          studentId: student._id,
          amount: inst.amount,
          dueDate: inst.dueDate,
          status: 'Pending',
          particulars: inst.particulars || `Installment ${i + 1} - Course Tuition Fee`
        });
        createdInvoices.push(invoice);
      }
    } else {
      // Single Course Tuition Fee scheduled invoice for the total Package Amount
      const timeSuffix = Date.now().toString().slice(-4);
      const invoiceNum = `INV-2026-${String(baseCount + 1).padStart(4, '0')}-${timeSuffix}1`;
      const invoice = await Invoice.create({
        invoiceNumber: invoiceNum,
        studentId: student._id,
        amount: parseFloat(totalPackageAmount || 45000),
        dueDate: admissionDate || req.body.admissionDate || new Date().toISOString().split('T')[0],
        status: 'Pending',
        particulars: 'Course Tuition Fee'
      });
      createdInvoices.push(invoice);
    }

    res.status(201).json({
      student,
      ledger,
      invoices: createdInvoices
    });
  } catch (error) {
    console.error("[Register Student Error]:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all students along with their ledger and invoices
export const getStudents = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role !== 'Super Admin') {
      query.isConfidentialFee = { $ne: true };
    }
    const students = await Student.find(query);
    const studentsWithLedger = [];

    for (const student of students) {
      let ledger = await FeeLedger.findOne({ studentId: student._id });
      const invoices = await Invoice.find({ studentId: student._id });
      
      const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
      const paidInvoiceIds = new Set(paidInvoices.map(i => String(i._id)));
      const paidInvoicesSum = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

      const standalonePaymentsSum = (student.payments || [])
        .filter(p => !p.invoiceId || !paidInvoiceIds.has(String(p.invoiceId)))
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const totalPaid = paidInvoicesSum + standalonePaymentsSum;
      const totalPkg = ledger ? ledger.totalPackageAmount : 45000;
      const balanceDue = Math.max(0, totalPkg - totalPaid);
      const paymentStatus = balanceDue === 0 && totalPkg > 0 ? 'Fully Paid' : totalPaid > 0 ? 'Partially Paid' : 'Unpaid';

      // Keep FeeLedger document synchronized with sum of payment logs
      if (ledger) {
        if (ledger.amountPaid !== totalPaid || ledger.balanceDue !== balanceDue || ledger.paymentStatus !== paymentStatus) {
          ledger.amountPaid = totalPaid;
          ledger.balanceDue = balanceDue;
          ledger.paymentStatus = paymentStatus;
          await ledger.save();
        }
      }

      const ledgerObj = {
        totalPackageAmount: totalPkg,
        amountPaid: totalPaid,
        balanceDue,
        paymentStatus
      };

      studentsWithLedger.push({
        ...student.toObject(),
        ledger: ledgerObj,
        invoices
      });
    }

    res.json(studentsWithLedger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Override / Adjust package amount or write-off outstanding debt
export const overrideLedger = async (req, res) => {
  const { studentId } = req.params;
  const { totalPackageAmount, newPackageAmount, amountPaid, balanceDue, writeOffAmount, discountAmount } = req.body;

  try {
    const studentIdStr = String(studentId);
    const studentIdObj = mongoose.Types.ObjectId.isValid(studentIdStr) ? new mongoose.Types.ObjectId(studentIdStr) : null;
    const queryIdFilter = studentIdObj ? { $in: [studentIdStr, studentIdObj] } : studentIdStr;

    let ledger = await FeeLedger.findOne({ studentId: queryIdFilter });
    if (!ledger) {
      ledger = await FeeLedger.create({
        studentId: studentIdObj || studentIdStr,
        totalPackageAmount: parseFloat(totalPackageAmount || newPackageAmount || 45000),
        amountPaid: parseFloat(amountPaid || 0),
        balanceDue: parseFloat(balanceDue || 45000),
        paymentStatus: 'Unpaid'
      });
    }

    if (totalPackageAmount !== undefined || newPackageAmount !== undefined) {
      ledger.totalPackageAmount = parseFloat(totalPackageAmount !== undefined ? totalPackageAmount : newPackageAmount);
    }

    if (discountAmount !== undefined) {
      ledger.totalPackageAmount -= parseFloat(discountAmount);
    }

    if (amountPaid !== undefined) {
      ledger.amountPaid = parseFloat(amountPaid);
    }

    if (balanceDue !== undefined) {
      ledger.balanceDue = parseFloat(balanceDue);
    } else if (writeOffAmount !== undefined) {
      ledger.balanceDue = Math.max(0, ledger.balanceDue - parseFloat(writeOffAmount));
    } else {
      ledger.balanceDue = Math.max(0, ledger.totalPackageAmount - ledger.amountPaid);
    }

    // Recalculate status
    if (ledger.balanceDue === 0 && ledger.totalPackageAmount > 0) {
      ledger.paymentStatus = 'Fully Paid';
    } else if (ledger.amountPaid > 0) {
      ledger.paymentStatus = 'Partially Paid';
    } else {
      ledger.paymentStatus = 'Unpaid';
    }

    await ledger.save();

    const student = await Student.findById(studentIdObj || studentIdStr);
    const invoices = await Invoice.find({ studentId: queryIdFilter });

    res.json({
      message: 'Student ledger updated successfully in MongoDB Atlas',
      student,
      ledger,
      invoices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Student Details & Confidential Visibility
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.body.isConfidentialFee !== undefined) {
      if (req.user && req.user.role === 'Super Admin') {
        student.isConfidentialFee = Boolean(req.body.isConfidentialFee);
      }
    }

    if (req.body.name) student.name = req.body.name;
    if (req.body.email) student.email = req.body.email;
    const studentPhone = req.body.phoneNumber !== undefined ? req.body.phoneNumber : (req.body.phone !== undefined ? req.body.phone : undefined);
    if (studentPhone !== undefined) student.phoneNumber = studentPhone;
    if (req.body.dob !== undefined) student.dob = req.body.dob;
    if (req.body.admissionDate !== undefined) student.admissionDate = req.body.admissionDate;
    if (req.body.address !== undefined) student.address = req.body.address;
    if (req.body.qualification !== undefined) student.qualification = req.body.qualification;
    if (req.body.fatherName !== undefined) student.fatherName = req.body.fatherName;
    if (req.body.motherName !== undefined) student.motherName = req.body.motherName;
    if (req.body.parentsPhone !== undefined) student.parentsPhone = req.body.parentsPhone;
    if (req.body.courseName) student.courseName = req.body.courseName;
    if (req.body.batchId) student.batchId = req.body.batchId;
    if (req.body.profileImage !== undefined) student.profileImage = req.body.profileImage;
    if (req.body.idPhoto !== undefined) student.idPhoto = req.body.idPhoto;
    if (req.body.sslcPhoto !== undefined) student.sslcPhoto = req.body.sslcPhoto;

    await student.save();

    let ledger = await FeeLedger.findOne({ studentId: student._id });
    const invoices = await Invoice.find({ studentId: student._id });

    res.json({
      ...student.toObject(),
      ledger,
      invoices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await Student.findByIdAndDelete(id);
    await FeeLedger.deleteMany({ studentId: id });
    await Invoice.deleteMany({ studentId: id });
    res.json({ message: 'Student and related records deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
