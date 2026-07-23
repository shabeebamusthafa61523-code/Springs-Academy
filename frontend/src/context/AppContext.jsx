import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);
export const API_URL = import.meta.env.VITE_API_URL || 'https://springs-academy.onrender.com';

// Initial state for fallback local storage mode
const initialStudents = [
  {
    _id: "s1",
    rollNumber: "AG-2026-ST001",
    name: "Alice Johnson",
    email: "alice@example.com",
    batchId: "BATCH-WEB-01",
    courseName: "Full-Stack Web Development",
    status: "Active",
    ledger: {
      totalPackageAmount: 60000,
      amountPaid: 20000,
      balanceDue: 40000,
      paymentStatus: "Partially Paid"
    },
    invoices: [
      { _id: "inv1", invoiceNumber: "INV-2026-00001", amount: 20000, dueDate: "2026-06-15", status: "Paid", paymentMethod: "Bank Transfer", paidOn: "2026-06-14", particulars: "First Installment - Course Tuition Fee" },
      { _id: "inv2", invoiceNumber: "INV-2026-00002", amount: 20000, dueDate: "2026-08-15", status: "Pending", paymentMethod: "N/A", paidOn: null, particulars: "Second Installment - Course Tuition Fee" },
      { _id: "inv3", invoiceNumber: "INV-2026-00003", amount: 20000, dueDate: "2026-10-15", status: "Pending", paymentMethod: "N/A", paidOn: null, particulars: "Third Installment - Course Tuition Fee" }
    ]
  },
  {
    _id: "s2",
    rollNumber: "AG-2026-ST002",
    name: "Charlie Smith",
    email: "charlie@example.com",
    batchId: "BATCH-MOBILE-02",
    courseName: "Mobile App Development",
    status: "Active",
    ledger: {
      totalPackageAmount: 50000,
      amountPaid: 0,
      balanceDue: 50000,
      paymentStatus: "Unpaid"
    },
    invoices: [
      { _id: "inv4", invoiceNumber: "INV-2026-00004", amount: 25000, dueDate: "2026-07-20", status: "Pending", paymentMethod: "N/A", paidOn: null, particulars: "First Installment - Mobile Course" },
      { _id: "inv5", invoiceNumber: "INV-2026-00005", amount: 25000, dueDate: "2026-09-20", status: "Pending", paymentMethod: "N/A", paidOn: null, particulars: "Second Installment - Mobile Course" }
    ]
  }
];

const initialEmployees = [
  { _id: "emp1", name: "Coordinator Alex", email: "finance@academy.com", role: "Admin", department: "Finance & HR", designation: "Accounts Manager", salary: 60000 },
  { _id: "emp2", name: "Instructor Bob", email: "faculty@academy.com", role: "Employee", department: "Academic", designation: "Lead Web Instructor", salary: 45000, teachingHours: 32 }
];

const initialExpenses = [
  { _id: "exp1", employeeId: { _id: "emp2", name: "Instructor Bob", email: "faculty@academy.com", department: "Academic" }, title: "Whiteboard Markers & Stationary", amount: 1500, date: "2026-07-10", status: "Approved", description: "Supplies for Classroom 3B" },
  { _id: "exp2", employeeId: { _id: "emp2", name: "Instructor Bob", email: "faculty@academy.com", department: "Academic" }, title: "Lab Router Replacement", amount: 5400, date: "2026-07-15", status: "Pending", description: "Replacement of faulty lab gateway" }
];

const initialCourses = [
  { _id: "c1", name: "PDCA",       duration: "3 Months", fee: 10500, details: "Professional Diploma in Computer Applications — foundational computing and office productivity." },
  { _id: "c2", name: "CCAP",       duration: "6 Months", fee: 25500, details: "Comprehensive Certificate in Advanced Programming — core programming concepts and web basics." },
  { _id: "c3", name: "CCAP (F)",   duration: "8 Months", fee: 32500, details: "CCAP with Full-Stack specialisation — extends CCAP with front-end and back-end development." },
  { _id: "c4", name: "CCAP PLUS",  duration: "12 Months", fee: 45500, details: "CCAP Plus — the most advanced track covering full-stack development, cloud, and project management." }
];

