import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

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
  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('agy_users');
    return saved ? JSON.parse(saved) : [
      { _id: 'owner1', username: 'admin', password: 'password', name: 'Director Jane', email: 'owner@academy.com', role: 'Super Admin', department: 'Executive', designation: 'Academy Director', salary: 120000 }
    ];
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('agy_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('agy_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('agy_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('agy_courses');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If still holding old demo courses, reset to new real data
      const oldNames = ['Full-Stack Web Development', 'Mobile App Development', 'Data Science & AI'];
      const hasOld = parsed.some(c => oldNames.includes(c.name));
      if (hasOld) {
        localStorage.removeItem('agy_courses');
        return initialCourses;
      }
      return parsed;
    }
    return initialCourses;
  });

  const [extraIncomes, setExtraIncomes] = useState(() => {
    const saved = localStorage.getItem('agy_extra_incomes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agy_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('agy_extra_incomes', JSON.stringify(extraIncomes));
  }, [extraIncomes]);

  useEffect(() => {
    localStorage.setItem('agy_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('agy_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('agy_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('agy_courses', JSON.stringify(courses));
  }, [courses]);

  // Auth Actions
  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (username, password) => {
    if (users.find(u => u.username === username)) {
      return false; // Username exists
    }
    const newUser = {
      _id: 'u_' + Math.random().toString(36).substr(2, 9),
      username,
      password,
      name: username,
      email: `${username}@academy.com`,
      role: 'Super Admin', // Default role for mock testing
      department: 'Executive',
      designation: 'Academy Director',
      salary: 120000
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addStudent = (studentData) => {
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

  const addEmployee = (empData) => {
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

    if (empData.username && empData.password) {
      const newUser = {
        _id: 'u_' + Math.random().toString(36).substr(2, 9),
        username: empData.username,
        password: empData.password,
        name: empData.name,
        email: empData.email,
        role: empData.role || 'Employee',
        department: empData.department,
        designation: empData.designation,
        salary: parseFloat(empData.salary) || 0,
        employeeId: empId
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const deleteEmployee = (empId) => {
    setEmployees(prev => prev.filter(e => e._id !== empId));
  };

  const updateEmployeeHRRecord = (empId, hrData) => {
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

    setUsers(prev => prev.map(u => {
      if (u.employeeId === empId) {
        return {
          ...u,
          username: hrData.username || u.username,
          password: hrData.password || u.password,
          name: hrData.name || u.name,
          email: hrData.email || u.email,
          role: hrData.role || u.role,
          department: hrData.department || u.department,
          designation: hrData.designation || u.designation,
          salary: hrData.salary ? parseFloat(hrData.salary) : u.salary
        };
      }
      return u;
    }));
  };

  const fileExpenseClaim = (expenseData) => {
    const newExpense = {
      _id: 'exp_' + Math.random().toString(36).substr(2, 9),
      employeeId: {
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        department: currentUser.department
      },
      title: expenseData.title,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date || new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: expenseData.description || ''
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const reviewExpense = (expenseId, status) => {
    setExpenses(prev => prev.map(exp => {
      if (exp._id === expenseId) {
        return { ...exp, status };
      }
      return exp;
    }));
  };

  const addCourse = (courseData) => {
    const newCourse = {
      _id: 'c_' + Math.random().toString(36).substr(2, 9),
      name: courseData.name,
      duration: courseData.duration || '6 Months',
      fee: parseFloat(courseData.fee) || 0,
      details: courseData.details || ''
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const editCourse = (courseId, updatedData) => {
    setCourses(prev => prev.map(c => c._id === courseId ? { 
      ...c, 
      name: updatedData.name,
      duration: updatedData.duration || c.duration,
      fee: parseFloat(updatedData.fee) || c.fee,
      details: updatedData.details || c.details
    } : c));
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(c => c._id !== courseId));
  };

  const addExtraIncome = (incomeData) => {
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

  const deleteExtraIncome = (incomeId) => {
    setExtraIncomes(prev => prev.filter(i => i._id !== incomeId));
  };

  // Stats
  const getStats = () => {
    const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
    const totalCourseRevenue = students.reduce((sum, s) => sum + s.ledger.totalPackageAmount, 0);
    const totalCollected = students.reduce((sum, s) => sum + s.ledger.amountPaid, 0);
    const totalOutstanding = students.reduce((sum, s) => sum + s.ledger.balanceDue, 0);
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
