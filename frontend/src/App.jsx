import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import jsPDF from 'jspdf';
import logo from './assets/logo.png';
import logo2 from './assets/logo2.png';
import toast, { Toaster } from 'react-hot-toast';
import Auth from './components/Auth';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Shield, 
  UserCheck, 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserPlus, 
  Receipt, 
  CreditCard, 
  Calendar, 
  FileText, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building,
  BookOpen,
  Activity,
  Layers,
  Sparkles,
  Download,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Clock
} from 'lucide-react';

export default function App() {
  const { 
    currentUser, 
    logout, 
    students, 
    addStudent, 
    editStudent,
    deleteStudent,
    addInstallment,
    makePayment,
    markInvoicePaid, 
    overrideStudentLedger,
    employees, 
    addEmployee, 
    updateEmployeeHRRecord,
    deleteEmployee,
    expenses, 
    fileExpenseClaim, 
    editExpenseClaim,
    deleteExpenseClaim,
    reviewExpense,
    courses,
    addCourse,
    editCourse,
    deleteCourse,
    extraIncomes,
    addExtraIncome,
    editPayment,
    getStats 
  } = useApp();

  const visibleStudents = currentUser?.role === 'Super Admin' ? students : students.filter(s => !s.isConfidentialFee);

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isHRModalOpen, setIsHRModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isStudentProfileModalOpen, setIsStudentProfileModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState(null);

  // Image Cropping States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [cropAspect, setCropAspect] = useState(1);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 });
  const [onCropConfirm, setOnCropConfirm] = useState(null);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStartCrop, setDragStartCrop] = useState({ x: 0, y: 0 });

  // Lightbox View & Download States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [lightboxFilename, setLightboxFilename] = useState('');

  const handleOpenLightbox = (src, filename) => {
    setLightboxSrc(src);
    setLightboxFilename(filename);
    setLightboxOpen(true);
  };

  // Specific modal contexts
  const [paymentModalData, setPaymentModalData] = useState(null); // { studentId, invoiceId, invoiceNumber, amount }
  const [viewingStudent, setViewingStudent] = useState(null);
  const [activeStudentDetailMode, setActiveStudentDetailMode] = useState('view'); // 'view', 'edit', 'register'
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [isRegisteringStudent, setIsRegisteringStudent] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState('view'); // 'view', 'edit', 'addInstallment'
  const [editingStudentForm, setEditingStudentForm] = useState(null);
  const [newInstallmentForm, setNewInstallmentForm] = useState({ amount: '', description: '', dueDate: '', method: 'Cash', upiScreenshot: null });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardMonth, setDashboardMonth] = useState('All');
  const [paymentSortOrder, setPaymentSortOrder] = useState('desc');
  const [paymentStartDate, setPaymentStartDate] = useState('');
  const [paymentEndDate, setPaymentEndDate] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [feeCollectionSort, setFeeCollectionSort] = useState('date-desc');
  const [feeCollectionSearch, setFeeCollectionSearch] = useState('');
  const [feeCollectionDate, setFeeCollectionDate] = useState('');
  const [feeCollectionViewMode, setFeeCollectionViewMode] = useState('grid');

  // Rich Course Hub States
  const [isCourseFormModalOpen, setIsCourseFormModalOpen] = useState(false);
  const [courseFormMode, setCourseFormMode] = useState('add');
  const [editingCourseObj, setEditingCourseObj] = useState(null);
  const [courseForm, setCourseForm] = useState({ name: '', duration: '6 Months', fee: '', details: '' });

  // Center Expense Claims Filtering, Sorting & Editing States
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseStatusFilter, setExpenseStatusFilter] = useState('All'); // 'All', 'Pending', 'Approved', 'Rejected'
  const [expenseFromDate, setExpenseFromDate] = useState('');
  const [expenseToDate, setExpenseToDate] = useState('');
  const [expenseSortBy, setExpenseSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc', 'title'

  const [isExpenseEditModalOpen, setIsExpenseEditModalOpen] = useState(false);
  const [editingExpenseObj, setEditingExpenseObj] = useState(null);
  const [expenseEditForm, setExpenseEditForm] = useState({ title: '', amount: '', date: '', status: 'Pending', description: '' });

  const [isExpenseDeleteModalOpen, setIsExpenseDeleteModalOpen] = useState(false);
  const [deletingExpenseObj, setDeletingExpenseObj] = useState(null);

  // Input states
  const [studentForm, setStudentForm] = useState({ 
    name: '', email: '', dob: '', customId: '', address: '', qualification: '', phoneNumber: '', profileImage: null, 
    fatherName: '', motherName: '', parentsPhone: '', idPhoto: null, sslcPhoto: null,
    fatherPhone: '', motherPhone: '', // Compatibility helper
    courseName: '', batchId: '', totalPackageAmount: 45000, installmentCount: 3 
  });
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '', role: 'Employee', department: 'Academic', designation: 'Instructor', salary: 40000, username: '', password: '', phoneNumber: '', address: '', qualification: '', profileImage: null });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [hrForm, setHrForm] = useState({ employeeId: '', name: '', email: '', role: 'Employee', department: 'Academic', designation: '', salary: '', username: '', password: '', phoneNumber: '', address: '', qualification: '', profileImage: null });
  const [overrideForm, setOverrideForm] = useState({ amount: '', source: 'EMI Interest', date: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', details: '' });
  
  // Modals / active selectors
  const [selectedStudent, setSelectedStudent] = useState(null);

  const stats = getStats();

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email) return;
    const submissionData = {
      ...studentForm,
      isConfidentialFee: currentUser?.role === 'Super Admin' ? Boolean(studentForm.isConfidentialFee) : false
    };

    const res = await addStudent(submissionData);
    if (res && res.error) {
      toast.error(res.error);
      return;
    }

    setStudentForm({ name: '', email: '', dob: '', customId: '', address: '', qualification: '', phoneNumber: '', profileImage: null, fatherName: '', motherName: '', parentsPhone: '', idPhoto: null, sslcPhoto: null, courseName: '', batchId: '', totalPackageAmount: 45000, installmentCount: 3, isConfidentialFee: false });
    setIsStudentModalOpen(false);
    toast.success("Student registered successfully! Invoices generated.");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast.error("File is too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentForm({ ...studentForm, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error("File is too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingStudentForm({ ...editingStudentForm, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (!employeeForm.name || !employeeForm.email) return;
    const res = await addEmployee(employeeForm);
    if (res && res.error) {
      toast.error(res.error);
      return;
    }
    setEmployeeForm({ name: '', email: '', role: 'Employee', department: 'Academic', designation: 'Instructor', salary: 40000, username: '', password: '', phoneNumber: '', address: '', qualification: '', profileImage: null });
    setIsEmployeeModalOpen(false);
    toast.success("Employee record created!");
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    fileExpenseClaim(expenseForm);
    setExpenseForm({ title: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    setIsExpenseModalOpen(false);
    toast.success("Expense claim filed for approval.");
  };

  const handleOpenEditExpenseModal = (exp) => {
    setEditingExpenseObj(exp);
    setExpenseEditForm({
      title: exp.title || '',
      amount: exp.amount || '',
      date: exp.date || new Date().toISOString().split('T')[0],
      status: exp.status || 'Pending',
      description: exp.description || ''
    });
    setIsExpenseEditModalOpen(true);
  };

  const handleExpenseEditSubmit = (e) => {
    e.preventDefault();
    if (!editingExpenseObj || !expenseEditForm.title || !expenseEditForm.amount) return;
    editExpenseClaim(editingExpenseObj._id, expenseEditForm);
    setIsExpenseEditModalOpen(false);
    setEditingExpenseObj(null);
    toast.success("Expense claim updated successfully!");
  };

  const handleOpenDeleteExpenseModal = (exp) => {
    setDeletingExpenseObj(exp);
    setIsExpenseDeleteModalOpen(true);
  };

  const handleConfirmDeleteExpense = () => {
    if (!deletingExpenseObj) return;
    deleteExpenseClaim(deletingExpenseObj._id);
    setIsExpenseDeleteModalOpen(false);
    setDeletingExpenseObj(null);
    toast.success("Expense claim deleted successfully!");
  };

  const clearExpenseFilters = () => {
    setExpenseSearch('');
    setExpenseStatusFilter('All');
    setExpenseFromDate('');
    setExpenseToDate('');
    setExpenseSortBy('date-desc');
    toast.success("Expense filters cleared.");
  };

  const generateExpensePDF = async (expensesList, fromDate, toDate) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const logoDataUrl = await getLogoDataUrl();
    
    // Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 42, 'F');
    
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', 15, 8, 38, 16);
      } catch (e) {
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("SPRINGS ACADEMY", 15, 18);
      }
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("SPRINGS ACADEMY", 15, 18);
    }
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("Center Operational Expense Claims Audit Report", 15, 28);
    
    const dateRangeStr = (fromDate || toDate) ? `Period: ${fromDate || 'Beginning'} to ${toDate || 'Present'}` : 'Period: All Time';
    doc.text(`${dateRangeStr}  |  Generated: ${new Date().toLocaleDateString()}`, 15, 34);

    // Summary Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 48, 180, 20, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, 48, 180, 20, 2, 2, 'S');

    const totalCount = expensesList.length;
    const totalAmount = expensesList.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const avgAmount = totalCount ? Math.round(totalAmount / totalCount) : 0;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Total Expenses: ${totalCount}`, 20, 60);
    doc.text(`Total Amount: Rs. ${totalAmount.toLocaleString()}`, 75, 60);
    doc.text(`Average Expense: Rs. ${avgAmount.toLocaleString()}`, 135, 60);

    // Table Header
    let startY = 78;
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(15, startY - 5, 180, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    
    doc.text("Date", 18, startY);
    doc.text("Expense Title & Particulars", 45, startY);
    doc.text("Logged By", 125, startY);
    doc.text("Amount (Rs.)", 175, startY);
    
    let currentY = startY + 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    
    expensesList.forEach((exp, idx) => {
      if (currentY > 275) {
        doc.addPage();
        currentY = 20;
        doc.setFillColor(30, 41, 59);
        doc.rect(15, currentY - 5, 180, 8, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text("Date", 18, currentY);
        doc.text("Expense Title & Particulars", 45, currentY);
        doc.text("Logged By", 125, currentY);
        doc.text("Amount (Rs.)", 175, currentY);
        currentY += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
      }

      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, currentY - 4, 180, 10, 'F');
      }

      doc.setTextColor(51, 65, 85);
      doc.text(exp.date || 'N/A', 18, currentY);
      
      const cleanTitle = (exp.title || '').length > 40 ? (exp.title || '').substring(0, 37) + '...' : exp.title;
      doc.setFont("helvetica", "bold");
      doc.text(cleanTitle || 'Untitled Expense', 45, currentY);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      const claimedByName = exp.employeeId?.name || 'Staff';
      const dept = exp.employeeId?.department ? `(${exp.employeeId.department})` : '';
      doc.text(`${claimedByName} ${dept}`.substring(0, 24), 125, currentY);

      doc.setTextColor(15, 23, 42);
      doc.text((exp.amount || 0).toLocaleString(), 175, currentY);

      doc.setDrawColor(241, 245, 249);
      doc.line(15, currentY + 4, 195, currentY + 4);

      currentY += 10;
    });

    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFillColor(241, 245, 249);
    doc.rect(15, currentY - 2, 180, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("GRAND TOTAL", 45, currentY + 4);
    doc.text(`Rs. ${totalAmount.toLocaleString()}`, 175, currentY + 4);

    doc.save(`Center_Expense_Claims_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Center Expense Claims PDF report downloaded!");
  };

  const handleHRUpdateSubmit = (e) => {
    e.preventDefault();
    if (!hrForm.employeeId) return;
    updateEmployeeHRRecord(hrForm.employeeId, hrForm);
    setHrForm({ employeeId: '', name: '', email: '', role: 'Employee', department: 'Academic', designation: '', salary: '', username: '', password: '', phoneNumber: '', address: '', qualification: '', profileImage: null });
    setIsHRModalOpen(false);
    toast.success("Employee record updated successfully!");
  };

  const handleOverrideSubmit = (e) => {
    e.preventDefault();
    if (!overrideForm.amount) return;
    addExtraIncome(overrideForm);
    setOverrideForm({ amount: '', source: 'EMI Interest', date: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', details: '' });
    setIsOverrideModalOpen(false);
    toast.success("Extra income recorded successfully!");
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.fee) return;
    if (courseFormMode === 'add') {
      const res = await addCourse(courseForm);
      if (res && res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Course added successfully!");
    } else if (courseFormMode === 'edit' && editingCourseObj) {
      await editCourse(editingCourseObj._id, courseForm);
      toast.success("Course details updated successfully!");
    }
    setCourseForm({ name: '', duration: '6 Months', fee: '', details: '' });
    setEditingCourseObj(null);
    setIsCourseFormModalOpen(false);
  };

  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [editingPaymentData, setEditingPaymentData] = useState(null);

  const openEditPaymentModal = (student, payment) => {
    if (!student || !payment) return;
    setEditingPaymentData({
      studentId: student._id,
      paymentId: payment._id,
      studentName: student.name,
      receiptNumber: payment.receiptNumber || 'REC-001',
      amount: payment.amount,
      date: payment.date || new Date().toISOString().split('T')[0],
      paymentMethod: payment.paymentMethod || 'Cash'
    });
    setIsEditPaymentModalOpen(true);
  };

  const handleEditPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!editingPaymentData || !editingPaymentData.studentId || !editingPaymentData.paymentId) return;
    if (parseFloat(editingPaymentData.amount) <= 0) {
      toast.error("Payment amount must be greater than 0.");
      return;
    }
    await editPayment(editingPaymentData.studentId, editingPaymentData.paymentId, editingPaymentData);
    setIsEditPaymentModalOpen(false);
    toast.success("Payment details corrected & ledger updated!");
  };

  const generateStudentDirectoryPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const logoDataUrl = await getLogoDataUrl();
    
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', 15, 6, 38, 16);
      } catch (e) {
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("SPRINGS ACADEMY", 15, 18);
      }
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("SPRINGS ACADEMY", 15, 18);
    }
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("Student Admissions Registry Directory Report", 15, 27);
    doc.text(`Generated: ${new Date().toLocaleDateString()}  |  Total Students: ${visibleStudents.length}`, 15, 33);

    let startY = 50;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    
    doc.text("Roll Number", 15, startY);
    doc.text("Student Name", 45, startY);
    doc.text("Course Name", 95, startY);
    doc.text("Phone", 145, startY);
    doc.text("Balance Due", 175, startY);
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(15, startY + 2, 195, startY + 2);
    
    let currentY = startY + 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    
    visibleStudents.forEach((student) => {
      if (currentY > 280) {
        doc.addPage();
        currentY = 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        doc.text("Roll Number", 15, currentY);
        doc.text("Student Name", 45, currentY);
        doc.text("Course Name", 95, currentY);
        doc.text("Phone", 145, currentY);
        doc.text("Balance Due", 175, currentY);
        doc.line(15, currentY + 2, 195, currentY + 2);
        currentY += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
      }
      
      doc.text(student.rollNumber, 15, currentY);
      doc.text(student.name, 45, currentY);
      doc.text(student.courseName, 95, currentY);
      doc.text(student.phoneNumber || 'N/A', 145, currentY);
      doc.text(`INR ${student.ledger.balanceDue.toLocaleString()}`, 175, currentY);
      
      doc.setDrawColor(241, 245, 249);
      doc.line(15, currentY + 3, 195, currentY + 3);
      
      currentY += 8;
    });
    
    doc.save("Student_Admissions_Directory.pdf");
    toast.success("Student directory PDF downloaded successfully!");
  };

  const generatePaymentActivityPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const logoDataUrl = await getLogoDataUrl();
    
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', 15, 6, 38, 16);
      } catch (e) {
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("SPRINGS ACADEMY", 15, 18);
      }
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("SPRINGS ACADEMY", 15, 18);
    }
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("Payment Activity Feed & Transaction Ledger Report", 15, 27);
    doc.text(`Generated: ${new Date().toLocaleDateString()}  |  Total Transactions: ${allPayments.length}`, 15, 33);
    
    let startY = 50;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    
    doc.text("Date", 15, startY);
    doc.text("Student Name", 40, startY);
    doc.text("Receipt Number", 90, startY);
    doc.text("Method", 145, startY);
    doc.text("Amount", 175, startY);
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(15, startY + 2, 195, startY + 2);
    
    let currentY = startY + 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    
    const sortedPaymentsReport = [...allPayments].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return paymentSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    sortedPaymentsReport.forEach((pay) => {
      if (currentY > 280) {
        doc.addPage();
        currentY = 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        doc.text("Date", 15, currentY);
        doc.text("Student Name", 40, currentY);
        doc.text("Receipt Number", 90, currentY);
        doc.text("Method", 145, currentY);
        doc.text("Amount", 175, currentY);
        doc.line(15, currentY + 2, 195, currentY + 2);
        currentY += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
      }
      
      doc.text(pay.date || 'N/A', 15, currentY);
      doc.text(pay.studentName || 'N/A', 40, currentY);
      doc.text(pay.receiptNumber || 'N/A', 90, currentY);
      doc.text(pay.paymentMethod || 'N/A', 145, currentY);
      doc.text(pay.amount.toLocaleString(), 175, currentY);
      
      doc.setDrawColor(241, 245, 249);
      doc.line(15, currentY + 3, 195, currentY + 3);
      
      currentY += 8;
    });
    
    doc.save("Payment_Activity_Feed.pdf");
    toast.success("Payment activity report downloaded successfully!");
  };

  const generateFeeCollectionTerminalPDF = async (feeStudentsList) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const logoDataUrl = await getLogoDataUrl();
    
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', 15, 6, 38, 16);
      } catch (e) {
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("SPRINGS ACADEMY", 15, 18);
      }
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("SPRINGS ACADEMY", 15, 18);
    }
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("Fee Collection Terminal - Student Ledger & Outstanding Status", 15, 27);
    doc.text(`Generated: ${new Date().toLocaleDateString()}  |  Total Records: ${(feeStudentsList || []).length}`, 15, 33);
    
    let startY = 50;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    
    doc.text("Roll Number", 15, startY);
    doc.text("Student Name", 45, startY);
    doc.text("Course", 95, startY);
    doc.text("Pkg (INR)", 135, startY);
    doc.text("Paid (INR)", 160, startY);
    doc.text("Due (INR)", 185, startY);
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(15, startY + 2, 195, startY + 2);
    
    let currentY = startY + 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    
    (feeStudentsList || []).forEach((student) => {
      if (currentY > 280) {
        doc.addPage();
        currentY = 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        doc.text("Roll Number", 15, currentY);
        doc.text("Student Name", 45, currentY);
        doc.text("Course", 95, currentY);
        doc.text("Pkg (INR)", 135, currentY);
        doc.text("Paid (INR)", 160, currentY);
        doc.text("Due (INR)", 185, currentY);
        doc.line(15, currentY + 2, 195, currentY + 2);
        currentY += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
      }
      
      const pkg = student.ledger?.totalPackageAmount || 0;
      const paid = student.ledger?.amountPaid || 0;
      const due = student.ledger?.balanceDue || 0;

      doc.text(student.rollNumber || 'N/A', 15, currentY);
      doc.text(student.name || 'N/A', 45, currentY);
      doc.text(student.courseName || 'N/A', 95, currentY);
      doc.text(pkg.toLocaleString(), 135, currentY);
      doc.text(paid.toLocaleString(), 160, currentY);
      doc.text(due.toLocaleString(), 185, currentY);
      
      doc.setDrawColor(241, 245, 249);
      doc.line(15, currentY + 3, 195, currentY + 3);
      
      currentY += 8;
    });
    
    doc.save("Fee_Collection_Terminal_Report.pdf");
    toast.success("Fee Collection Terminal PDF downloaded successfully!");
  };

  const handleFileChangeForCrop = (e, aspect, callback) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error("File is too large. Please select an image under 5MB.");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImageSrc(reader.result);
        setCropAspect(aspect);
        setCropZoom(1);
        setCropPan({ x: 0, y: 0 });
        setOnCropConfirm(() => callback);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handlePerformCrop = () => {
    const imgElement = new Image();
    imgElement.src = cropImageSrc;
    imgElement.onload = () => {
      const canvas = document.createElement('canvas');

      let cropW = 160;
      let cropH = 160;
      let outWidth = 400;
      let outHeight = 400;

      if (Math.abs(cropAspect - 4/3) < 0.05) {
        cropW = 200; cropH = 150; outWidth = 600; outHeight = 450;
      } else if (Math.abs(cropAspect - 3/4) < 0.05) {
        cropW = 135; cropH = 180; outWidth = 450; outHeight = 600;
      } else if (Math.abs(cropAspect - 16/9) < 0.05) {
        cropW = 220; cropH = 124; outWidth = 640; outHeight = 360;
      }

      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext('2d');

      const viewWidth = 320;
      const viewHeight = 256;

      const imgW = imgElement.naturalWidth;
      const imgH = imgElement.naturalHeight;

      const scaleFit = Math.min(viewWidth / imgW, viewHeight / imgH);
      const fitW = imgW * scaleFit;
      const fitH = imgH * scaleFit;

      const fitX = (viewWidth - fitW) / 2;
      const fitY = (viewHeight - fitH) / 2;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = viewWidth;
      tempCanvas.height = viewHeight;
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCtx.fillStyle = '#0f172a';
      tempCtx.fillRect(0, 0, viewWidth, viewHeight);

      const drawW = fitW * cropZoom;
      const drawH = fitH * cropZoom;
      const drawX = fitX + cropPan.x - (drawW - fitW) / 2;
      const drawY = fitY + cropPan.y - (drawH - fitH) / 2;
      
      tempCtx.drawImage(imgElement, drawX, drawY, drawW, drawH);

      const cropX = (viewWidth - cropW) / 2;
      const cropY = (viewHeight - cropH) / 2;

      ctx.drawImage(
        tempCanvas,
        cropX, cropY, cropW, cropH,
        0, 0, outWidth, outHeight
      );

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9);
      if (onCropConfirm) {
        onCropConfirm(croppedBase64);
      }
      setCropModalOpen(false);
      setCropImageSrc('');
    };
  };

  const handleLogPaymentSubmit = (e) => {
    e.preventDefault();
    const payMethod = e.target.payMethod.value;
    if (payMethod && paymentModalData) {
      markInvoicePaid(paymentModalData.studentId, paymentModalData.invoiceId, payMethod);
      setIsPaymentModalOpen(false);
      setPaymentModalData(null);
    }
  };

  let cachedLogoDataUrl = null;
  const getLogoDataUrl = () => {
    return new Promise((resolve) => {
      if (cachedLogoDataUrl) {
        return resolve(cachedLogoDataUrl);
      }
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          cachedLogoDataUrl = dataUrl;
          resolve(dataUrl);
        } catch (err) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = logo;
    });
  };

  let cachedLogo2DataUrl = null;
  const getLogo2DataUrl = () => {
    return new Promise((resolve) => {
      if (cachedLogo2DataUrl) {
        return resolve(cachedLogo2DataUrl);
      }
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          cachedLogo2DataUrl = dataUrl;
          resolve(dataUrl);
        } catch (err) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = logo2;
    });
  };

  const generatePDFInvoice = async (student, payment) => {
    if (!student || !payment) return;

    const doc = new jsPDF('p', 'mm', 'a4');
    const logo2DataUrl = await getLogo2DataUrl();

    // Color palette constants
    const primaryDark = [15, 23, 42];    // Slate 900
    const primaryBlue = [2, 132, 199];   // Sky 600
    const textDark = [30, 41, 59];       // Slate 800
    const textMuted = [100, 116, 139];   // Slate 500
    const bgLight = [248, 250, 252];     // Slate 50
    const borderColor = [226, 232, 240]; // Slate 200

    // Header section: Logo & Title
    if (logo2DataUrl) {
      try {
        doc.addImage(logo2DataUrl, 'PNG', 15, 10, 43, 20);
      } catch (e) {
        console.warn("PDF Image rendering error:", e);
      }
    }

    // Right Side: Receipt Title & Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...primaryBlue);
    doc.text("PAYMENT RECEIPT", 195, 18, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...textDark);
    doc.text(`RECEIPT NO: ${payment.receiptNumber || 'REC-001'}`, 195, 24, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...textMuted);
    doc.text(`DATE: ${payment.date || new Date().toISOString().split('T')[0]}`, 195, 29, { align: "right" });

    // PAID Badge
    doc.setFillColor(220, 252, 231);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(165, 32, 30, 7, 1.5, 1.5, 'FD');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(21, 128, 61);
    doc.text("PAID", 180, 36.8, { align: "center" });

    // Accent Separator Line
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.line(15, 42, 195, 42);

    // Student & Course Cards (Side-by-Side)
    doc.setFillColor(...bgLight);
    doc.setDrawColor(...borderColor);
    doc.roundedRect(15, 47, 87, 31, 2, 2, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text("BILLED TO", 19, 53);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryDark);
    doc.text(student.name || 'N/A', 19, 59);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...textDark);
    doc.text(`Roll Number: ${student.rollNumber || 'N/A'}`, 19, 64.5);
    doc.text(`Phone: ${student.phoneNumber || 'N/A'}`, 19, 69.5);
    doc.text(`Email: ${student.email || 'N/A'}`, 19, 74.5);

    doc.setFillColor(...bgLight);
    doc.setDrawColor(...borderColor);
    doc.roundedRect(108, 47, 87, 31, 2, 2, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text("ENROLLMENT & COURSE", 112, 53);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryDark);
    doc.text(student.courseName || 'N/A', 112, 59);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...textDark);
    doc.text(`Batch ID: ${student.batchId || 'N/A'}`, 112, 64.5);
    doc.text(`Status: ${student.status || 'Active'}`, 112, 69.5);

    // Itemized Table Header
    doc.setFillColor(...primaryDark);
    doc.rect(15, 84, 180, 8, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text("ITEM DESCRIPTION", 20, 89.2);
    doc.text("PAYMENT METHOD", 108, 89.2);
    doc.text("DATE", 145, 89.2);
    doc.text("AMOUNT PAID", 190, 89.2, { align: "right" });

    // Table Data Row
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...borderColor);
    doc.rect(15, 92, 180, 13, 'D');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primaryDark);
    doc.text("Tuition Fee Installment Payment", 20, 98);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text(`Receipt Reference: ${payment.receiptNumber || 'N/A'}`, 20, 102);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...textDark);
    doc.text(payment.paymentMethod || 'Cash', 108, 99);
    doc.text(payment.date || 'N/A', 145, 99);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...primaryDark);
    doc.text(`${(payment.amount || 0).toLocaleString()}`, 190, 99, { align: "right" });

    // Financial Summary Panel
    const totalPkg = student.ledger?.totalPackageAmount || 0;
    const paidAmt = student.ledger?.amountPaid || 0;
    const balanceDue = student.ledger?.balanceDue || 0;

    doc.setFillColor(...bgLight);
    doc.setDrawColor(...borderColor);
    doc.roundedRect(108, 111, 87, 34, 2, 2, 'FD');

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...textMuted);
    doc.text("Total Course Package:", 112, 117);
    doc.setTextColor(...textDark);
    doc.text(`${totalPkg.toLocaleString()}`, 190, 117, { align: "right" });

    doc.setTextColor(...textMuted);
    doc.text("Total Paid to Date:", 112, 122.5);
    doc.setTextColor(22, 163, 74);
    doc.text(`${paidAmt.toLocaleString()}`, 190, 122.5, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textDark);
    doc.text("Amount Paid (This Receipt):", 112, 128);
    doc.setTextColor(...primaryBlue);
    doc.text(`${(payment.amount || 0).toLocaleString()}`, 190, 128, { align: "right" });

    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.line(112, 132, 191, 132);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...textDark);
    doc.text("Balance Remaining:", 112, 138);

    if (balanceDue > 0) {
      doc.setTextColor(220, 38, 38);
    } else {
      doc.setTextColor(22, 163, 74);
    }
    doc.text(`${balanceDue.toLocaleString()}`, 190, 138, { align: "right" });

    // Terms & Conditions + Authorized Signatory
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text("TERMS & CONDITIONS", 15, 155);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("1. Fees once paid are non-refundable and non-transferable under any circumstances.", 15, 160);
    doc.text("2. Please preserve this computer-generated receipt for institutional audit and hall ticket issuance.", 15, 164.5);
    doc.text("3. For financial queries or assistance, contact Accounts Wing at info@springsacademy.com", 15, 169);

    // Signatory Area
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(140, 172, 195, 172);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...textDark);
    doc.text("Authorized Signatory", 167.5, 177, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text("Springs Academy Finance Wing", 167.5, 181, { align: "center" });

    // Page Footer
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.line(15, 275, 195, 275);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Springs Academy • Technical & Commercial Education • www.springsacademy.com", 105, 281, { align: "center" });

    // Save File
    doc.save(`${(student.name || 'Student').replace(/\s+/g, '_')}_Receipt_${payment.receiptNumber || '001'}.pdf`);
    toast.success("Payment receipt PDF downloaded!");
  };

  const allPayments = students.reduce((acc, student) => {
    if (currentUser?.role !== 'Super Admin' && student.isConfidentialFee) {
      return acc;
    }

    const paidInvoiceLogs = (student.invoices || [])
      .filter(inv => inv.status === 'Paid')
      .map(inv => ({
        _id: inv._id,
        amount: inv.amount,
        date: inv.paidOn ? String(inv.paidOn).split('T')[0] : inv.dueDate,
        paymentMethod: inv.paymentMethod || 'Cash',
        receiptNumber: inv.invoiceNumber || 'INV-REC',
        particulars: inv.particulars || 'Tuition Fee Payment',
        studentName: student.name,
        studentRoll: student.rollNumber,
        studentImage: student.profileImage,
        studentObj: student
      }));

    const manualPaymentLogs = (student.payments || []).map(pay => ({
      ...pay,
      studentName: student.name,
      studentRoll: student.rollNumber,
      studentImage: student.profileImage,
      studentObj: student
    }));

    const combined = [...paidInvoiceLogs, ...manualPaymentLogs];
    const uniqueMap = new Map();
    combined.forEach(p => uniqueMap.set(p._id, p));

    return [...acc, ...Array.from(uniqueMap.values())];
  }, []).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Toaster position="top-right" />
      
      {/* Top Banner */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 shadow-sm bg-white">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div>
            <img src={theme === 'light' ? logo2 : logo} alt="Springs Academy" className="h-15 object-contain" />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer border border-transparent hover:border-rose-500/20"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Active User Header */}
      <div className="bg-slate-900/40 border-b border-slate-800/60 px-8 py-3.5 flex flex-wrap justify-between items-center text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <UserCheck className="w-4 h-4 text-blue-400" />
          <span>Logged in as: <strong>{currentUser.name}</strong> ({currentUser.username})</span>
          <span className="text-slate-600">|</span>
          <span>Dept: {currentUser.department}</span>
          <span className="text-slate-600">|</span>
          <span>Designation: {currentUser.designation}</span>
        </div>
        <div className="text-slate-400">
          System Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside 
          onClick={() => {
            setIsSidebarCollapsed(prev => !prev);
          }}
          className={`transition-all duration-300 ease-in-out w-full md:flex flex-col gap-1.5 border-r border-slate-900/50 bg-slate-900/10 ${
            isSidebarCollapsed ? 'md:w-20 p-4 cursor-pointer' : 'md:w-64 p-6'
          }`}
        >
          <button
            onClick={(e) => {
              if (!isSidebarCollapsed) e.stopPropagation();
              setActiveTab('dashboard');
            }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600/10 text-blue-300 border border-blue-500/20'
                : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
            }`}
            title="Control Dashboard"
          >
            <Activity className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Control Dashboard</span>}
          </button>

          {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && (
            <>
              <button
                onClick={(e) => {
                  if (!isSidebarCollapsed) e.stopPropagation();
                  setActiveTab('students');
                }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'students'
                    ? 'bg-blue-600/10 text-blue-300 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
                title="Student Admissions"
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span>Student Admissions</span>}
              </button>

              <button
                onClick={(e) => {
                  if (!isSidebarCollapsed) e.stopPropagation();
                  setActiveTab('invoices');
                }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'bg-blue-600/10 text-blue-300 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
                title="Invoices & Payments"
              >
                <Receipt className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span>Invoices & Payments</span>}
              </button>

              <button
                onClick={(e) => {
                  if (!isSidebarCollapsed) e.stopPropagation();
                  setActiveTab('fee-collection');
                }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'fee-collection'
                    ? 'bg-blue-600/10 text-blue-300 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
                title="Fee Collection"
              >
                <DollarSign className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span>Fee Collection</span>}
              </button>

              {currentUser.role === 'Super Admin' && (
                <button
                  onClick={(e) => {
                    if (!isSidebarCollapsed) e.stopPropagation();
                    setActiveTab('office');
                  }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === 'office'
                      ? 'bg-blue-600/10 text-blue-300 border border-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
                  title="Office & HR Manager"
                >
                  <Building className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>Office & HR Manager</span>}
                </button>
              )}

              <button
                onClick={(e) => {
                  if (!isSidebarCollapsed) e.stopPropagation();
                  setActiveTab('courses');
                }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'courses'
                    ? 'bg-violet-600/10 text-violet-300 border border-violet-500/20'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
                title="Courses Hub"
              >
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span>Courses Hub</span>}
              </button>
            </>
          )}

          {currentUser.role === 'Employee' && (
            <>
              <button
                onClick={(e) => {
                  if (!isSidebarCollapsed) e.stopPropagation();
                  setActiveTab('employee-payouts');
                }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'employee-payouts'
                    ? 'bg-blue-600/10 text-blue-300 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
                title="My Financials & Slips"
              >
                <DollarSign className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span>My Financials & Slips</span>}
              </button>
              <button
                onClick={(e) => {
                  if (!isSidebarCollapsed) e.stopPropagation();
                  setActiveTab('claims');
                }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'claims'
                    ? 'bg-blue-600/10 text-blue-300 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
                title="Expense Claims"
              >
                <FileText className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span>Expense Claims</span>}
              </button>
            </>
          )}

        </aside>

        {/* Main Console Content */}
        <main 
          onClick={() => {
            if (!isSidebarCollapsed) {
              setIsSidebarCollapsed(true);
            }
          }}
          className="flex-1 p-6 lg:p-8 overflow-y-auto"
        >
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (() => {
            // Live payment array flatmap
            const allPaymentsRaw = visibleStudents.flatMap(s => {
              const paidInvoices = (s.invoices || [])
                .filter(inv => inv.status === 'Paid')
                .map(inv => ({
                  _id: inv._id,
                  amount: inv.amount,
                  date: inv.paidOn ? String(inv.paidOn).split('T')[0] : inv.dueDate,
                  paymentMethod: inv.paymentMethod || 'Cash',
                  receiptNumber: inv.invoiceNumber || 'INV-REC',
                  particulars: inv.particulars || 'Tuition Fee Payment',
                  studentName: s.name,
                  studentImage: s.profileImage,
                  courseName: s.courseName,
                  studentObj: s
                }));

              const manual = (s.payments || []).map(p => ({
                ...p,
                studentName: s.name,
                studentImage: s.profileImage,
                courseName: s.courseName,
                studentObj: s
              }));

              return [...paidInvoices, ...manual];
            }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

            // Monthly dropdown options
            const availableMonths = Array.from(new Set(
              allPaymentsRaw.map(p => p.date ? p.date.substring(0, 7) : null).filter(Boolean)
            )).sort().reverse();

            // Filtered payments by selected month
            const filteredPayments = allPaymentsRaw.filter(p => {
              if (dashboardMonth === 'All') return true;
              return p.date && p.date.startsWith(dashboardMonth);
            });

            // Filtered extra incomes by selected month
            const filteredExtraIncomes = (extraIncomes || []).filter(inc => {
              if (dashboardMonth === 'All') return true;
              return inc.date && inc.date.startsWith(dashboardMonth);
            });
            const monthlyExtraCollected = filteredExtraIncomes.reduce((sum, inc) => sum + inc.amount, 0);

            // KPI calculations based on monthly filter (including extra income)
            const monthlyCollected = filteredPayments.reduce((sum, p) => sum + p.amount, 0) + monthlyExtraCollected;

            const monthlyOutstanding = visibleStudents.reduce((sum, s) => {
              const pendingInvoices = (s.invoices || []).filter(inv => {
                if (inv.status === 'Paid') return false;
                if (dashboardMonth === 'All') return true;
                return inv.dueDate && inv.dueDate.startsWith(dashboardMonth);
              });
              return sum + pendingInvoices.reduce((acc, inv) => acc + inv.amount, 0);
            }, 0);

            const monthlyExpenses = expenses
              .filter(exp => {
                if (exp.status !== 'Approved') return false;
                if (dashboardMonth === 'All') return true;
                return exp.date && exp.date.startsWith(dashboardMonth);
              })
              .reduce((sum, exp) => sum + exp.amount, 0);

            const monthlyPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
            const monthlyNetProfit = monthlyCollected - monthlyPayroll - monthlyExpenses;

            // Build comprehensive course list from courses array + student course names
            const allCourseObjects = [...courses];
            visibleStudents.forEach(s => {
              if (s.courseName && !allCourseObjects.some(c => (c.name || '').toLowerCase() === s.courseName.toLowerCase())) {
                allCourseObjects.push({ _id: 'c_' + s.courseName, name: s.courseName, duration: '6 Months', fee: s.ledger?.totalPackageAmount || 0 });
              }
            });

            // Bar chart data: Revenue by course
            const revenueByCourseFull = allCourseObjects.map(c => {
              const cName = (c.name || '').trim().toLowerCase();
              const courseStudents = visibleStudents.filter(s => {
                const sCourse = (s.courseName || '').trim().toLowerCase();
                return sCourse === cName || sCourse.includes(cName) || cName.includes(sCourse);
              });

              const enrolled = courseStudents.length;

              const collected = courseStudents.reduce((sum, s) => {
                const paidInvoices = (s.invoices || []).filter(inv => {
                  if (inv.status !== 'Paid') return false;
                  if (dashboardMonth === 'All') return true;
                  const paidDate = inv.paidOn ? String(inv.paidOn).split('T')[0] : inv.dueDate;
                  return paidDate && paidDate.startsWith(dashboardMonth);
                }).reduce((acc, inv) => acc + inv.amount, 0);

                const manualPayments = (s.payments || []).filter(p => {
                  if (dashboardMonth === 'All') return true;
                  return p.date && p.date.startsWith(dashboardMonth);
                }).reduce((acc, p) => acc + (p.amount || 0), 0);

                const totalStudentCollected = Math.max(s.ledger?.amountPaid || 0, paidInvoices + manualPayments);
                return sum + (dashboardMonth === 'All' ? totalStudentCollected : (paidInvoices + manualPayments));
              }, 0);

              const outstanding = courseStudents.reduce((sum, s) => {
                if (dashboardMonth === 'All') {
                  return sum + (s.ledger?.balanceDue ?? 0);
                }
                const pendingInvoices = (s.invoices || []).filter(inv => {
                  if (inv.status === 'Paid') return false;
                  return inv.dueDate && inv.dueDate.startsWith(dashboardMonth);
                });
                return sum + pendingInvoices.reduce((acc, inv) => acc + inv.amount, 0);
              }, 0);

              return {
                name: c.name.length > 18 ? c.name.slice(0, 16) + '...' : c.name,
                enrolled,
                collected,
                outstanding
              };
            });

            // Donut chart filtered by month
            const paymentStatusBreakdown = [
              { name: 'Fully Paid', value: visibleStudents.filter(s => {
                  if (dashboardMonth !== 'All') {
                    const regMonth = s.invoices && s.invoices[0] ? s.invoices[0].dueDate.substring(0, 7) : null;
                    if (regMonth !== dashboardMonth) return false;
                  }
                  return s.ledger.paymentStatus === 'Fully Paid';
                }).length, fill: '#10b981' },
              { name: 'Partially Paid', value: visibleStudents.filter(s => {
                  if (dashboardMonth !== 'All') {
                    const regMonth = s.invoices && s.invoices[0] ? s.invoices[0].dueDate.substring(0, 7) : null;
                    if (regMonth !== dashboardMonth) return false;
                  }
                  return s.ledger.paymentStatus === 'Partially Paid';
                }).length, fill: '#f59e0b' },
              { name: 'Unpaid', value: visibleStudents.filter(s => {
                  if (dashboardMonth !== 'All') {
                    const regMonth = s.invoices && s.invoices[0] ? s.invoices[0].dueDate.substring(0, 7) : null;
                    if (regMonth !== dashboardMonth) return false;
                  }
                  return s.ledger.paymentStatus === 'Unpaid';
                }).length, fill: '#f43f5e' },
            ].filter(d => d.value > 0);

            // Monthly payment trend (last 6 months)
            const monthlyTrend = Array.from({ length: 6 }).map((_, i) => {
              const d = new Date();
              d.setMonth(d.getMonth() - (5 - i));
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
              const label = d.toLocaleDateString('en-US', { month: 'short' });
              const total = allPaymentsRaw.filter(p => p.date && p.date.startsWith(key)).reduce((s, p) => s + p.amount, 0);
              return { month: label, amount: total };
            });

            const RADIAN = Math.PI / 180;
            const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              if (percent < 0.05) return null;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              return (
                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            };

            return (
              <div className="space-y-6">

                {/* Dashboard Toolbar Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Control Dashboard</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* MONTH SELECT FILTER */}
                    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white">
                      <span className="text-slate-400 font-medium">Filter Month:</span>
                      <select
                        value={dashboardMonth}
                        onChange={(e) => setDashboardMonth(e.target.value)}
                        className="bg-transparent border-none text-white font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="All" className="bg-slate-950 text-white">All Time</option>
                        {availableMonths.map(m => {
                          const dateObj = new Date(m + '-02');
                          const label = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                          return (
                            <option key={m} value={m} className="bg-slate-950 text-white">{label}</option>
                          );
                        })}
                      </select>
                    </div>

                    {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && (
                      <button onClick={() => {
                        setOverrideForm({ amount: '', source: 'EMI Interest', date: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', details: '' });
                        setIsOverrideModalOpen(true);
                      }} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-emerald-500/30 shadow transition-all cursor-pointer flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add Extra Income
                      </button>
                    )}
                    <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span className="text-slate-300 font-medium">Systems Online</span>
                    </div>
                  </div>
                </div>

                {/* KPI Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { 
                      label: 'Total Students', 
                      value: visibleStudents.filter(s => {
                        if (dashboardMonth === 'All') return true;
                        const regMonth = s.invoices && s.invoices[0] ? s.invoices[0].dueDate.substring(0, 7) : null;
                        return regMonth === dashboardMonth;
                      }).length, 
                      sub: `${visibleStudents.filter(s => {
                        if (dashboardMonth !== 'All') {
                          const regMonth = s.invoices && s.invoices[0] ? s.invoices[0].dueDate.substring(0, 7) : null;
                          if (regMonth !== dashboardMonth) return false;
                        }
                        return s.ledger.paymentStatus === 'Fully Paid';
                      }).length} fully paid`, 
                      icon: <Users className="w-5 h-5" />, 
                      accent: 'text-blue-400', 
                      bg: 'bg-blue-500/10 border-blue-500/20' 
                    },
                    { 
                      label: 'Revenue Collected', 
                      value: `${monthlyCollected.toLocaleString()}`, 
                      sub: `Tuition: ${(monthlyCollected - monthlyExtraCollected).toLocaleString()} | Extra: ${monthlyExtraCollected.toLocaleString()}`, 
                      icon: <TrendingUp className="w-5 h-5" />, 
                      accent: 'text-emerald-400', 
                      bg: 'bg-emerald-500/10 border-emerald-500/20' 
                    },
                    { 
                      label: 'Active Courses', 
                      value: courses.length, 
                      sub: `${employees.length} staff members`, 
                      icon: <BookOpen className="w-5 h-5" />, 
                      accent: 'text-violet-400', 
                      bg: 'bg-violet-500/10 border-violet-500/20' 
                    },
                    { 
                      label: 'Total Net Amount', 
                      value: `${monthlyNetProfit.toLocaleString()}`, 
                      sub: `Payroll: ${monthlyPayroll.toLocaleString()}`, 
                      icon: <DollarSign className="w-5 h-5" />, 
                      accent: monthlyNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400', 
                      bg: monthlyNetProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20' 
                    },
                  ].map((card, i) => (
                    <div key={i} className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col gap-3 hover:border-slate-700 transition-all">
                      <div className="flex justify-between items-start">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
                        <div className={`${card.bg} border rounded-xl p-2 ${card.accent}`}>{card.icon}</div>
                      </div>
                      <div>
                        <p className={`text-2xl font-extrabold ${card.accent}`}>{card.value}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{card.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Row 1: Revenue by Course + Monthly Payment Trend */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                  {/* Bar chart: Revenue by course */}
                  <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-3">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue by Course
                    </h3>
                    <p className="text-slate-500 text-[11px] mb-4">Collected vs outstanding fee by programme</p>
                    {revenueByCourseFull.length === 0 ? (
                      <div className="flex items-center justify-center h-40 text-slate-600 text-xs">No course data yet.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={revenueByCourseFull} barCategoryGap="30%" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                          <YAxis tickFormatter={v => `${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, fontSize: 12, color: '#f1f5f9' }}
                            formatter={(val, name) => [`${val.toLocaleString()}`, name === 'collected' ? 'Collected' : 'Outstanding']}
                          />
                          <Legend formatter={v => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v === 'collected' ? 'Collected' : 'Outstanding'}</span>} />
                          <Bar dataKey="collected" fill="#10b981" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="outstanding" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Area chart: Monthly payment trend */}
                  <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" /> Payment Trend
                    </h3>
                    <p className="text-slate-500 text-[11px] mb-4">Monthly collections - last 6 months</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={monthlyTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, fontSize: 12, color: '#f1f5f9' }}
                          formatter={val => [`${val.toLocaleString()}`, 'Collected']}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2.5} fill="url(#payGrad)" dot={{ fill: '#3b82f6', r: 3 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                </div>

                {/* Charts Row 2: Donut + Recent Payments (Batches Card Removed) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Donut: Enrollment status */}
                  <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-violet-400" /> Enrollment Status
                    </h3>
                    <p className="text-slate-500 text-[11px] mb-4">Payment status breakdown across all students</p>
                    {paymentStatusBreakdown.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-slate-600 text-xs py-10">No students enrolled.</div>
                    ) : (
                      <>
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie data={paymentStatusBreakdown} cx="50%" cy="50%" innerRadius={52} outerRadius={80} dataKey="value" labelLine={false} label={renderCustomLabel}>
                              {paymentStatusBreakdown.map((entry, idx) => (
                                <Cell key={idx} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, fontSize: 12, color: '#f1f5f9' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap gap-3 justify-center mt-2">
                          {paymentStatusBreakdown.map((d, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs">
                              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.fill }} />
                              <span className="text-slate-400">{d.name}</span>
                              <span className="text-white font-bold">({d.value})</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Recent Payments Feed */}
                  <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-400" /> Recent Payments
                    </h3>
                    {filteredPayments.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-xs">No payments logged for this filter.</div>
                    ) : (
                      <div className="space-y-3">
                        {filteredPayments.slice(0, 4).map(pay => (
                          <div
                            key={pay._id}
                            onClick={() => { setViewingTransaction(pay); setIsTransactionModalOpen(true); }}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-800/80 hover:bg-slate-900/60 hover:border-blue-500/20 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              {pay.studentImage ? (
                                <img src={pay.studentImage} className="w-9 h-9 rounded-full object-cover border border-slate-700 flex-shrink-0" alt={pay.studentName} />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-sm flex-shrink-0">
                                  {pay.studentName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="text-white font-semibold text-xs leading-tight">{pay.studentName}</p>
                                <p className="text-slate-500 text-[10px]">{pay.date} · {pay.paymentMethod}</p>
                              </div>
                            </div>
                            <span className="text-emerald-400 font-extrabold text-sm whitespace-nowrap">+{pay.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Ledger Table */}
                {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && visibleStudents.length > 0 && (
                  <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-800">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-bold text-white">Student Ledgers Overview</h3>
                      <span className="ml-auto text-[10px] text-slate-500">{visibleStudents.length} records</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/30">
                            <th className="py-3 px-4">Roll Number</th>
                            <th className="py-3 px-4">Student Name</th>
                            <th className="py-3 px-4">Course</th>
                            <th className="py-3 px-4">Package</th>
                            <th className="py-3 px-4">Paid</th>
                            <th className="py-3 px-4">Outstanding</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleStudents.map((student) => (
                            <tr
                              key={student._id}
                              className="border-b border-slate-900 hover:bg-slate-900/50 cursor-pointer transition-colors"
                              onClick={() => { setViewingStudent(student); setProfileModalMode('view'); setIsStudentProfileModalOpen(true); }}
                            >
                              <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{student.rollNumber}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  {student.profileImage ? (
                                    <img src={student.profileImage} className="w-7 h-7 rounded-full object-cover border border-slate-700" alt={student.name} />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                                      {student.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <span className="font-semibold text-white">{student.name}</span>
                                  {student.isConfidentialFee && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Restricted to Super Admin">🔒 Confidential</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-400">{student.courseName}</td>
                              <td className="py-3 px-4 text-slate-300">
                                {student.isConfidentialFee && currentUser.role !== 'Super Admin' ? (
                                  <span className="text-slate-500 italic text-[11px]">🔒 Restricted</span>
                                ) : (
                                  student.ledger.totalPackageAmount.toLocaleString()
                                )}
                              </td>
                              <td className="py-3 px-4 text-emerald-400 font-semibold">
                                {student.isConfidentialFee && currentUser.role !== 'Super Admin' ? (
                                  <span className="text-slate-500 italic text-[11px]">🔒 Restricted</span>
                                ) : (
                                  student.ledger.amountPaid.toLocaleString()
                                )}
                              </td>
                              <td className="py-3 px-4 text-rose-400 font-semibold">
                                {student.isConfidentialFee && currentUser.role !== 'Super Admin' ? (
                                  <span className="text-slate-500 italic text-[11px]">🔒 Restricted</span>
                                ) : (
                                  student.ledger.balanceDue.toLocaleString()
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {student.isConfidentialFee && currentUser.role !== 'Super Admin' ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-slate-800 text-slate-400 border border-slate-700">🔒 Restricted</span>
                                ) : (
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                                    student.ledger.paymentStatus === 'Fully Paid'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : student.ledger.paymentStatus === 'Partially Paid'
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>
                                    {student.ledger.paymentStatus}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            );
          })()}








          {/* TAB 2: STUDENT ADMISSIONS - TABLE WITH EXPANDABLE DROPDOWN ROW DETAILS */}
          {activeTab === 'students' && (() => {
            const filteredStudents = visibleStudents.filter(student => {
              const query = studentSearchQuery.toLowerCase();
              return (
                (student.name && student.name.toLowerCase().includes(query)) ||
                (student.rollNumber && student.rollNumber.toLowerCase().includes(query)) ||
                (student.courseName && student.courseName.toLowerCase().includes(query)) ||
                (student.batchId && student.batchId.toLowerCase().includes(query)) ||
                (student.phoneNumber && student.phoneNumber.includes(query))
              );
            });

            return (
              <div className="space-y-6">
                
                {/* Admissions Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Student Admissions Registry</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Click any student row to expand inline profile & financial ledger details.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={generateStudentDirectoryPDF}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      Download Roster PDF
                    </button>
                    <button
                      onClick={() => setIsStudentModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-blue-500/20 shadow-md hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      Register Student
                    </button>
                  </div>
                </div>

                {/* Search Bar & Count */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search by student name, roll no, course, batch, phone..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 text-xs shadow-inner"
                  />
                  <span className="text-xs text-slate-500 font-medium">Showing {filteredStudents.length} of {visibleStudents.length} students</span>
                </div>

                {/* Enrolled Students Table Database */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Enrolled Students Database
                    </h3>
                    <span className="text-[10px] text-slate-500 font-medium">Showing {filteredStudents.length} of {visibleStudents.length}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="py-3 px-3">Roll Number</th>
                          <th className="py-3 px-3">Name</th>
                          <th className="py-3 px-3">Phone</th>
                          <th className="py-3 px-3">Course</th>
                          <th className="py-3 px-3">Batch</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">No students found matching search.</td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => {
                            const isExpanded = expandedStudentId === student._id;
                            return (
                              <React.Fragment key={student._id}>
                                {/* Table Main Row */}
                                <tr 
                                  onClick={() => setExpandedStudentId(isExpanded ? null : student._id)}
                                  className={`border-b border-slate-900 transition-colors cursor-pointer ${
                                    isExpanded ? 'bg-slate-900/80 border-l-4 border-l-blue-500' : 'hover:bg-slate-900/40'
                                  }`}
                                >
                                  <td className="py-3 px-3 font-mono font-medium text-slate-400">{student.rollNumber}</td>
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-3">
                                      {student.profileImage ? (
                                        <img src={student.profileImage} alt={student.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                          {student.name.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-bold text-white leading-tight">{student.name}</div>
                                        <div className="text-[10px] text-slate-500">{student.email}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-slate-300">{student.phoneNumber || 'N/A'}</td>
                                  <td className="py-3 px-3 text-slate-300">{student.courseName}</td>
                                  <td className="py-3 px-3 font-mono text-slate-400">{student.batchId}</td>
                                  <td className="py-3 px-3">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                                      student.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'
                                    }`}>
                                      {student.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-end items-center gap-2">

                                      <button 
                                        onClick={() => {
                                          setViewingStudent(student);
                                          setEditingStudentForm({ ...student });
                                          setProfileModalMode('edit');
                                          setIsStudentProfileModalOpen(true);
                                        }}
                                        className="bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-white border border-amber-500/20 rounded px-2.5 py-1 transition-all text-[10px] cursor-pointer"
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => {
                                          if (window.confirm(`Are you sure you want to completely delete ${student.name}?`)) {
                                            deleteStudent(student._id);
                                            toast.success("Student deleted successfully.");
                                          }
                                        }}
                                        className="bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded px-2.5 py-1 transition-all text-[10px] cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        onClick={() => setExpandedStudentId(isExpanded ? null : student._id)}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 bg-slate-900 border border-slate-800 text-slate-400 ${
                                          isExpanded ? 'rotate-180 text-blue-400 border-blue-500/40 bg-blue-600/10' : 'hover:text-white'
                                        }`}
                                        title={isExpanded ? "Collapse Details Dropdown" : "Expand Details Dropdown"}
                                      >
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* Expanded Dropdown Details Row */}
                                {isExpanded && (
                                  <tr className="bg-slate-950/90 border-b border-slate-800">
                                    <td colSpan={7} className="p-6">
                                      <div className="space-y-6 text-xs">
                                        
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-white text-sm">Full Profile & Financial Ledger ({student.name})</span>
                                            <span className="text-[10px] text-slate-500 font-mono">Roll: {student.rollNumber}</span>
                                          </div>
                                          <button
                                            onClick={() => setExpandedStudentId(null)}
                                            className="text-slate-400 hover:text-white text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg cursor-pointer"
                                          >
                                            Close Details
                                          </button>
                                        </div>

                                        {/* Personal & Parent Info Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                                          <div>
                                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Email Address</span>
                                            <span className="text-slate-200 font-medium break-all">{student.email}</span>
                                          </div>
                                          <div>
                                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Date of Birth</span>
                                            <span className="text-slate-200 font-medium">{student.dob || 'N/A'}</span>
                                          </div>
                                          <div>
                                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Qualification</span>
                                            <span className="text-slate-200 font-medium">{student.qualification || 'N/A'}</span>
                                          </div>
                                          <div>
                                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Parent's Phone</span>
                                            <span className="text-slate-200 font-medium">{student.parentsPhone || 'N/A'}</span>
                                          </div>
                                          <div>
                                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Father's Name</span>
                                            <span className="text-slate-200 font-medium">{student.fatherName || 'N/A'}</span>
                                          </div>
                                          <div>
                                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Mother's Name</span>
                                            <span className="text-slate-200 font-medium">{student.motherName || 'N/A'}</span>
                                          </div>
                                          <div className="col-span-2">
                                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Address</span>
                                            <span className="text-slate-200 font-medium">{student.address || 'N/A'}</span>
                                          </div>
                                        </div>

                                        {/* Document Lightbox Previews */}
                                        <div>
                                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Enrolled Student Documents</h4>
                                          <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-1 text-center">
                                              <span className="block text-[10px] text-slate-500 font-semibold">Profile Photo</span>
                                              {student.profileImage ? (
                                                <div 
                                                  onClick={() => handleOpenLightbox(student.profileImage, `${student.name.replace(/\s+/g, '_')}_profile.jpg`)}
                                                  className="border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 bg-slate-900 p-1 flex justify-center items-center h-20"
                                                  title="Click to view full size"
                                                >
                                                  <img src={student.profileImage} alt="Profile" className="h-full object-cover rounded-lg" />
                                                </div>
                                              ) : (
                                                <div className="border border-slate-800 border-dashed rounded-xl h-20 flex items-center justify-center text-[10px] text-slate-650 bg-slate-900/20">Not Uploaded</div>
                                              )}
                                            </div>

                                            <div className="space-y-1 text-center">
                                              <span className="block text-[10px] text-slate-500 font-semibold">ID Card</span>
                                              {student.idPhoto ? (
                                                <div 
                                                  onClick={() => handleOpenLightbox(student.idPhoto, `${student.name.replace(/\s+/g, '_')}_id_card.jpg`)}
                                                  className="border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 bg-slate-900 p-1 flex justify-center items-center h-20"
                                                  title="Click to view full size"
                                                >
                                                  <img src={student.idPhoto} alt="ID Photo" className="h-full object-cover rounded-lg" />
                                                </div>
                                              ) : (
                                                <div className="border border-slate-800 border-dashed rounded-xl h-20 flex items-center justify-center text-[10px] text-slate-650 bg-slate-900/20">Not Uploaded</div>
                                              )}
                                            </div>

                                            <div className="space-y-1 text-center">
                                              <span className="block text-[10px] text-slate-500 font-semibold">SSLC Certificate</span>
                                              {student.sslcPhoto ? (
                                                <div 
                                                  onClick={() => handleOpenLightbox(student.sslcPhoto, `${student.name.replace(/\s+/g, '_')}_sslc.jpg`)}
                                                  className="border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 bg-slate-900 p-1 flex justify-center items-center h-20"
                                                  title="Click to view full size"
                                                >
                                                  <img src={student.sslcPhoto} alt="SSLC Photo" className="h-full object-cover rounded-lg" />
                                                </div>
                                              ) : (
                                                <div className="border border-slate-800 border-dashed rounded-xl h-20 flex items-center justify-center text-[10px] text-slate-650 bg-slate-900/20">Not Uploaded</div>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Financial Ledger & Receipts */}
                                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                            <div>
                                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Financial Summary</p>
                                              <p className="text-xs text-slate-400 mt-0.5">Total Package: <span className="text-white font-bold">{student.ledger?.totalPackageAmount.toLocaleString()}</span> | Paid: <span className="text-emerald-400 font-bold">{student.ledger?.amountPaid.toLocaleString()}</span></p>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-[10px] text-slate-400 font-bold uppercase">Balance Due</p>
                                              <p className={`text-xl font-extrabold ${student.ledger?.balanceDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {student.ledger?.balanceDue.toLocaleString()}
                                              </p>
                                            </div>
                                          </div>

                                          {student.payments && student.payments.length > 0 && (
                                            <div>
                                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Recorded Payment Receipts ({student.payments.length})</p>
                                              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                                {student.payments.map((pay) => (
                                                  <div key={pay._id} className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
                                                    <div>
                                                      <p className="font-bold text-emerald-400">+{pay.amount.toLocaleString()}</p>
                                                      <p className="text-[10px] text-slate-500">{pay.date} • {pay.paymentMethod} • Ref: {pay.receiptNumber}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                      {currentUser.role === 'Super Admin' && (
                                                        <button 
                                                          onClick={() => openEditPaymentModal(student, pay)}
                                                          className="bg-amber-500/15 text-amber-400 hover:bg-amber-500 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                                                        >
                                                          <Edit className="w-3 h-3" /> Edit
                                                        </button>
                                                      )}
                                                      <button 
                                                        onClick={() => generatePDFInvoice(student, pay)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                                                      >
                                                        Receipt PDF
                                                      </button>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            );
          })()}

          {activeTab === 'invoices' && (() => {
            const filteredPaymentsReport = allPayments.filter(pay => {
              const payDateStr = pay.date ? String(pay.date).split('T')[0] : '';
              if (paymentStartDate && payDateStr < paymentStartDate) return false;
              if (paymentEndDate && payDateStr > paymentEndDate) return false;
              return true;
            });

            const sortedPaymentsReport = [...filteredPaymentsReport].sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return paymentSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });

            return (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Payment Activity Feed</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time log of all custom payments across the academy.</p>
                  </div>
                </div>

                {/* Filters and Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Date Range Picker Filter */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">Date Range:</span>
                      <input
                        type="date"
                        value={paymentStartDate}
                        onChange={(e) => setPaymentStartDate(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        title="From Date"
                      />
                      <span className="text-xs text-slate-500 font-bold">to</span>
                      <input
                        type="date"
                        value={paymentEndDate}
                        onChange={(e) => setPaymentEndDate(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        title="To Date"
                      />
                      {(paymentStartDate || paymentEndDate) && (
                        <button
                          onClick={() => {
                            setPaymentStartDate('');
                            setPaymentEndDate('');
                          }}
                          className="text-[10px] text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Clear Range
                        </button>
                      )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">Sort:</span>
                      <select 
                        value={paymentSortOrder}
                        onChange={(e) => setPaymentSortOrder(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="desc">Date: Newest First</option>
                        <option value="asc">Date: Oldest First</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={generatePaymentActivityPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-blue-500/20 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Activity PDF
                  </button>
                </div>

                {/* Master invoice ledger split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left side: Invoice breakdown */}
                  <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      Transaction History
                    </h3>
                    
                    {sortedPaymentsReport.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-sm">
                        No payments recorded yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortedPaymentsReport.map(pay => (
                          <div 
                            key={pay._id} 
                            onClick={() => {
                              setViewingTransaction(pay);
                              setIsTransactionModalOpen(true);
                            }}
                            className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 hover:bg-slate-900 transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              {pay.studentImage ? (
                                <img src={pay.studentImage} alt={pay.studentName} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 text-lg">
                                  {pay.studentName.charAt(0).toUpperCase()}
                                </div>
                              )}

                              {/* Details */}
                              <div>
                                <p className="text-slate-300 font-medium text-sm">
                                  Payment from <span className="text-white font-bold">{pay.studentName}</span>
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] text-slate-500 font-mono">{pay.date}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                  <span className="text-[10px] text-slate-500 font-mono">Receipt: {pay.receiptNumber}</span>
                                </div>
                              </div>
                            </div>

                            {/* Amount & Actions */}
                            <div className="text-right flex flex-col items-end gap-2">
                              <span className="text-emerald-400 font-extrabold text-lg tracking-tight">
                                + {pay.amount.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[9px] font-semibold border border-slate-700 uppercase tracking-wider">
                                  {pay.paymentMethod}
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    generatePDFInvoice(pay.studentObj, pay);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-2 py-0.5 rounded text-[9px] font-semibold cursor-pointer"
                                >
                                  Receipt
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right side: Summary indicators */}
                  <div className="space-y-6 lg:col-span-1">
                    
                    {/* Revenue metrics */}
                    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                      <h3 className="text-sm font-bold text-white mb-3">Reconciliation Status</h3>
                      <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Total Projections:</span>
                          <span className="text-white font-semibold">{stats.totalCourseRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Total Collected:</span>
                          <span className="text-emerald-400 font-semibold">{stats.totalCollected.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Aging Arrears (Due):</span>
                          <span className="text-rose-400 font-semibold">{stats.totalOutstanding.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center font-semibold text-slate-200">
                          <span>Collection Rate:</span>
                          <span>{stats.totalCourseRevenue > 0 ? Math.round((stats.totalCollected / stats.totalCourseRevenue) * 100) : 0}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Terms Info */}
                    <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl text-xs text-slate-400 space-y-2.5">
                      <div className="flex items-center gap-2 text-blue-400 font-semibold">
                        <AlertCircle className="w-4.5 h-4.5" />
                        <span>Ledger Synchronization Engine</span>
                      </div>
                      <p className="leading-relaxed">
                        Every offline payment recorded updates the respective invoice status. The student's macro-financial ledger recalculates instantly to ensure audit precision.
                      </p>
                    </div>

                  </div>

                </div>

                {/* Master Invoices Schedule Section */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        All Student Invoices & Payment Schedule
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Manage, track, and collect payment for all student invoices in MongoDB Atlas.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Invoice #</th>
                          <th className="px-4 py-3">Student</th>
                          <th className="px-4 py-3">Particulars</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Due Date</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {visibleStudents.flatMap(student => 
                          (student.invoices || []).map(inv => ({
                            ...inv,
                            studentName: student.name,
                            studentRoll: student.rollNumber,
                            studentObj: student
                          }))
                        ).length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-6 text-slate-500">No student invoices found in database.</td>
                          </tr>
                        ) : (
                          visibleStudents.flatMap(student => 
                            (student.invoices || []).map(inv => ({
                              ...inv,
                              studentName: student.name,
                              studentRoll: student.rollNumber,
                              studentObj: student
                            }))
                          ).map((inv, idx) => (
                            <tr key={inv._id || idx} className="hover:bg-slate-900/50 transition-colors">
                              <td className="px-4 py-3 font-mono font-semibold text-blue-400">{inv.invoiceNumber || 'INV-001'}</td>
                              <td className="px-4 py-3 font-medium text-white">{inv.studentName} <span className="text-[10px] text-slate-500 font-mono">({inv.studentRoll})</span></td>
                              <td className="px-4 py-3 text-slate-400">{inv.particulars || 'Tuition Fee'}</td>
                              <td className="px-4 py-3 font-bold text-white">₹{(inv.amount || 0).toLocaleString()}</td>
                              <td className="px-4 py-3 font-mono text-slate-400">{inv.dueDate || 'N/A'}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {inv.status === 'Paid' ? (
                                  <button
                                    onClick={() => generatePDFInvoice(inv.studentObj, inv)}
                                    className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors"
                                  >
                                    Download Invoice
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setPaymentModalData({ studentId: inv.studentObj._id, invoiceId: inv._id });
                                      setIsPaymentModalOpen(true);
                                    }}
                                    className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors"
                                  >
                                    Mark Paid
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            );
          })()}


          {/* TAB: FEE COLLECTION */}
          {activeTab === 'fee-collection' && (() => {
            const getLatestDate = (student) => {
              const dates = (student.payments || []).map(p => p.date).filter(Boolean);
              if (dates.length > 0) return dates.sort().reverse()[0];
              return (student.invoices && student.invoices[0]) ? (student.invoices[0].dueDate || '') : '';
            };

            const activeFeeStudents = currentUser?.role === 'Super Admin' ? students : students.filter(s => !s.isConfidentialFee);
            const filteredFeeStudents = activeFeeStudents.filter(student => {
              const query = feeCollectionSearch.toLowerCase();
              const matchesSearch = !query ||
                (student.name && student.name.toLowerCase().includes(query)) ||
                (student.rollNumber && student.rollNumber.toLowerCase().includes(query)) ||
                (student.courseName && student.courseName.toLowerCase().includes(query));

              if (!matchesSearch) return false;

              if (feeCollectionDate) {
                const hasPaymentOnDate = (student.payments || []).some(p => p.date === feeCollectionDate);
                const hasInvoiceOnDate = (student.invoices || []).some(inv => inv.dueDate === feeCollectionDate || inv.paidOn === feeCollectionDate);
                return hasPaymentOnDate || hasInvoiceOnDate;
              }

              return true;
            }).sort((a, b) => {
              if (feeCollectionSort === 'date-desc') {
                const dateA = getLatestDate(a);
                const dateB = getLatestDate(b);
                return dateB.localeCompare(dateA);
              }
              if (feeCollectionSort === 'date-asc') {
                const dateA = getLatestDate(a);
                const dateB = getLatestDate(b);
                return dateA.localeCompare(dateB);
              }
              if (feeCollectionSort === 'due-desc') {
                return (b.ledger?.balanceDue || 0) - (a.ledger?.balanceDue || 0);
              }
              if (feeCollectionSort === 'due-asc') {
                return (a.ledger?.balanceDue || 0) - (b.ledger?.balanceDue || 0);
              }
              if (feeCollectionSort === 'name-asc') {
                return (a.name || '').localeCompare(b.name || '');
              }
              if (feeCollectionSort === 'pending-first') {
                const aPending = (a.ledger?.balanceDue || 0) > 0 ? 1 : 0;
                const bPending = (b.ledger?.balanceDue || 0) > 0 ? 1 : 0;
                if (bPending !== aPending) return bPending - aPending;
                return (b.ledger?.balanceDue || 0) - (a.ledger?.balanceDue || 0);
              }
              return 0;
            });

            return (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">Fee Collection Terminal</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Quickly select a student to log a new payment.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={feeCollectionSearch}
                      onChange={(e) => setFeeCollectionSearch(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
                    />

                    {/* SELECT DATE PICKER */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-white">
                      <span className="text-slate-400 font-medium">Select Date:</span>
                      <input
                        type="date"
                        value={feeCollectionDate}
                        onChange={(e) => setFeeCollectionDate(e.target.value)}
                        className="bg-transparent border-none text-white font-semibold focus:outline-none cursor-pointer text-xs"
                      />
                      {feeCollectionDate && (
                        <button
                          onClick={() => setFeeCollectionDate('')}
                          className="text-slate-400 hover:text-white text-[10px] bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded cursor-pointer ml-1"
                          title="Clear date filter"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-white">
                      <span className="text-slate-400 font-medium">Sort By:</span>
                      <select
                        value={feeCollectionSort}
                        onChange={(e) => setFeeCollectionSort(e.target.value)}
                        className="bg-transparent border-none text-white font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="date-desc" className="bg-slate-950 text-white">Date: Newest First</option>
                        <option value="date-asc" className="bg-slate-950 text-white">Date: Oldest First</option>
                        <option value="due-desc" className="bg-slate-950 text-white">Highest Balance Due</option>
                        <option value="due-asc" className="bg-slate-950 text-white">Lowest Balance Due</option>
                        <option value="pending-first" className="bg-slate-950 text-white">Pending Payments First</option>
                        <option value="name-asc" className="bg-slate-950 text-white">Student Name (A-Z)</option>
                      </select>
                    </div>

                    {/* View Mode Toggle: Grid vs List */}
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setFeeCollectionViewMode('grid')}
                        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          feeCollectionViewMode === 'grid' 
                            ? 'bg-blue-600 text-white shadow-sm font-bold' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Grid</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeeCollectionViewMode('list')}
                        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          feeCollectionViewMode === 'list' 
                            ? 'bg-blue-600 text-white shadow-sm font-bold' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                        title="List View"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">List</span>
                      </button>
                    </div>

                    {/* Download PDF Button */}
                    <button
                      type="button"
                      onClick={() => generateFeeCollectionTerminalPDF(filteredFeeStudents)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-blue-500/20 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      title="Download Fee Collection Terminal Report as PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download PDF</span>
                    </button>
                  </div>
                </div>

                {filteredFeeStudents.length === 0 ? (
                  <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
                    No students found matching current filters.
                  </div>
                ) : feeCollectionViewMode === 'grid' ? (
                  /* GRID VIEW */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFeeStudents.map(student => (
                      <div key={student._id} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between h-full">
                        
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              {student.profileImage ? (
                                <img src={student.profileImage} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <h3 className="text-white font-bold text-sm leading-tight">{student.name}</h3>
                                <span className="text-slate-500 font-mono text-[10px]">{student.rollNumber} • {student.courseName}</span>
                              </div>
                            </div>
                            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                              student.ledger.paymentStatus === 'Fully Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}>
                              {student.ledger.paymentStatus}
                            </span>
                          </div>

                          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 mb-3 space-y-1">
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] text-slate-400 uppercase font-semibold">Package Total</p>
                              <p className="text-xs text-white font-bold">₹{(student.ledger?.totalPackageAmount || 0).toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] text-emerald-400 uppercase font-semibold">Amount Paid</p>
                              <p className="text-xs text-emerald-400 font-bold">₹{(student.ledger?.amountPaid || 0).toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                              <p className="text-[10px] text-rose-400 uppercase font-bold">Remaining Balance Due</p>
                              <p className={`text-base font-extrabold ${(student.ledger?.balanceDue || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                ₹{(student.ledger?.balanceDue || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Logged Payments & Paid Invoices History */}
                          {(() => {
                            const paidInvoicesLogs = (student.invoices || [])
                              .filter(inv => inv.status === 'Paid')
                              .map(inv => ({
                                _id: inv._id,
                                amount: inv.amount,
                                date: inv.paidOn ? String(inv.paidOn).split('T')[0] : inv.dueDate,
                                paymentMethod: inv.paymentMethod || 'Cash',
                                receiptNumber: inv.invoiceNumber || 'INV-REC'
                              }));

                            const manualPayments = student.payments || [];
                            const combinedLogs = [...paidInvoicesLogs, ...manualPayments];

                            if (combinedLogs.length === 0) return null;

                            return (
                              <div className="mb-4 space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  <span>Payment Logs ({combinedLogs.length})</span>
                                </div>
                                <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1">
                                  {combinedLogs.map((pay, idx) => (
                                    <div key={pay._id || idx} className="flex items-center justify-between bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 text-xs">
                                      <div>
                                        <span className="font-semibold text-emerald-400">+₹{pay.amount.toLocaleString()}</span>
                                        <span className="text-[10px] text-slate-400 ml-2">{pay.date} ({pay.paymentMethod})</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {currentUser.role === 'Super Admin' && (
                                          <button
                                            onClick={() => openEditPaymentModal(student, pay)}
                                            className="bg-amber-500/15 text-amber-400 hover:bg-amber-500 hover:text-white px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors flex items-center gap-1"
                                            title="Edit payment amount"
                                          >
                                            <Edit className="w-3 h-3" /> Edit
                                          </button>
                                        )}
                                        <button
                                          onClick={() => generatePDFInvoice(student, pay)}
                                          className="bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors"
                                          title="Download receipt"
                                        >
                                          Receipt
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        <button
                          onClick={() => {
                            setViewingStudent(student);
                            setNewInstallmentForm({ amount: student.ledger.balanceDue, date: new Date().toISOString().split('T')[0], method: 'Cash', upiScreenshot: null });
                            setProfileModalMode('makePayment');
                            setIsStudentProfileModalOpen(true);
                          }}
                          disabled={student.ledger.balanceDue === 0}
                          className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            student.ledger.balanceDue > 0 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-lg shadow-emerald-900/20' 
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <DollarSign className="w-4 h-4" />
                          {student.ledger.balanceDue > 0 ? 'Log New Payment' : 'Fully Paid'}
                        </button>

                      </div>
                    ))}
                  </div>
                ) : (
                  /* LIST VIEW */
                  <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/60">
                            <th className="py-3.5 px-4">Student</th>
                            <th className="py-3.5 px-4">Course & Batch</th>
                            <th className="py-3.5 px-4">Total Package</th>
                            <th className="py-3.5 px-4">Amount Paid</th>
                            <th className="py-3.5 px-4">Balance Due</th>
                            <th className="py-3.5 px-4">Payment Status</th>
                            <th className="py-3.5 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredFeeStudents.map(student => (
                            <tr key={student._id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  {student.profileImage ? (
                                    <img src={student.profileImage} alt={student.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 text-xs">
                                      {student.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-bold text-white leading-tight">{student.name}</p>
                                    <p className="text-slate-500 font-mono text-[10px]">{student.rollNumber}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="text-slate-300 font-medium">{student.courseName}</p>
                                <p className="text-[10px] text-slate-500">{student.batchId}</p>
                              </td>
                              <td className="py-3.5 px-4 text-slate-300 font-medium">
                                ₹{student.ledger.totalPackageAmount.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                                ₹{student.ledger.amountPaid.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4 font-bold text-rose-400">
                                ₹{student.ledger.balanceDue.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  student.ledger.paymentStatus === 'Fully Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                }`}>
                                  {student.ledger.paymentStatus}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => {
                                    setViewingStudent(student);
                                    setNewInstallmentForm({ amount: student.ledger.balanceDue, date: new Date().toISOString().split('T')[0], method: 'Cash', upiScreenshot: null });
                                    setProfileModalMode('makePayment');
                                    setIsStudentProfileModalOpen(true);
                                  }}
                                  disabled={student.ledger.balanceDue === 0}
                                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                                    student.ledger.balanceDue > 0 
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md shadow-emerald-900/20' 
                                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  }`}
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                  {student.ledger.balanceDue > 0 ? 'Log Payment' : 'Fully Paid'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* TAB 4: OFFICE & HR MANAGER */}
          {activeTab === 'office' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Office Administration & HR Hub</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Control operational designations, staff registers, and review monthly center payout grids.</p>
                </div>
                <button
                  onClick={() => setIsEmployeeModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-blue-500/20 shadow-md hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Employee
                </button>
              </div>

              <div className="space-y-6">
                
                {/* Staff Table */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-sm font-bold text-white mb-4">Internal Team Registry</h3>
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="py-2.5 px-2">Staff Member</th>
                          <th className="py-2.5 px-2">Role</th>
                          <th className="py-2.5 px-2">Designation</th>
                          <th className="py-2.5 px-2 text-right">Payroll Base</th>
                          <th className="py-2.5 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map(emp => (
                          <tr key={emp._id} className="border-b border-slate-900 hover:bg-slate-900/40">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-3">
                                {emp.profileImage ? (
                                  <img src={emp.profileImage} alt={emp.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 text-[10px]">
                                    {emp.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-white leading-tight">{emp.name}</div>
                                  <div className="text-[10px] text-slate-500">{emp.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                                emp.role === 'Admin' ? 'bg-blue-500/15 text-blue-400' : 'bg-slate-500/15 text-slate-400'
                              }`}>
                                {emp.role}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-slate-300">{emp.designation}</td>
                            <td className="py-3 px-2 text-right text-blue-400 font-semibold">{emp.salary.toLocaleString()}/mo</td>
                            <td className="py-3 px-2 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setHrForm({ 
                                      employeeId: emp._id, 
                                      name: emp.name,
                                      email: emp.email,
                                      role: emp.role,
                                      department: emp.department, 
                                      designation: emp.designation, 
                                      salary: emp.salary,
                                      username: emp.username || '',
                                      password: emp.password || '',
                                      phoneNumber: emp.phoneNumber || '',
                                      address: emp.address || '',
                                      qualification: emp.qualification || '',
                                      profileImage: emp.profileImage || null
                                    });
                                    setIsHRModalOpen(true);
                                  }}
                                  className="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-500/20 rounded px-2.5 py-1.5 transition-all text-[10px] cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${emp.name}?`)) {
                                      deleteEmployee(emp._id);
                                      toast.success("Employee removed successfully.");
                                    }
                                  }}
                                  className="bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded px-2.5 py-1.5 transition-all text-[10px] cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Center Expense Claims Console */}
                {(() => {
                  const filteredList = expenses.filter(exp => {
                    const q = expenseSearch.toLowerCase().trim();
                    const matchesSearch = !q || 
                      (exp.title && exp.title.toLowerCase().includes(q)) ||
                      (exp.description && exp.description.toLowerCase().includes(q)) ||
                      (exp.employeeId?.name && exp.employeeId.name.toLowerCase().includes(q)) ||
                      (exp.employeeId?.department && exp.employeeId.department.toLowerCase().includes(q));

                    let matchesFromDate = true;
                    if (expenseFromDate) {
                      matchesFromDate = new Date(exp.date) >= new Date(expenseFromDate);
                    }
                    let matchesToDate = true;
                    if (expenseToDate) {
                      matchesToDate = new Date(exp.date) <= new Date(expenseToDate);
                    }

                    return matchesSearch && matchesFromDate && matchesToDate;
                  }).sort((a, b) => {
                    if (expenseSortBy === 'date-desc') {
                      return new Date(b.date) - new Date(a.date);
                    }
                    if (expenseSortBy === 'date-asc') {
                      return new Date(a.date) - new Date(b.date);
                    }
                    if (expenseSortBy === 'amount-desc') {
                      return b.amount - a.amount;
                    }
                    if (expenseSortBy === 'amount-asc') {
                      return a.amount - b.amount;
                    }
                    if (expenseSortBy === 'title') {
                      return (a.title || '').localeCompare(b.title || '');
                    }
                    return 0;
                  });

                  const totalFilteredAmount = filteredList.reduce((sum, e) => sum + (e.amount || 0), 0);
                  const totalAllAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
                  const avgExpense = filteredList.length ? Math.round(totalFilteredAmount / filteredList.length) : 0;

                  return (
                    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
                      
                      {/* Console Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-white">Center Expense Claims</h3>
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                              {filteredList.length} {filteredList.length === 1 ? 'Record' : 'Records'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Log center operational expenses, filter by date range, edit or delete records, and download PDF reports.</p>
                        </div>
                        
                        <div className="flex items-center gap-2.5 flex-wrap self-stretch sm:self-auto">
                          <button 
                            onClick={() => generateExpensePDF(filteredList, expenseFromDate, expenseToDate)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                            title="Export Filtered Expense Report as PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-400" />
                            Download PDF
                          </button>
                          
                          <button 
                            onClick={() => setIsExpenseModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-blue-500/20 shadow-md hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Log Center Expense
                          </button>
                        </div>
                      </div>

                      {/* KPI Metric Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                          <div className="text-slate-400 font-medium">Filtered Expenses Sum</div>
                          <div className="text-xl font-bold text-white mt-1">₹{totalFilteredAmount.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{filteredList.length} expenses in view</div>
                        </div>

                        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                          <div className="text-slate-400 font-medium">Total Registered Expenses</div>
                          <div className="text-xl font-bold text-emerald-400 mt-1">₹{totalAllAmount.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{expenses.length} total entries</div>
                        </div>

                        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                          <div className="text-slate-400 font-medium">Average Expense Value</div>
                          <div className="text-xl font-bold text-blue-400 mt-1">₹{avgExpense.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Per expense log</div>
                        </div>
                      </div>

                      {/* Control Panel: Search, Date Filter, Sorting */}
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                          
                          {/* Search Input */}
                          <div className="md:col-span-6 relative">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                            <input 
                              type="text"
                              placeholder="Search title, staff, department..."
                              value={expenseSearch}
                              onChange={(e) => setExpenseSearch(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Sort By Dropdown */}
                          <div className="md:col-span-4">
                            <select
                              value={expenseSortBy}
                              onChange={(e) => setExpenseSortBy(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="date-desc">Sort: Date (Newest First)</option>
                              <option value="date-asc">Sort: Date (Oldest First)</option>
                              <option value="amount-desc">Sort: Amount (High to Low)</option>
                              <option value="amount-asc">Sort: Amount (Low to High)</option>
                              <option value="title">Sort: Title (A-Z)</option>
                            </select>
                          </div>

                          {/* Reset Button */}
                          <div className="md:col-span-2">
                            <button
                              onClick={clearExpenseFilters}
                              className="w-full h-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium px-3 py-2 rounded-lg border border-slate-800 transition-all flex items-center justify-center gap-1.5"
                              title="Reset all search and date filters"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Date Range Picker (From Date & To Date) */}
                        <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row items-center gap-3 text-xs">
                          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            Date Range Filter:
                          </span>
                          
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label className="text-slate-500 text-[11px]">From:</label>
                            <input 
                              type="date"
                              value={expenseFromDate}
                              onChange={(e) => setExpenseFromDate(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                            />
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <label className="text-slate-500 text-[11px]">To:</label>
                            <input 
                              type="date"
                              value={expenseToDate}
                              onChange={(e) => setExpenseToDate(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 text-xs"
                            />
                          </div>

                          {(expenseFromDate || expenseToDate || expenseSearch) && (
                            <span className="text-[11px] text-blue-400 font-mono ml-auto">
                              Active filters applied
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Claims List View */}
                      <div className="space-y-3">
                        {filteredList.length === 0 ? (
                          <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                            <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                            <p className="text-slate-300 font-medium text-sm">No expense claims match your search or date criteria.</p>
                            <p className="text-xs text-slate-500 mt-1">Try clearing your filters or selecting a wider date range.</p>
                            <button
                              onClick={clearExpenseFilters}
                              className="mt-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-blue-500/30 transition-all cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Reset Filters
                            </button>
                          </div>
                        ) : (
                          filteredList.map(exp => (
                            <div key={exp._id} className="bg-slate-900/80 hover:bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs transition-all duration-150">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-sm">{exp.title}</span>
                                </div>
                                <p className="text-slate-400 text-xs">{exp.description || 'No detailed description provided.'}</p>
                                <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap font-mono pt-1">
                                  <span>Logged by: <strong className="text-slate-300 font-sans">{exp.employeeId?.name || 'Staff Member'}</strong> ({exp.employeeId?.department || 'General'})</span>
                                  <span>|</span>
                                  <span>Date: <strong className="text-slate-300 font-sans">{exp.date}</strong></span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                                <div className="text-right">
                                  <span className="font-extrabold text-white text-base block">₹{exp.amount.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                                  {/* Edit Button */}
                                  <button 
                                    onClick={() => handleOpenEditExpenseModal(exp)}
                                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-all flex items-center gap-1 px-2 py-1 text-[11px]"
                                    title="Edit Expense Claim"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    Edit
                                  </button>

                                  {/* Delete Button */}
                                  <button 
                                    onClick={() => handleOpenDeleteExpenseModal(exp)}
                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-all flex items-center gap-1 px-2 py-1 text-[11px]"
                                    title="Delete Expense Claim"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })()}

              </div>

            </div>
          )}

          {/* TAB: COURSES HUB */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Courses Hub</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage academic programmes, durations, and tuition fee structures.</p>
                </div>
                <button
                  onClick={() => {
                    setCourseFormMode('add');
                    setCourseForm({ name: '', duration: '6 Months', fee: '', details: '' });
                    setEditingCourseObj(null);
                    setIsCourseFormModalOpen(true);
                  }}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-violet-500/20 shadow-md hover:shadow-violet-500/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add New Course
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel rounded-2xl p-5 border border-slate-800">
                  <p className="text-slate-400 text-xs mb-1">Total Programmes</p>
                  <p className="text-2xl font-extrabold text-white">{courses.length}</p>
                </div>
                <div className="glass-panel rounded-2xl p-5 border border-slate-800">
                  <p className="text-slate-400 text-xs mb-1">Highest Fee</p>
                  <p className="text-2xl font-extrabold text-emerald-300">
                    {courses.length ? Math.max(...courses.map(c => c.fee || 0)).toLocaleString() : 0}
                  </p>
                </div>
                <div className="glass-panel rounded-2xl p-5 border border-slate-800">
                  <p className="text-slate-400 text-xs mb-1">Active Enrollments</p>
                  <p className="text-2xl font-extrabold text-blue-300">{visibleStudents.length}</p>
                </div>
              </div>

              {/* Course Cards Grid */}
              {courses.length === 0 ? (
                <div className="glass-panel p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                  <BookOpen className="w-12 h-12 text-slate-700 mb-4" />
                  <p className="text-slate-400 font-medium">No courses added yet.</p>
                  <p className="text-slate-600 text-xs mt-1">Click "Add New Course" to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {courses.map((course) => {
                    const enrolledCount = visibleStudents.filter(s => s.courseName === course.name).length;
                    return (
                      <div key={course._id} className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 transition-all hover:-translate-y-0.5">
                        
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                              {enrolledCount} enrolled
                            </span>
                          </div>
                          
                          <h3 className="mt-3 text-white font-bold text-base leading-snug">{course.name}</h3>
                          
                          {course.details && (
                            <p className="mt-1.5 text-slate-500 text-xs leading-relaxed line-clamp-2">{course.details}</p>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                            <div>
                              <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Duration</p>
                              <p className="text-slate-300 text-sm font-semibold">{course.duration || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Tuition Fee</p>
                              <p className="text-lg font-extrabold text-white">{(course.fee || 0).toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => {
                                setCourseFormMode('edit');
                                setEditingCourseObj(course);
                                setCourseForm({ name: course.name, duration: course.duration || '6 Months', fee: course.fee || '', details: course.details || '' });
                                setIsCourseFormModalOpen(true);
                              }}
                              className="flex-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${course.name}"? This cannot be undone.`)) {
                                  deleteCourse(course._id);
                                  toast.success("Course removed.");
                                }
                              }}
                              className="flex-1 bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          )}

          {/* TAB 5: EMPLOYEE PORTAL - PAYMENTS & EXPENSES */}

          {activeTab === 'employee-payouts' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-xl font-extrabold text-white">Personal Finance Console</h2>
                <p className="text-xs text-slate-400 mt-0.5">Track your monthly payout agreements and download historical salary records.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Salary slip overview card */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-1 space-y-4">
                  <div className="bg-gradient-to-tr from-blue-900/40 to-blue-900/40 p-5 rounded-xl border border-blue-500/20 text-center">
                    <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide">Base Salary Agreement</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2">{currentUser.salary.toLocaleString()}</h3>
                    <p className="text-[10px] text-slate-400 mt-2">Position: {currentUser.designation} ({currentUser.department})</p>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-400 pt-2">
                    <div className="flex justify-between">
                      <span>Teaching Hour Metrics:</span>
                      <span className="text-white font-mono">{currentUser.teachingHours || 0} hrs/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Month Cycle:</span>
                      <span className="text-white">July 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payout Method:</span>
                      <span className="text-white">Direct Bank Deposit</span>
                    </div>
                  </div>
                </div>

                {/* Salary slips generator */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
                  <h3 className="text-sm font-bold text-white mb-4">Historical Salary Payout Logs</h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { period: "June 2026", status: "Paid", amount: currentUser.salary, date: "2026-06-30" },
                      { period: "May 2026", status: "Paid", amount: currentUser.salary, date: "2026-05-31" },
                      { period: "April 2026", status: "Paid", amount: currentUser.salary, date: "2026-04-30" }
                    ].map((slip, i) => (
                      <div key={i} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-white">{slip.period} Salary Slip</span>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">Disbursed on: {slip.date} | Status: {slip.status}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-white">{slip.amount.toLocaleString()}</span>
                          <button 
                            onClick={() => toast.success(`Initiating PDF Download for ${slip.period} salary slip...`)}
                            className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-lg p-2 transition-all"
                            title="Download PDF Slip"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: FILING CENTER CLAIMS (EMPLOYEE) */}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Expense Reimbursement Portal</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Submit receipts and claim center operational expense refunds.</p>
                </div>
                <button
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-blue-500/20 shadow-md hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  File Expense Claim
                </button>
              </div>

              {/* Claims history for current employee */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-4">Your Expense Reimbursement History</h3>
                <div className="space-y-3">
                  {expenses
                    .filter(exp => exp.employeeId?._id === currentUser._id)
                    .map(exp => (
                      <div key={exp._id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-semibold text-white">{exp.title}</span>
                          <p className="text-slate-400 text-[10px] mt-1">{exp.description || 'No description'}</p>
                          <div className="text-[10px] text-slate-500 mt-2 font-mono">Date: {exp.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-white">{exp.amount.toLocaleString()}</span>
                          <span className={`px-2.5 py-1 rounded text-[10px] font-semibold ${
                            exp.status === 'Approved' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : exp.status === 'Rejected'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {exp.status}
                          </span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>Ã‚Â© 2026 Academy Office Systems. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-300">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300">Operational Terms</a>
        </div>
      </footer>

      {/* ALL MODALS AT ROOT LEVEL */}
      
      {/* 1. Student Registration Modal */}
      <Modal 
        isOpen={isStudentModalOpen} 
        onClose={() => setIsStudentModalOpen(false)} 
        title="Register New Student"
      >
        <form onSubmit={handleStudentSubmit} className="space-y-4 text-sm max-h-[75vh] overflow-y-auto pr-2">
          {/* Row 1: Name, DOB, Custom ID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Full Name *</label>
              <input type="text" required placeholder="e.g. Jane Doe" value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Date of Birth</label>
              <input type="date" value={studentForm.dob} onChange={(e) => setStudentForm({...studentForm, dob: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Custom ID</label>
              <input type="text" placeholder="Leave blank for auto-generate" value={studentForm.customId} onChange={(e) => setStudentForm({...studentForm, customId: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Row 2: Father's Name, Mother's Name, Parent's Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Father's Name</label>
              <input type="text" placeholder="e.g. John Doe" value={studentForm.fatherName} onChange={(e) => setStudentForm({...studentForm, fatherName: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Mother's Name</label>
              <input type="text" placeholder="e.g. Mary Doe" value={studentForm.motherName} onChange={(e) => setStudentForm({...studentForm, motherName: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Parent's Phone *</label>
              <input type="tel" required placeholder="e.g. +91 9988776655" value={studentForm.parentsPhone} onChange={(e) => setStudentForm({...studentForm, parentsPhone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          
          {/* Row 3: Email Address, Phone Number, Qualification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Address *</label>
              <input type="email" required placeholder="jane@example.com" value={studentForm.email} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
              <input type="tel" placeholder="+91 9876543210" value={studentForm.phoneNumber} onChange={(e) => setStudentForm({...studentForm, phoneNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Qualification</label>
              <input type="text" placeholder="e.g. B.Tech, MCA" value={studentForm.qualification} onChange={(e) => setStudentForm({...studentForm, qualification: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Row 4: Residential Address */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Residential Address</label>
            <textarea placeholder="Full address..." value={studentForm.address} onChange={(e) => setStudentForm({...studentForm, address: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none h-16" />
          </div>

          {/* Row 5: Course Name, Batch Code, Total Package */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Course Name *
              </label>
              <select 
                required 
                value={studentForm.courseName} 
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const foundCourse = courses.find(c => c.name === selectedName);
                  const fetchedFee = foundCourse ? foundCourse.fee : 45000;
                  setStudentForm({
                    ...studentForm,
                    courseName: selectedName,
                    totalPackageAmount: fetchedFee
                  });
                }} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Select Course --</option>
                {courses.map(c => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Batch Code *</label>
              <input type="text" required placeholder="BATCH-WEB-01" value={studentForm.batchId} onChange={(e) => setStudentForm({...studentForm, batchId: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Total Package Amount *</label>
              <input type="number" required value={studentForm.totalPackageAmount} onChange={(e) => setStudentForm({...studentForm, totalPackageAmount: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Row 6: Installments Allowed & Confidential Fee Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Installments Allowed</label>
              <select value={studentForm.installmentCount} onChange={(e) => setStudentForm({...studentForm, installmentCount: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                <option value={1}>1 (Upfront)</option>
                <option value={2}>2 Installments</option>
                <option value={3}>3 Installments</option>
                <option value={4}>4 Installments</option>
                <option value={6}>6 Installments</option>
              </select>
            </div>

            {currentUser.role === 'Super Admin' && (
              <div className="sm:col-span-2 flex items-center gap-2 mt-6 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <input 
                  type="checkbox" 
                  id="isConfidentialFee" 
                  checked={studentForm.isConfidentialFee || false} 
                  onChange={(e) => setStudentForm({ ...studentForm, isConfidentialFee: e.target.checked })} 
                  className="w-4 h-4 text-amber-500 rounded border-slate-700 bg-slate-800 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="isConfidentialFee" className="text-xs text-amber-400 font-semibold cursor-pointer select-none flex items-center gap-1.5">
                  🔒 Restrict Fee Visibility (Super Admin Only)
                </label>
              </div>
            )}
          </div>

          {/* Row 7: Document & Photo uploads (Cropper Triggered) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/80">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Profile Photo (1:1)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChangeForCrop(e, 1, (base64) => setStudentForm(prev => ({...prev, profileImage: base64})))} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] focus:outline-none" />
              {studentForm.profileImage ? (
                <div className="text-[10px] text-emerald-400 mt-1.5 font-semibold flex items-center gap-1">✓ Photo ready & cropped</div>
              ) : (
                <div className="text-[10px] text-slate-500 mt-1.5">No image loaded</div>
              )}
            </div>
            
            <div>
              <label className="block text-slate-400 font-medium mb-1">ID Card (Landscape)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChangeForCrop(e, 4/3, (base64) => setStudentForm(prev => ({...prev, idPhoto: base64})))} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] focus:outline-none" />
              {studentForm.idPhoto ? (
                <div className="text-[10px] text-emerald-400 mt-1.5 font-semibold flex items-center gap-1">✓ ID Card ready & cropped</div>
              ) : (
                <div className="text-[10px] text-slate-500 mt-1.5">No ID image loaded</div>
              )}
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">SSLC Certificate (Portrait)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChangeForCrop(e, 3/4, (base64) => setStudentForm(prev => ({...prev, sslcPhoto: base64})))} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] focus:outline-none" />
              {studentForm.sslcPhoto ? (
                <div className="text-[10px] text-emerald-400 mt-1.5 font-semibold flex items-center gap-1">✓ SSLC ready & cropped</div>
              ) : (
                <div className="text-[10px] text-slate-500 mt-1.5">No certificate loaded</div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer">
              Complete Registration & Initialize Ledger
            </button>
          </div>
        </form>
      </Modal>

      {/* Course Manager Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Manage Courses"
      >
        <div className="space-y-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            const val = e.target.newCourse.value;
            if (val) { addCourse(val); e.target.newCourse.value = ''; }
          }} className="flex gap-2">
            <input name="newCourse" type="text" placeholder="New course name..." className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" required />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
          <div className="mt-4 max-h-[50vh] overflow-y-auto space-y-2">
            {courses.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No courses available.</p>
            ) : (
              courses.map(course => (
                <div key={course._id} className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-sm font-medium text-slate-200">{course.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      const newName = window.prompt("Edit Course Name:", course.name);
                      if (newName) editCourse(course._id, newName);
                    }} className="text-slate-400 hover:text-blue-400 transition-colors text-xs cursor-pointer">
                      Edit
                    </button>
                    <button onClick={() => {
                      if (window.confirm(`Delete ${course.name}?`)) deleteCourse(course._id);
                    }} className="text-slate-400 hover:text-rose-400 transition-colors text-xs cursor-pointer">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Student Profile Modal */}
      <Modal
        isOpen={isStudentProfileModalOpen}
        onClose={() => { setIsStudentProfileModalOpen(false); setViewingStudent(null); setProfileModalMode('view'); }}
        title={profileModalMode === 'edit' ? "Edit Student Profile" : profileModalMode === 'addInstallment' ? "Add Installment" : "Student Profile"}
      >
        {viewingStudent && profileModalMode === 'view' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              {viewingStudent.profileImage ? (
                <img src={viewingStudent.profileImage} alt={viewingStudent.name} className="w-16 h-16 rounded-full object-cover border border-slate-700" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 text-xl">
                  {viewingStudent.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white">{viewingStudent.name}</h3>
                <p className="text-sm text-slate-400 font-mono">{viewingStudent.rollNumber}</p>
                <div className="flex gap-2 mt-1">
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-500/20">{viewingStudent.status}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="block text-xs text-slate-500 uppercase font-semibold">Email</span>
                <span className="text-slate-300 break-all">{viewingStudent.email}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase font-semibold">Phone</span>
                <span className="text-slate-300">{viewingStudent.phoneNumber || '-'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase font-semibold">Date of Birth</span>
                <span className="text-slate-300">{viewingStudent.dob || '-'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase font-semibold">Course</span>
                <span className="text-slate-300">{viewingStudent.courseName}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase font-semibold">Batch</span>
                <span className="text-slate-300">{viewingStudent.batchId}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase font-semibold">Parent's Phone</span>
                <span className="text-slate-300">{viewingStudent.parentsPhone || '-'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase font-semibold">Father's Name</span>
                <span className="text-slate-300">{viewingStudent.fatherName || '-'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500 uppercase font-semibold">Mother's Name</span>
                <span className="text-slate-300">{viewingStudent.motherName || '-'}</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="block text-xs text-slate-500 uppercase font-semibold">Address</span>
                <span className="text-slate-300">{viewingStudent.address || '-'}</span>
              </div>
            </div>

            {/* Student Documents Preview Lightbox Triggers */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Enrolled Student Documents</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 text-center">
                  <span className="block text-[10px] text-slate-500 font-semibold">Profile Photo</span>
                  {viewingStudent.profileImage ? (
                    <div 
                      onClick={() => handleOpenLightbox(viewingStudent.profileImage, `${viewingStudent.name.replace(/\s+/g, '_')}_profile.jpg`)}
                      className="border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 bg-slate-950 p-1 flex justify-center items-center h-20"
                      title="Click to view and download"
                    >
                      <img src={viewingStudent.profileImage} alt="Profile" className="h-full object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className="border border-slate-800 border-dashed rounded-xl h-20 flex items-center justify-center text-[10px] text-slate-650 bg-slate-900/20">Not Uploaded</div>
                  )}
                </div>

                <div className="space-y-1 text-center">
                  <span className="block text-[10px] text-slate-500 font-semibold">ID Card</span>
                  {viewingStudent.idPhoto ? (
                    <div 
                      onClick={() => handleOpenLightbox(viewingStudent.idPhoto, `${viewingStudent.name.replace(/\s+/g, '_')}_id_card.jpg`)}
                      className="border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 bg-slate-950 p-1 flex justify-center items-center h-20"
                      title="Click to view and download"
                    >
                      <img src={viewingStudent.idPhoto} alt="ID Photo" className="h-full object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className="border border-slate-800 border-dashed rounded-xl h-20 flex items-center justify-center text-[10px] text-slate-650 bg-slate-900/20">Not Uploaded</div>
                  )}
                </div>

                <div className="space-y-1 text-center">
                  <span className="block text-[10px] text-slate-500 font-semibold">SSLC Certificate</span>
                  {viewingStudent.sslcPhoto ? (
                    <div 
                      onClick={() => handleOpenLightbox(viewingStudent.sslcPhoto, `${viewingStudent.name.replace(/\s+/g, '_')}_sslc.jpg`)}
                      className="border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 bg-slate-950 p-1 flex justify-center items-center h-20"
                      title="Click to view and download"
                    >
                      <img src={viewingStudent.sslcPhoto} alt="SSLC Photo" className="h-full object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className="border border-slate-800 border-dashed rounded-xl h-20 flex items-center justify-center text-[10px] text-slate-650 bg-slate-900/20">Not Uploaded</div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Overview & Payment History */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              {viewingStudent.isConfidentialFee && currentUser.role !== 'Super Admin' ? (
                <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 text-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2 text-lg">🔒</div>
                  <h4 className="text-sm font-bold text-amber-400">Restricted Fee Record</h4>
                  <p className="text-xs text-slate-400 mt-1">Fee ledger, balance due, and payment transactions for this student are strictly restricted to Super Admin.</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 text-center mb-4">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Balance Due</p>
                    <p className="text-4xl font-bold text-rose-500">{viewingStudent.ledger.balanceDue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-2">Total Package: {viewingStudent.ledger.totalPackageAmount.toLocaleString()} | Paid: {viewingStudent.ledger.amountPaid.toLocaleString()}</p>
                  </div>

                  {viewingStudent.payments && viewingStudent.payments.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-white mb-2">Payment History</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                        {viewingStudent.payments.map(pay => (
                          <div key={pay._id} className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div>
                              <p className="font-semibold text-emerald-400">{pay.amount.toLocaleString()}</p>
                              <p className="text-[10px] text-slate-500">{pay.date}  |  {pay.paymentMethod}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {currentUser.role === 'Super Admin' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditPaymentModal(viewingStudent, pay);
                                  }}
                                  className="bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <Edit className="w-3 h-3" /> Edit
                                </button>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  generatePDFInvoice(viewingStudent, pay);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Invoice
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="pt-4 flex flex-wrap gap-2 border-t border-slate-800">
              <button onClick={() => {
                setEditingStudentForm({ ...viewingStudent });
                setProfileModalMode('edit');
              }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-1 cursor-pointer">
                Edit Details
              </button>
              <button onClick={() => {
                if(window.confirm(`Are you sure you want to completely delete ${viewingStudent.name}?`)) {
                  deleteStudent(viewingStudent._id);
                  setIsStudentProfileModalOpen(false);
                }
              }} className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-1 cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        )}

        {viewingStudent && profileModalMode === 'edit' && editingStudentForm && (
          <form onSubmit={(e) => {
            e.preventDefault();
            editStudent(viewingStudent._id, editingStudentForm);
            setViewingStudent({ ...viewingStudent, ...editingStudentForm });
            setProfileModalMode('view');
          }} className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <input type="text" required value={editingStudentForm.name} onChange={(e) => setEditingStudentForm({...editingStudentForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Email</label>
                <input type="email" required value={editingStudentForm.email} onChange={(e) => setEditingStudentForm({...editingStudentForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
                <input type="tel" value={editingStudentForm.phoneNumber} onChange={(e) => setEditingStudentForm({...editingStudentForm, phoneNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Date of Birth</label>
                <input type="date" value={editingStudentForm.dob || ''} onChange={(e) => setEditingStudentForm({...editingStudentForm, dob: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Roll Number</label>
                <input type="text" required value={editingStudentForm.rollNumber} onChange={(e) => setEditingStudentForm({...editingStudentForm, rollNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Qualification</label>
                <input type="text" value={editingStudentForm.qualification || ''} onChange={(e) => setEditingStudentForm({...editingStudentForm, qualification: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Course Name</label>
                <select 
                  required 
                  value={editingStudentForm.courseName} 
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const foundCourse = courses.find(c => c.name === selectedName);
                    const fetchedFee = foundCourse ? foundCourse.fee : 45000;
                    setEditingStudentForm({
                      ...editingStudentForm,
                      courseName: selectedName,
                      ledger: {
                        ...editingStudentForm.ledger,
                        totalPackageAmount: fetchedFee,
                        balanceDue: fetchedFee - editingStudentForm.ledger.amountPaid,
                        paymentStatus: (fetchedFee - editingStudentForm.ledger.amountPaid) === 0 ? 'Fully Paid' : editingStudentForm.ledger.amountPaid > 0 ? 'Partially Paid' : 'Unpaid'
                      }
                    });
                  }} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Select Course --</option>
                  {courses.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Batch Code</label>
                <input type="text" required value={editingStudentForm.batchId} onChange={(e) => setEditingStudentForm({...editingStudentForm, batchId: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Parent's Phone</label>
                <input type="tel" value={editingStudentForm.parentsPhone || ''} onChange={(e) => setEditingStudentForm({...editingStudentForm, parentsPhone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Father's Name</label>
                <input type="text" value={editingStudentForm.fatherName || ''} onChange={(e) => setEditingStudentForm({...editingStudentForm, fatherName: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Mother's Name</label>
                <input type="text" value={editingStudentForm.motherName || ''} onChange={(e) => setEditingStudentForm({...editingStudentForm, motherName: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/80">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Update Photo (1:1)</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChangeForCrop(e, 1, (base64) => setEditingStudentForm(prev => ({...prev, profileImage: base64})))} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] focus:outline-none" />
                {editingStudentForm.profileImage && <div className="text-[10px] text-emerald-400 mt-1 font-semibold">✓ Photo Ready</div>}
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Update ID (Landscape)</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChangeForCrop(e, 4/3, (base64) => setEditingStudentForm(prev => ({...prev, idPhoto: base64})))} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] focus:outline-none" />
                {editingStudentForm.idPhoto && <div className="text-[10px] text-emerald-400 mt-1 font-semibold">✓ ID Card Ready</div>}
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Update SSLC (Portrait)</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChangeForCrop(e, 3/4, (base64) => setEditingStudentForm(prev => ({...prev, sslcPhoto: base64})))} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] focus:outline-none" />
                {editingStudentForm.sslcPhoto && <div className="text-[10px] text-emerald-400 mt-1 font-semibold">✓ SSLC Ready</div>}
              </div>
            </div>
            {currentUser.role === 'Super Admin' && (
              <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <input 
                  type="checkbox" 
                  id="editIsConfidentialFee" 
                  checked={editingStudentForm.isConfidentialFee || false} 
                  onChange={(e) => setEditingStudentForm({ ...editingStudentForm, isConfidentialFee: e.target.checked })} 
                  className="w-4 h-4 text-amber-500 rounded border-slate-700 bg-slate-800 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="editIsConfidentialFee" className="text-xs text-amber-400 font-semibold cursor-pointer select-none flex items-center gap-1.5">
                  🔒 Restrict Fee Visibility (Super Admin Only)
                </label>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setProfileModalMode('view')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-2.5 font-semibold transition-all cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-semibold transition-all cursor-pointer">Save Changes</button>
            </div>
          </form>
        )}

        {viewingStudent && profileModalMode === 'makePayment' && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if(newInstallmentForm.amount > 0) {
              if (newInstallmentForm.method === 'UPI' && !newInstallmentForm.upiScreenshot) {
                toast.error("Please upload the UPI payment screenshot.");
                return;
              }
              await makePayment(viewingStudent._id, newInstallmentForm.amount, newInstallmentForm.date, newInstallmentForm.method, newInstallmentForm.upiScreenshot);
              toast.success("Payment recorded successfully!");
              setIsStudentProfileModalOpen(false);
            }
          }} className="space-y-4 text-sm">
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-center mb-4">
              <p className="text-xs text-rose-400 font-semibold uppercase">Current Balance</p>
              <p className="text-2xl font-bold text-rose-500">{viewingStudent.ledger.balanceDue.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Payment Amount *</label>
              <input type="number" required min="1" max={viewingStudent.ledger.balanceDue} value={newInstallmentForm.amount} onChange={(e) => setNewInstallmentForm({...newInstallmentForm, amount: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-lg font-semibold" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Payment Date *</label>
              <input type="date" required value={newInstallmentForm.date} onChange={(e) => setNewInstallmentForm({...newInstallmentForm, date: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Payment Method *</label>
              <select value={newInstallmentForm.method} onChange={(e) => setNewInstallmentForm({...newInstallmentForm, method: e.target.value, upiScreenshot: null})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / Net Banking</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            
            {newInstallmentForm.method === 'UPI' && (
              <div>
                <label className="block text-slate-400 font-medium mb-1">UPI Screenshot (Max 500KB) *</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  required
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5000000) {
                        toast.error("File is too large. Please select an image under 5MB.");
                        e.target.value = '';
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewInstallmentForm({ ...newInstallmentForm, upiScreenshot: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs" 
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setProfileModalMode('view')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-2.5 font-semibold transition-all cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 font-semibold transition-all cursor-pointer">Record Payment</button>
            </div>
          </form>
        )}
      </Modal>

      {/* 2. Add Extra Income Modal */}
      <Modal 
        isOpen={isOverrideModalOpen} 
        onClose={() => setIsOverrideModalOpen(false)} 
        title="Add Extra Income"
      >
        <form onSubmit={handleOverrideSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Income Amount *</label>
              <input 
                type="number" 
                required
                placeholder="0"
                value={overrideForm.amount}
                onChange={(e) => setOverrideForm({...overrideForm, amount: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Payment Method</label>
              <select
                value={overrideForm.paymentMethod}
                onChange={(e) => setOverrideForm({...overrideForm, paymentMethod: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Income Source / Category *</label>
              <select
                value={overrideForm.source}
                onChange={(e) => setOverrideForm({...overrideForm, source: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
              >
                <option value="EMI Interest">EMI Interest</option>
                <option value="Installment Fee">Installment Fee</option>
                <option value="Academy Sales">Academy Sales / Books</option>
                <option value="Miscellaneous">Miscellaneous Income</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Date</label>
              <input 
                type="date" 
                value={overrideForm.date}
                onChange={(e) => setOverrideForm({...overrideForm, date: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Additional Details</label>
            <textarea 
              placeholder="Provide source details, student reference, emi specifics..."
              value={overrideForm.details}
              onChange={(e) => setOverrideForm({...overrideForm, details: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none h-20 resize-none"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer"
            >
              Record Extra Income
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Payment Modal */}
      <Modal 
        isOpen={isEditPaymentModalOpen} 
        onClose={() => setIsEditPaymentModalOpen(false)} 
        title="Correct Payment Record / Edit Amount"
      >
        {editingPaymentData && (
          <form onSubmit={handleEditPaymentSubmit} className="space-y-4 text-sm">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <p className="text-xs text-amber-400 font-semibold uppercase mb-1">Correct Payment Record</p>
              <p className="text-sm font-bold text-white">{editingPaymentData.studentName}</p>
              <p className="text-xs text-slate-400">Receipt Reference: <span className="font-mono text-slate-200">{editingPaymentData.receiptNumber}</span></p>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Correct Payment Amount *</label>
              <input 
                type="number" 
                required 
                min="1" 
                value={editingPaymentData.amount} 
                onChange={(e) => setEditingPaymentData({ ...editingPaymentData, amount: e.target.value })} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-lg font-semibold" 
              />
              <p className="text-[10px] text-slate-500 mt-1">Updating this amount will automatically recalculate the student's ledger and outstanding balance due.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Payment Date *</label>
                <input 
                  type="date" 
                  required 
                  value={editingPaymentData.date} 
                  onChange={(e) => setEditingPaymentData({ ...editingPaymentData, date: e.target.value })} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" 
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Payment Method *</label>
                <select 
                  value={editingPaymentData.paymentMethod} 
                  onChange={(e) => setEditingPaymentData({ ...editingPaymentData, paymentMethod: e.target.value })} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / Net Banking</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsEditPaymentModalOpen(false)} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-3 font-semibold transition-all cursor-pointer"
              >
                Save Payment Correction
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* 3. Employee Registration Modal */}
      <Modal 
        isOpen={isEmployeeModalOpen} 
        onClose={() => setIsEmployeeModalOpen(false)} 
        title="Staff Onboarding"
      >
        <form onSubmit={handleEmployeeSubmit} className="space-y-4 text-sm max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Employee Full Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Instructor Bob"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Corporate Email *</label>
              <input 
                type="email" 
                required
                placeholder="faculty@academy.com"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
              <input 
                type="tel" 
                placeholder="+91 9876543210"
                value={employeeForm.phoneNumber}
                onChange={(e) => setEmployeeForm({...employeeForm, phoneNumber: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Qualification</label>
              <input 
                type="text" 
                placeholder="e.g. MBA, B.Tech, Ph.D"
                value={employeeForm.qualification}
                onChange={(e) => setEmployeeForm({...employeeForm, qualification: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Profile Image (Max 500KB)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5000000) {
                    toast.error("File is too large. Please select an image under 5MB.");
                    e.target.value = '';
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEmployeeForm({ ...employeeForm, profileImage: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Username (For Login) *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. bob_instructor"
                value={employeeForm.username}
                onChange={(e) => setEmployeeForm({...employeeForm, username: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Password *</label>
              <input 
                type="password" 
                required
                placeholder=" |  |  |  |  |  |  |  | "
                value={employeeForm.password}
                onChange={(e) => setEmployeeForm({...employeeForm, password: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">System Role</label>
              <select 
                value={employeeForm.role}
                onChange={(e) => setEmployeeForm({...employeeForm, role: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Designation *</label>
              <input 
                type="text" 
                required
                placeholder="Lead Tutor"
                value={employeeForm.designation}
                onChange={(e) => setEmployeeForm({...employeeForm, designation: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Basic Salary /mo *</label>
              <input 
                type="number" 
                required
                placeholder="45000"
                value={employeeForm.salary}
                onChange={(e) => setEmployeeForm({...employeeForm, salary: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Residential Address</label>
            <textarea 
              placeholder="Full address details..."
              value={employeeForm.address}
              onChange={(e) => setEmployeeForm({...employeeForm, address: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none h-20"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition-all duration-200"
            >
              Enroll Employee & Create Login
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. Edit Employee Modal */}
      <Modal 
        isOpen={isHRModalOpen} 
        onClose={() => setIsHRModalOpen(false)} 
        title="Edit Employee Details"
      >
        <form onSubmit={handleHRUpdateSubmit} className="space-y-4 text-sm max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Employee Full Name *</label>
              <input 
                type="text" 
                required
                value={hrForm.name}
                onChange={(e) => setHrForm({...hrForm, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Corporate Email *</label>
              <input 
                type="email" 
                required
                value={hrForm.email}
                onChange={(e) => setHrForm({...hrForm, email: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={hrForm.phoneNumber}
                onChange={(e) => setHrForm({...hrForm, phoneNumber: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Qualification</label>
              <input 
                type="text" 
                value={hrForm.qualification}
                onChange={(e) => setHrForm({...hrForm, qualification: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Profile Image (Max 500KB)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5000000) {
                    toast.error("File is too large. Please select an image under 5MB.");
                    e.target.value = '';
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setHrForm({ ...hrForm, profileImage: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Username *</label>
              <input 
                type="text" 
                required
                value={hrForm.username}
                onChange={(e) => setHrForm({...hrForm, username: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Password *</label>
              <input 
                type="password" 
                required
                value={hrForm.password}
                onChange={(e) => setHrForm({...hrForm, password: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">System Role</label>
              <select 
                value={hrForm.role}
                onChange={(e) => setHrForm({...hrForm, role: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Designation *</label>
              <input 
                type="text" 
                required
                value={hrForm.designation}
                onChange={(e) => setHrForm({...hrForm, designation: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Basic Salary /mo *</label>
              <input 
                type="number" 
                required
                value={hrForm.salary}
                onChange={(e) => setHrForm({...hrForm, salary: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Residential Address</label>
            <textarea 
              value={hrForm.address}
              onChange={(e) => setHrForm({...hrForm, address: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none h-20"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={() => setIsHRModalOpen(false)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* 5. Expense Claim Modal */}
      <Modal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
        title="File Payout Claim"
      >
        <form onSubmit={handleExpenseSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Expense Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Stationary or Lab Repairs"
              value={expenseForm.title}
              onChange={(e) => setExpenseForm({...expenseForm, title: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Claim Amount</label>
            <input 
              type="number" 
              required
              placeholder="e.g. 1500"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Expense Date</label>
            <input 
              type="date" 
              required
              value={expenseForm.date}
              onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Item Details / Description</label>
            <textarea 
              rows="3"
              placeholder="Describe the purchase details..."
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
            />
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition-all duration-200"
            >
              File Reimbursement Claim
            </button>
          </div>
        </form>
      </Modal>

      {/* 5b. Edit Expense Claim Modal */}
      <Modal 
        isOpen={isExpenseEditModalOpen} 
        onClose={() => {
          setIsExpenseEditModalOpen(false);
          setEditingExpenseObj(null);
        }} 
        title="Edit Center Expense Claim"
      >
        <form onSubmit={handleExpenseEditSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Expense Title *</label>
            <input 
              type="text" 
              required
              placeholder="Expense title"
              value={expenseEditForm.title}
              onChange={(e) => setExpenseEditForm({...expenseEditForm, title: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Claim Amount (₹) *</label>
              <input 
                type="number" 
                required
                min="0"
                step="any"
                placeholder="Amount"
                value={expenseEditForm.amount}
                onChange={(e) => setExpenseEditForm({...expenseEditForm, amount: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Claim Date *</label>
              <input 
                type="date" 
                required
                value={expenseEditForm.date}
                onChange={(e) => setExpenseEditForm({...expenseEditForm, date: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Description / Particulars</label>
            <textarea 
              rows="3"
              placeholder="Describe the purchase details..."
              value={expenseEditForm.description}
              onChange={(e) => setExpenseEditForm({...expenseEditForm, description: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => {
                setIsExpenseEditModalOpen(false);
                setEditingExpenseObj(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 font-semibold transition-all shadow-md hover:shadow-blue-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* 5c. Delete Expense Claim Confirmation Modal */}
      <Modal 
        isOpen={isExpenseDeleteModalOpen} 
        onClose={() => {
          setIsExpenseDeleteModalOpen(false);
          setDeletingExpenseObj(null);
        }} 
        title="Confirm Expense Deletion"
      >
        <div className="space-y-4 text-sm">
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Are you sure you want to delete this expense claim?</p>
              <p className="text-xs text-rose-300/80 mt-1">This action is permanent and will remove the center expense log from accounting registers.</p>
            </div>
          </div>

          {deletingExpenseObj && (
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-300 font-mono">
              <p><span className="text-slate-500">Title:</span> <span className="text-white font-semibold">{deletingExpenseObj.title}</span></p>
              <p><span className="text-slate-500">Amount:</span> <span className="text-white font-semibold">₹{deletingExpenseObj.amount?.toLocaleString()}</span></p>
              <p><span className="text-slate-500">Date:</span> {deletingExpenseObj.date}</p>
              <p><span className="text-slate-500">Status:</span> {deletingExpenseObj.status}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => {
                setIsExpenseDeleteModalOpen(false);
                setDeletingExpenseObj(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleConfirmDeleteExpense}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 py-2.5 font-semibold transition-all shadow-md hover:shadow-rose-500/20 flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Delete Expense
            </button>
          </div>
        </div>
      </Modal>

      {/* 6. Log Payment Modal */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPaymentModalData(null);
        }} 
        title="Log Invoice Payment"
      >
        {paymentModalData && (
          <form onSubmit={handleLogPaymentSubmit} className="space-y-4 text-sm">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Student:</span>
                <span className="text-white font-semibold">{paymentModalData.studentName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Invoice:</span>
                <span className="text-white font-mono">{paymentModalData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/60">
                <span className="text-slate-400">Amount Due:</span>
                <span className="text-emerald-400 font-bold text-base">{paymentModalData.amount.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-2">Payment Method</label>
              <select 
                name="payMethod"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none"
                defaultValue="Cash"
              >
                <option value="Cash">Cash</option>
                <option value="Credit/Debit Card">Credit/Debit Card</option>
                <option value="UPI / Wallet">UPI / Wallet</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            
            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setPaymentModalData(null);
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold transition-all duration-200"
              >
                Confirm Payment
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* 7. Transaction Details Modal */}
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setViewingTransaction(null);
        }}
        title="Transaction Details"
      >
        {viewingTransaction && (
          <div className="space-y-6 text-sm">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Student Name:</span>
                <span className="text-white font-bold">{viewingTransaction.studentName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Roll Number:</span>
                <span className="text-white font-mono">{viewingTransaction.studentRoll}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Transaction Date:</span>
                <span className="text-white">{viewingTransaction.date}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Receipt Number:</span>
                <span className="text-white font-mono">{viewingTransaction.receiptNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Payment Method:</span>
                <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-700 uppercase">
                  {viewingTransaction.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/60">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="text-emerald-400 font-extrabold text-lg">{viewingTransaction.amount.toLocaleString()}</span>
              </div>
            </div>

            {viewingTransaction.upiScreenshot && (
              <div className="space-y-2">
                <label className="block text-slate-400 font-medium">Payment Screenshot</label>
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 p-2 flex justify-center items-center">
                  <img 
                    src={viewingTransaction.upiScreenshot} 
                    alt="UPI Screenshot" 
                    className="max-h-[300px] object-contain rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <a 
                    href={viewingTransaction.upiScreenshot} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1.5"
                  >
                    Open in New Tab
                  </a>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button 
                onClick={() => {
                  setIsTransactionModalOpen(false);
                  setViewingTransaction(null);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 8. Image Crop Modal */}
      <Modal
        isOpen={cropModalOpen}
        onClose={() => { setCropModalOpen(false); setCropImageSrc(''); }}
        title="Adjust & Crop Picture"
      >
        <div className="space-y-6 text-sm">
          <p className="text-xs text-slate-400">Drag/Pan the image inside the frame, use the zoom slider to resize, and click Crop to confirm.</p>
          
          {/* Crop Container */}
          <div 
            className="w-full h-64 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-center cursor-move border border-slate-800"
            onMouseDown={(e) => {
              setIsDraggingCrop(true);
              setDragStartCrop({ x: e.clientX - cropPan.x, y: e.clientY - cropPan.y });
            }}
            onMouseMove={(e) => {
              if (isDraggingCrop) {
                setCropPan({
                  x: e.clientX - dragStartCrop.x,
                  y: e.clientY - dragStartCrop.y
                });
              }
            }}
            onMouseUp={() => setIsDraggingCrop(false)}
            onMouseLeave={() => setIsDraggingCrop(false)}
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                setIsDraggingCrop(true);
                setDragStartCrop({ x: e.touches[0].clientX - cropPan.x, y: e.touches[0].clientY - cropPan.y });
              }
            }}
            onTouchMove={(e) => {
              if (isDraggingCrop && e.touches.length === 1) {
                setCropPan({
                  x: e.touches[0].clientX - dragStartCrop.x,
                  y: e.touches[0].clientY - dragStartCrop.y
                });
              }
            }}
            onTouchEnd={() => setIsDraggingCrop(false)}
          >
            {/* The Image */}
            {cropImageSrc && (
              <img
                src={cropImageSrc}
                alt="Original"
                draggable={false}
                style={{
                  transform: `translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropZoom})`,
                  transformOrigin: 'center center',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
            )}

            {/* Target Aspect Crop Box Outline overlay */}
            <div 
              className={`absolute inset-0 m-auto border-2 border-dashed border-blue-500/80 pointer-events-none rounded-lg bg-transparent shadow-[0_0_0_9999px_rgba(15,23,42,0.65)]`}
              style={{
                width: Math.abs(cropAspect - 1) < 0.05 ? '160px' : Math.abs(cropAspect - 4/3) < 0.05 ? '200px' : Math.abs(cropAspect - 3/4) < 0.05 ? '135px' : '220px',
                height: Math.abs(cropAspect - 1) < 0.05 ? '160px' : Math.abs(cropAspect - 4/3) < 0.05 ? '150px' : Math.abs(cropAspect - 3/4) < 0.05 ? '180px' : '124px',
              }}
            />
          </div>

          {/* Select Aspect Ratio / Size */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Crop Ratio / Size</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCropAspect(1)}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                  Math.abs(cropAspect - 1) < 0.05 ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Square (1:1)
              </button>
              <button
                type="button"
                onClick={() => setCropAspect(4/3)}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                  Math.abs(cropAspect - 4/3) < 0.05 ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ID Card (4:3)
              </button>
              <button
                type="button"
                onClick={() => setCropAspect(3/4)}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                  Math.abs(cropAspect - 3/4) < 0.05 ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Portrait (3:4)
              </button>
              <button
                type="button"
                onClick={() => setCropAspect(16/9)}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                  Math.abs(cropAspect - 16/9) < 0.05 ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Wide (16:9)
              </button>
            </div>
          </div>

          {/* Zoom Slider Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Zoom Factor</span>
              <span className="font-mono text-white font-semibold">{Math.round(cropZoom * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="4" 
              step="0.05" 
              value={cropZoom} 
              onChange={(e) => setCropZoom(parseFloat(e.target.value))} 
              className="w-full accent-blue-500 bg-slate-900 border border-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => { setCropModalOpen(false); setCropImageSrc(''); }}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handlePerformCrop}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </Modal>

      {/* 9. Lightbox View & Download Modal */}
      <Modal
        isOpen={lightboxOpen}
        onClose={() => { setLightboxOpen(false); setLightboxSrc(''); }}
        title="Document Preview"
      >
        {lightboxSrc && (
          <div className="space-y-4 text-center">
            <div className="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950 p-2 flex justify-center items-center">
              <img src={lightboxSrc} alt="Document Preview" className="max-h-[50vh] object-contain rounded-xl" />
            </div>
            <div className="flex gap-3">
              <a 
                href={lightboxSrc} 
                download={lightboxFilename} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer block text-center text-sm"
              >
                Download File
              </a>
              <button 
                type="button" 
                onClick={() => setLightboxOpen(false)}
                className="flex-1 bg-slate-850 hover:bg-slate-800 text-white rounded-xl py-3 font-semibold transition-all duration-200 cursor-pointer text-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* COURSE ADD/EDIT MODAL */}
      <Modal
        isOpen={isCourseFormModalOpen}
        onClose={() => { setIsCourseFormModalOpen(false); setEditingCourseObj(null); setCourseForm({ name: '', duration: '6 Months', fee: '', details: '' }); }}
        title={courseFormMode === 'add' ? 'Add New Course' : 'Edit Course'}
      >
        <form onSubmit={handleCourseSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1 text-sm">Course Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Full-Stack Web Development"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 placeholder-slate-600"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1 text-sm">Duration *</label>
              <select
                required
                value={courseForm.duration}
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500"
              >
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="4 Months">4 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="8 Months">8 Months</option>
                <option value="12 Months">12 Months (1 Year)</option>
                <option value="18 Months">18 Months</option>
                <option value="24 Months">24 Months (2 Years)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1 text-sm">Total Tuition Fee *</label>
              <input
                type="number"
                required
                min="0"
                step="500"
                placeholder="e.g. 45000"
                value={courseForm.fee}
                onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 placeholder-slate-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1 text-sm">Course Description / Syllabus</label>
              <textarea
                rows={4}
                placeholder="Brief overview of what students will learn, syllabus highlights, career outcomes..."
                value={courseForm.details}
                onChange={(e) => setCourseForm({ ...courseForm, details: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 placeholder-slate-600 resize-none"
              />
            </div>
          </div>
          {courseForm.fee && (
            <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-violet-300 font-medium">Tuition Preview</span>
              <span className="text-white font-extrabold text-base">{parseFloat(courseForm.fee || 0).toLocaleString()}</span>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setIsCourseFormModalOpen(false); setEditingCourseObj(null); }}
              className="flex-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-xl py-3 font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 font-semibold transition-all cursor-pointer"
            >
              {courseFormMode === 'add' ? 'Add Course' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-slate-800/80 shrink-0">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