export const AppProvider = ({ children }) => {
  // Session Storage for Active Auth Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = sessionStorage.getItem('agy_session_user');
      return savedSession ? JSON.parse(savedSession) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('agy_session_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('agy_session_user');
    }
  }, [currentUser]);

  // Clean up legacy database data from localStorage (so database data stays purely in MongoDB Atlas)
  useEffect(() => {
    const legacyKeys = ['agy_users', 'agy_students', 'agy_employees', 'agy_expenses', 'agy_courses', 'agy_extra_incomes'];
    legacyKeys.forEach(key => localStorage.removeItem(key));
  }, []);

  const [users, setUsers] = useState([]);

  const [students, setStudents] = useState(initialStudents);
  const [employees, setEmployees] = useState(initialEmployees);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [courses, setCourses] = useState(initialCourses);
  const [extraIncomes, setExtraIncomes] = useState([]);

  // Cloudinary Image Upload Helper
  const uploadToCloudinary = async (base64String, folder = 'springs_academy') => {
    if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:image')) {
      return base64String;
    }
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64String, folder })
      });
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    } catch (err) {
      console.warn("Cloudinary Upload Warning:", err);
    }
    return base64String;
  };

  // Fetch Live Data directly from MongoDB Atlas backend API on load
  useEffect(() => {
    const fetchAtlasData = async () => {
      try {
        const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};

        // 1. Fetch Students
        const studentRes = await fetch(`${API_URL}/api/students`, { headers }).catch(() => null);
        if (studentRes && studentRes.ok) {
          const studentData = await studentRes.json();
          if (studentData && studentData.length > 0) setStudents(studentData);
        }

        // 2. Fetch Employees
        const empRes = await fetch(`${API_URL}/api/admin/employees`, { headers }).catch(() => null);
        if (empRes && empRes.ok) {
          const empData = await empRes.json();
          if (empData && empData.length > 0) setEmployees(empData);
        }

        // 3. Fetch Expenses
        const expRes = await fetch(`${API_URL}/api/admin/expenses`, { headers }).catch(() => null);
        if (expRes && expRes.ok) {
          const expData = await expRes.json();
          if (expData && expData.length > 0) setExpenses(expData);
        }

        // 4. Fetch Courses
        const courseRes = await fetch(`${API_URL}/api/courses`).catch(() => null);
        if (courseRes && courseRes.ok) {
          const courseData = await courseRes.json();
          if (courseData && courseData.length > 0) setCourses(courseData);
        }

        // 5. Fetch Extra Incomes
        const incomeRes = await fetch(`${API_URL}/api/extra-incomes`).catch(() => null);
        if (incomeRes && incomeRes.ok) {
          const incomeData = await incomeRes.json();
          if (incomeData && incomeData.length > 0) setExtraIncomes(incomeData);
        }
      } catch (err) {
        console.warn("Notice: Operating on live fallback database state:", err);
      }
    };
    fetchAtlasData();
  }, [currentUser]);

  // Auth Actions
  const login = (username, password) => {
    const cleanUsername = (username || '').trim().toLowerCase();
    const user = users.find(u => (u.username?.toLowerCase() === cleanUsername || u.name?.toLowerCase() === cleanUsername || u.email?.toLowerCase() === cleanUsername) && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    // Fallback for default seed accounts if database is empty
    if ((cleanUsername === 'admin' && password === 'password') || (cleanUsername === 'owner@academy.com' && password === 'password123')) {
      const defaultUser = { _id: 'owner1', username: 'admin', password: 'password', name: 'Director Jane', email: 'owner@academy.com', role: 'Super Admin', department: 'Executive', designation: 'Academy Director', salary: 120000 };
      setCurrentUser(defaultUser);
      return true;
    }
    if ((cleanUsername === 'admin123' && password === 'password123') || (cleanUsername === 'finance@academy.com' && password === 'password123')) {
      const defaultAdmin = { _id: 'admin1', username: 'admin123', password: 'password123', name: 'Accounts Manager', email: 'finance@academy.com', role: 'Admin', department: 'Finance & HR', designation: 'Accounts Manager', salary: 60000 };
      setCurrentUser(defaultAdmin);
      return true;
    }
    return false;
  };

  const register = async (username, password, role = 'Super Admin') => {
    const cleanUsername = (username || '').trim();
    const userEmail = `${cleanUsername.toLowerCase().replace(/\s+/g, '')}@academy.com`;
    const defaultDept = role === 'Super Admin' ? 'Executive' : 'Finance & HR';
    const defaultDesig = role === 'Super Admin' ? 'Academy Director' : 'Accounts Manager';
    const defaultSalary = role === 'Super Admin' ? 120000 : 60000;

    // Try backend API registration first
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanUsername,
          username: cleanUsername,
          email: userEmail,
          password,
          role: role || 'Super Admin',
          department: defaultDept,
          designation: defaultDesig,
          salary: defaultSalary
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data && data._id) {
        const registeredUser = {
          _id: data._id,
          username: data.username || cleanUsername,
          name: data.name || cleanUsername,
          email: data.email || userEmail,
          password,
          role: data.role || role,
          department: data.department || defaultDept,
          designation: data.designation || defaultDesig,
          salary: data.salary || defaultSalary
        };
        setUsers(prev => {
          const filtered = prev.filter(u => u.username?.toLowerCase() !== cleanUsername.toLowerCase());
          return [...filtered, registeredUser];
        });
        return registeredUser;
      } else if (!res.ok && data && data.message) {
        return { error: data.message };
      }
    } catch (err) {
      console.warn("Backend API sync warning:", err);
    }

    // Local fallback check
    if (users.find(u => u.username && u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      return { error: `Username '${cleanUsername}' already exists. Please choose another.` };
    }

    const newUser = {
      _id: 'u_' + Math.random().toString(36).substr(2, 9),
      username: cleanUsername,
      name: cleanUsername,
      email: userEmail,
      password,
      role: role || 'Super Admin',
      department: defaultDept,
      designation: defaultDesig,
      salary: defaultSalary
    };

    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addStudent = async (studentData) => {
    // 1. Upload student photos to Cloudinary if base64 provided
    const profileImage = await uploadToCloudinary(studentData.profileImage, 'students/profiles');
    const idPhoto = await uploadToCloudinary(studentData.idPhoto, 'students/ids');
    const sslcPhoto = await uploadToCloudinary(studentData.sslcPhoto, 'students/sslc');

    const preparedPayload = {
      ...studentData,
      profileImage,
      idPhoto,
      sslcPhoto
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }

      const res = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers,
        body: JSON.stringify(preparedPayload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.student) {
          const createdStudent = {
            ...data.student,
            ledger: data.ledger || {
              totalPackageAmount: studentData.totalPackageAmount,
              amountPaid: 0,
              balanceDue: studentData.totalPackageAmount,
              paymentStatus: "Unpaid"
            },
            invoices: data.invoices || [],
            payments: []
          };
          setStudents(prev => [...prev.filter(s => s._id !== createdStudent._id), createdStudent]);
          return createdStudent;
        }
      }
    } catch (err) {
      console.warn("MongoDB Atlas student registration warning:", err);
    }

    const newId = 'st_' + Math.random().toString(36).substr(2, 9);
    const rollNumber = `AG-2026-ST${String(students.length + 1).padStart(3, '0')}`;
    
    // Invoices
    const invoices = [];
    const installmentCount = parseInt(studentData.installmentCount) || 3;
    const amountPerInstallment = Math.round(studentData.totalPackageAmount / installmentCount);
    
    for (let i = 0; i < installmentCount; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (i * 30));
      invoices.push({
        _id: 'inv_' + Math.random().toString(36).substr(2, 9),
        invoiceNumber: `INV-2026-${String(Math.floor(10000 + Math.random() * 90000))}`,
        amount: amountPerInstallment,
        dueDate: dueDate.toISOString().split('T')[0],
        status: "Pending",
        paymentMethod: "N/A",
        paidOn: null,
        particulars: `${i === 0 ? 'First' : i === 1 ? 'Second' : 'Third'} Installment - Course Tuition Fee`
      });
    }

    const newStudent = {
      _id: newId,
      rollNumber: studentData.customId || rollNumber,
      name: studentData.name,
      email: studentData.email,
      dob: studentData.dob || '',
      phoneNumber: studentData.phoneNumber || '',
      fatherName: studentData.fatherName || '',
      motherName: studentData.motherName || '',
      parentsPhone: studentData.parentsPhone || '',
      address: studentData.address || '',
      qualification: studentData.qualification || '',
      profileImage: studentData.profileImage || null,
      idPhoto: studentData.idPhoto || null,
      sslcPhoto: studentData.sslcPhoto || null,
      batchId: studentData.batchId,
      courseName: studentData.courseName,
      status: "Active",
      isConfidentialFee: Boolean(studentData.isConfidentialFee),
      ledger: {
        totalPackageAmount: studentData.totalPackageAmount,
        amountPaid: 0,
        balanceDue: studentData.totalPackageAmount,
        paymentStatus: "Unpaid"
      },
      invoices,
      payments: []
    };

    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const editStudent = (studentId, updatedData) => {
    setStudents(prev => prev.map(s => {
      if (s._id === studentId) {
        return {
          ...s,
          name: updatedData.name || s.name,
          email: updatedData.email || s.email,
          rollNumber: updatedData.rollNumber || s.rollNumber,
          dob: updatedData.dob !== undefined ? updatedData.dob : s.dob,
          phoneNumber: updatedData.phoneNumber !== undefined ? updatedData.phoneNumber : s.phoneNumber,
          fatherName: updatedData.fatherName !== undefined ? updatedData.fatherName : s.fatherName,
          motherName: updatedData.motherName !== undefined ? updatedData.motherName : s.motherName,
          parentsPhone: updatedData.parentsPhone !== undefined ? updatedData.parentsPhone : s.parentsPhone,
          address: updatedData.address !== undefined ? updatedData.address : s.address,
          qualification: updatedData.qualification !== undefined ? updatedData.qualification : s.qualification,
          courseName: updatedData.courseName || s.courseName,
          batchId: updatedData.batchId || s.batchId,
          isConfidentialFee: updatedData.isConfidentialFee !== undefined ? Boolean(updatedData.isConfidentialFee) : s.isConfidentialFee,
          profileImage: updatedData.profileImage !== undefined ? updatedData.profileImage : s.profileImage,
          idPhoto: updatedData.idPhoto !== undefined ? updatedData.idPhoto : s.idPhoto,
          sslcPhoto: updatedData.sslcPhoto !== undefined ? updatedData.sslcPhoto : s.sslcPhoto,
        };
      }
      return s;
    }));
  };

  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(s => s._id !== studentId));
  };

  const addInstallment = (studentId, amount, description, dueDate) => {
    setStudents(prev => prev.map(s => {
      if (s._id === studentId) {
        const newInvoice = {
          _id: 'inv_' + Math.random().toString(36).substr(2, 9),
          invoiceNumber: `INV-2026-${String(Math.floor(10000 + Math.random() * 90000))}`,
          amount: parseFloat(amount),
          dueDate: dueDate || new Date().toISOString().split('T')[0],
          status: "Pending",
          paymentMethod: "N/A",
          paidOn: null,
          particulars: description || 'Additional Installment/Fee'
        };
        
        // Update ledger total package amount
        const newTotalAmount = s.ledger.totalPackageAmount + parseFloat(amount);
        const newBalanceDue = s.ledger.balanceDue + parseFloat(amount);
        const newPaymentStatus = newBalanceDue === 0 ? 'Fully Paid' : s.ledger.amountPaid > 0 ? 'Partially Paid' : 'Unpaid';

        return {
          ...s,
          invoices: [...s.invoices, newInvoice],
          ledger: {
            ...s.ledger,
            totalPackageAmount: newTotalAmount,
            balanceDue: newBalanceDue,
            paymentStatus: newPaymentStatus
          }
        };
      }
      return s;
    }));
  };

  const makePayment = (studentId, amount, date, paymentMethod, upiScreenshot) => {
    setStudents(prev => prev.map(s => {
      if (s._id === studentId) {
        const newPayment = {
          _id: 'pay_' + Math.random().toString(36).substr(2, 9),
          receiptNumber: `REC-2026-${String(Math.floor(10000 + Math.random() * 90000))}`,
          amount: parseFloat(amount),
          date: date || new Date().toISOString().split('T')[0],
          paymentMethod: paymentMethod || 'Cash',
          upiScreenshot: upiScreenshot || null
        };

        const newAmountPaid = s.ledger.amountPaid + parseFloat(amount);
        const newBalanceDue = Math.max(0, s.ledger.totalPackageAmount - newAmountPaid);
        const newPaymentStatus = newBalanceDue === 0 ? 'Fully Paid' : 'Partially Paid';

        return {
          ...s,
          payments: [...(s.payments || []), newPayment],
          ledger: {
            ...s.ledger,
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue,
            paymentStatus: newPaymentStatus
          }
        };
      }
      return s;
    }));
  };

  const editPayment = (studentId, paymentId, updatedData) => {
    setStudents(prev => prev.map(s => {
      if (s._id === studentId) {
        const updatedPayments = (s.payments || []).map(p => {
          if (p._id === paymentId) {
            return {
              ...p,
              amount: parseFloat(updatedData.amount) || p.amount,
              date: updatedData.date || p.date,
              paymentMethod: updatedData.paymentMethod || p.paymentMethod
            };
          }
          return p;
        });

        const newAmountPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
        const newBalanceDue = Math.max(0, s.ledger.totalPackageAmount - newAmountPaid);
        const newPaymentStatus = newBalanceDue === 0 ? 'Fully Paid' : (newAmountPaid > 0 ? 'Partially Paid' : 'Pending');

        return {
          ...s,
          payments: updatedPayments,
          ledger: {
            ...s.ledger,
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue,
            paymentStatus: newPaymentStatus
          }
        };
      }
      return s;
    }));
  };

  const markInvoicePaid = (studentId, invoiceId, paymentMethod) => {
    setStudents(prev => prev.map(s => {
      if (s._id === studentId) {
        const updatedInvoices = s.invoices.map(inv => {
          if (inv._id === invoiceId) {
            return {
              ...inv,
              status: 'Paid',
              paymentMethod: paymentMethod || 'Cash',
              paidOn: new Date().toISOString().split('T')[0]
            };
          }
          return inv;
        });

        // Recalculate ledger
        const amountPaid = updatedInvoices
          .filter(inv => inv.status === 'Paid')
          .reduce((sum, inv) => sum + inv.amount, 0);
        
        const balanceDue = Math.max(0, s.ledger.totalPackageAmount - amountPaid);
        const paymentStatus = balanceDue === 0 ? 'Fully Paid' : amountPaid > 0 ? 'Partially Paid' : 'Unpaid';

        return {
          ...s,
          invoices: updatedInvoices,
          ledger: {
            ...s.ledger,
            amountPaid,
            balanceDue,
            paymentStatus
          }
        };
      }
      return s;
    }));
  };

  const overrideStudentLedger = (studentId, overrideData) => {
    setStudents(prev => prev.map(s => {
      if (s._id === studentId) {
        let newTotal = s.ledger.totalPackageAmount;
        if (overrideData.discountAmount) {
          newTotal = Math.max(0, newTotal - parseFloat(overrideData.discountAmount));
        }
        if (overrideData.newPackageAmount) {
          newTotal = parseFloat(overrideData.newPackageAmount);
        }

        let newBalance = newTotal - s.ledger.amountPaid;
        if (overrideData.writeOffAmount) {
          newBalance = Math.max(0, newBalance - parseFloat(overrideData.writeOffAmount));
        }

        const paymentStatus = newBalance === 0 ? 'Fully Paid' : s.ledger.amountPaid > 0 ? 'Partially Paid' : 'Unpaid';

        return {
          ...s,
          ledger: {
            ...s.ledger,
            totalPackageAmount: newTotal,
            balanceDue: newBalance,
            paymentStatus
          }
        };
      }
      return s;
    }));
  };

  const addEmployee = async (empData) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      const res = await fetch(`${API_URL}/api/admin/employees`, {
        method: 'POST',
        headers,
        body: JSON.stringify(empData)
      });
      if (res.ok) {
        const createdEmp = await res.json();
        setEmployees(prev => [...prev, createdEmp]);
        return createdEmp;
      }
    } catch (err) {
      console.warn("MongoDB Atlas employee creation warning:", err);
    }

    const empId = 'emp_' + Math.random().toString(36).substr(2, 9);
    const newEmp = {
      _id: empId,
      name: empData.name,
      email: empData.email,
      role: empData.role || 'Employee',
      department: empData.department,
      designation: empData.designation,
      salary: parseFloat(empData.salary) || 0,
      phoneNumber: empData.phoneNumber || '',
      address: empData.address || '',
      qualification: empData.qualification || '',
      username: empData.username || '',
      password: empData.password || '',
      profileImage: empData.profileImage || null,
      teachingHours: 0
    };
    setEmployees(prev => [...prev, newEmp]);
  };

  const deleteEmployee = (empId) => {
    setEmployees(prev => prev.filter(e => e._id !== empId));
  };

  const updateEmployeeHRRecord = async (empId, hrData) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      await fetch(`${API_URL}/api/admin/employees/${empId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(hrData)
      });
    } catch (err) {
      console.warn("MongoDB Atlas employee HR update warning:", err);
    }

    setEmployees(prev => prev.map(e => {
      if (e._id === empId) {
        return {
          ...e,
          name: hrData.name || e.name,
          email: hrData.email || e.email,
          role: hrData.role || e.role,
          department: hrData.department || e.department,
          designation: hrData.designation || e.designation,
          salary: hrData.salary ? parseFloat(hrData.salary) : e.salary,
          phoneNumber: hrData.phoneNumber !== undefined ? hrData.phoneNumber : e.phoneNumber,
          address: hrData.address !== undefined ? hrData.address : e.address,
          qualification: hrData.qualification !== undefined ? hrData.qualification : e.qualification,
          username: hrData.username !== undefined ? hrData.username : e.username,
          password: hrData.password !== undefined ? hrData.password : e.password,
          profileImage: hrData.profileImage !== undefined ? hrData.profileImage : e.profileImage
        };
      }
      return e;
    }));
  };

  const fileExpenseClaim = async (expenseData) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      const res = await fetch(`${API_URL}/api/admin/expenses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(expenseData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.claim) {
          setExpenses(prev => [...prev, data.claim]);
          return data.claim;
        }
      }
    } catch (err) {
      console.warn("MongoDB Atlas expense submission warning:", err);
    }

    const newExpense = {
      _id: 'exp_' + Math.random().toString(36).substr(2, 9),
      employeeId: {
        _id: currentUser?._id || 'emp_user',
        name: currentUser?.name || 'Staff Member',
        email: currentUser?.email || 'staff@academy.com',
        department: currentUser?.department || 'Operations'
      },
      title: expenseData.title,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date || new Date().toISOString().split('T')[0],
      status: expenseData.status || 'Pending',
      description: expenseData.description || ''
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const editExpenseClaim = async (expenseId, updatedData) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      await fetch(`${API_URL}/api/admin/expenses/${expenseId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      console.warn("MongoDB Atlas expense update warning:", err);
    }

    setExpenses(prev => prev.map(exp => {
      if (exp._id === expenseId) {
        return {
          ...exp,
          title: updatedData.title !== undefined ? updatedData.title : exp.title,
          amount: updatedData.amount !== undefined ? parseFloat(updatedData.amount) : exp.amount,
          date: updatedData.date !== undefined ? updatedData.date : exp.date,
          status: updatedData.status !== undefined ? updatedData.status : exp.status,
          description: updatedData.description !== undefined ? updatedData.description : exp.description,
        };
      }
      return exp;
    }));
  };

  const deleteExpenseClaim = async (expenseId) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      await fetch(`${API_URL}/api/admin/expenses/${expenseId}`, {
        method: 'DELETE',
        headers
      });
    } catch (err) {
      console.warn("MongoDB Atlas expense delete warning:", err);
    }

    setExpenses(prev => prev.filter(exp => exp._id !== expenseId));
  };

  const reviewExpense = async (expenseId, status) => {
    await editExpenseClaim(expenseId, { status });
  };

  const addCourse = async (courseData) => {
    try {
      const res = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (res.ok) {
        const createdCourse = await res.json();
        setCourses(prev => [...prev, createdCourse]);
        return createdCourse;
      }
    } catch (err) {
      console.warn("MongoDB Atlas course creation warning:", err);
    }

    const newCourse = {
      _id: 'c_' + Math.random().toString(36).substr(2, 9),
      name: courseData.name,
      duration: courseData.duration || '6 Months',
      fee: parseFloat(courseData.fee) || 0,
      details: courseData.details || ''
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const editCourse = async (courseId, updatedData) => {
    try {
      await fetch(`${API_URL}/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      console.warn("MongoDB Atlas course update warning:", err);
    }

    setCourses(prev => prev.map(c => c._id === courseId ? { 
      ...c, 
      name: updatedData.name,
      duration: updatedData.duration || c.duration,
      fee: parseFloat(updatedData.fee) || c.fee,
      details: updatedData.details || c.details
    } : c));
  };

  const deleteCourse = async (courseId) => {
    try {
      await fetch(`${API_URL}/api/courses/${courseId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("MongoDB Atlas course delete warning:", err);
    }

    setCourses(prev => prev.filter(c => c._id !== courseId));
  };

  const addExtraIncome = async (incomeData) => {
    try {
      const res = await fetch(`${API_URL}/api/extra-incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomeData)
      });
      if (res.ok) {
        const createdIncome = await res.json();
        setExtraIncomes(prev => [...prev, createdIncome]);
        return createdIncome;
      }
    } catch (err) {
      console.warn("MongoDB Atlas extra income creation warning:", err);
    }

    const newIncome = {
      _id: 'inc_' + Math.random().toString(36).substr(2, 9),
      amount: parseFloat(incomeData.amount),
      source: incomeData.source || 'Miscellaneous',
      details: incomeData.details || '',
      date: incomeData.date || new Date().toISOString().split('T')[0],
      paymentMethod: incomeData.paymentMethod || 'Cash'
    };
    setExtraIncomes(prev => [...prev, newIncome]);
  };

  const deleteExtraIncome = async (incomeId) => {
    try {
      await fetch(`${API_URL}/api/extra-incomes/${incomeId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("MongoDB Atlas extra income delete warning:", err);
    }

    setExtraIncomes(prev => prev.filter(i => i._id !== incomeId));
  };

  // Stats
  const getStats = (userRole = currentUser?.role) => {
    const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
    // If not Super Admin, exclude confidential fee students from revenue / collection statistics
    const statsStudents = userRole === 'Super Admin' ? students : students.filter(s => !s.isConfidentialFee);
    const totalCourseRevenue = statsStudents.reduce((sum, s) => sum + (s.ledger?.totalPackageAmount || 0), 0);
    const totalCollected = statsStudents.reduce((sum, s) => sum + (s.ledger?.amountPaid || 0), 0);
    const totalOutstanding = statsStudents.reduce((sum, s) => sum + (s.ledger?.balanceDue || 0), 0);
    const totalExpenses = expenses
      .filter(exp => exp.status === 'Approved')
      .reduce((sum, exp) => sum + exp.amount, 0);
    const totalExtraIncome = extraIncomes.reduce((sum, i) => sum + i.amount, 0);

    return {
      totalPayroll,
      totalCourseRevenue,
      totalCollected: totalCollected + totalExtraIncome,
      totalOutstanding,
      totalExpenses,
      netProfit: (totalCollected + totalExtraIncome) - totalPayroll - totalExpenses
    };
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      students,
      addStudent,
      editStudent,
      deleteStudent,
      addInstallment,
      makePayment,
      editPayment,
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
      deleteExtraIncome,
      getStats
    }}>
      {children}
    </AppContext.Provider>
  );
};
