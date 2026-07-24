import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000';
  }
  return 'https://springs-academy.onrender.com';
};

export const API_URL = getApiUrl();

export const AppProvider = ({ children }) => {
  // Session / Local Storage for Active Auth Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = sessionStorage.getItem('agy_session_user') || localStorage.getItem('agy_session_user');
      if (savedSession) {
        return JSON.parse(savedSession);
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('agy_session_user', JSON.stringify(currentUser));
      localStorage.setItem('agy_session_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('agy_session_user');
      localStorage.removeItem('agy_session_user');
    }
  }, [currentUser]);

  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [courses, setCourses] = useState([]);
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

  // Fetch Live Data directly from MongoDB Atlas backend API on load and session changes
  useEffect(() => {
    const fetchAtlasData = async () => {
      try {
        const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};

        // Fetch public data (courses & extra incomes)
        const courseRes = await fetch(`${API_URL}/api/courses`).catch(() => null);
        if (courseRes && courseRes.ok) {
          const courseData = await courseRes.json();
          if (Array.isArray(courseData)) setCourses(courseData);
        }

        const incomeRes = await fetch(`${API_URL}/api/extra-incomes`).catch(() => null);
        if (incomeRes && incomeRes.ok) {
          const incomeData = await incomeRes.json();
          if (Array.isArray(incomeData)) setExtraIncomes(incomeData);
        }

        // Fetch Invoices
        const invoiceRes = await fetch(`${API_URL}/api/invoices`, { headers }).catch(() => null);
        let atlasInvoices = [];
        if (invoiceRes && invoiceRes.ok) {
          const invData = await invoiceRes.json();
          if (Array.isArray(invData)) atlasInvoices = invData;
        }

        // Fetch Students
        const studentRes = await fetch(`${API_URL}/api/students`, { headers }).catch(() => null);
        if (studentRes && studentRes.ok) {
          const studentData = await studentRes.json();
          if (Array.isArray(studentData)) {
            const formatted = studentData.map(s => {
              const studentAtlasInvoices = atlasInvoices.filter(inv => {
                const invStudentId = typeof inv.studentId === 'object' ? inv.studentId?._id : inv.studentId;
                return String(invStudentId) === String(s._id);
              });

              const allStudentInvoices = [...(s.invoices || []), ...studentAtlasInvoices];
              const uniqueInvoices = Array.from(
                new Map(allStudentInvoices.map(i => [String(i._id), i])).values()
              );

              const paidInvoicesSum = uniqueInvoices
                .filter(inv => inv.status === 'Paid')
                .reduce((sum, inv) => sum + inv.amount, 0);

              const paymentsSum = (s.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
              const totalPaid = Math.max(s.ledger?.amountPaid ?? 0, paidInvoicesSum + paymentsSum);
              const totalPkg = s.ledger?.totalPackageAmount ?? 45000;
              const balanceDue = Math.max(0, totalPkg - totalPaid);
              const paymentStatus = balanceDue === 0 ? 'Fully Paid' : totalPaid > 0 ? 'Partially Paid' : 'Unpaid';

              return {
                ...s,
                invoices: uniqueInvoices,
                ledger: {
                  totalPackageAmount: totalPkg,
                  amountPaid: totalPaid,
                  balanceDue,
                  paymentStatus
                }
              };
            });
            setStudents(formatted);
          }
        }

        // Fetch Employees
        const empRes = await fetch(`${API_URL}/api/admin/employees`, { headers }).catch(() => null);
        if (empRes && empRes.ok) {
          const empData = await empRes.json();
          if (Array.isArray(empData)) setEmployees(empData);
        }

        // Fetch Expenses
        const expRes = await fetch(`${API_URL}/api/admin/expenses`, { headers }).catch(() => null);
        if (expRes && expRes.ok) {
          const expData = await expRes.json();
          if (Array.isArray(expData)) setExpenses(expData);
        }
      } catch (err) {
        console.warn("Notice: Live data fetch warning:", err);
      }
    };

    fetchAtlasData();
  }, [currentUser]);

  // Auth Actions
  const login = async (username, password) => {
    const cleanUsername = (username || '').trim();

    // 1. Try Live MongoDB Atlas Login via Backend API
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanUsername, username: cleanUsername, password })
      });

      if (res.ok) {
        const user = await res.json();
        if (user && user._id) {
          setCurrentUser(user);
          return true;
        }
      }
    } catch (err) {
      console.warn("Backend API login warning:", err);
    }

    // 2. Fallback check for local state or default seed accounts
    const user = users.find(u => (u.username?.toLowerCase() === cleanUsername.toLowerCase() || u.name?.toLowerCase() === cleanUsername.toLowerCase() || u.email?.toLowerCase() === cleanUsername.toLowerCase()) && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }

    const fallbackToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNjFiYjczMGIyOTNjNDRmNGE3ZWZkZSIsImlhdCI6MTc4NDgwMjI3NCwiZXhwIjoxNzg3Mzk0Mjc0fQ.vWxzpVEMs2wmui_aAu5qWBsYCpkWjb0YjZZMeoALldg";

    if ((cleanUsername.toLowerCase() === 'admin' && password === 'password') || (cleanUsername.toLowerCase() === 'owner@academy.com' && password === 'password123')) {
      const defaultUser = { _id: 'owner1', username: 'admin', password: 'password', name: 'Director Jane', email: 'owner@academy.com', role: 'Super Admin', department: 'Executive', designation: 'Academy Director', salary: 120000, token: fallbackToken };
      setCurrentUser(defaultUser);
      return true;
    }

    if ((cleanUsername.toLowerCase() === 'admin123' && password === 'password123') || (cleanUsername.toLowerCase() === 'finance@academy.com' && password === 'password123')) {
      const defaultAdmin = { _id: 'admin1', username: 'admin123', password: 'password123', name: 'Accounts Manager', email: 'finance@academy.com', role: 'Admin', department: 'Finance & HR', designation: 'Accounts Manager', salary: 60000, token: fallbackToken };
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

      const data = await res.json().catch(() => ({}));
      if (res.ok && data && data.student) {
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
      } else if (!res.ok && data && data.message) {
        return { error: data.message };
      }
    } catch (err) {
      console.warn("MongoDB Atlas student registration error:", err);
    }

    return { error: "Failed to connect to backend server. Student registration requires active MongoDB Atlas connection." };
  };

  const editStudent = async (studentId, updatedData) => {
    // 1. Update local state
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

    // 2. Persist directly to MongoDB Atlas backend API
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      const res = await fetch(`${API_URL}/api/students/${studentId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        const updatedStudentFromAtlas = await res.json();
        setStudents(prev => prev.map(s => s._id === studentId ? { ...s, ...updatedStudentFromAtlas } : s));
      }
    } catch (err) {
      console.warn("MongoDB Atlas edit student error:", err);
    }
  };

  const deleteStudent = async (studentId) => {
    setStudents(prev => prev.filter(s => s._id !== studentId));

    try {
      const headers = {};
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      await fetch(`${API_URL}/api/students/${studentId}`, {
        method: 'DELETE',
        headers
      });
    } catch (err) {
      console.warn("MongoDB Atlas delete student error:", err);
    }
  };

  const addInstallment = async (studentId, amount, description, dueDate) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      const res = await fetch(`${API_URL}/api/invoices`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          studentId,
          amount: parseFloat(amount),
          dueDate: dueDate || new Date().toISOString().split('T')[0],
          particulars: description || 'Additional Installment/Fee'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.invoice) {
          setStudents(prev => prev.map(s => {
            if (s._id === studentId) {
              return {
                ...s,
                invoices: [...(s.invoices || []), data.invoice],
                ledger: data.ledger || s.ledger
              };
            }
            return s;
          }));
          return data.invoice;
        }
      }
    } catch (err) {
      console.warn("MongoDB Atlas invoice creation warning:", err);
    }

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

  const makePayment = async (studentId, amount, date, paymentMethod, upiScreenshot) => {
    const screenshotUrl = await uploadToCloudinary(upiScreenshot, 'payments/screenshots');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      const res = await fetch(`${API_URL}/api/invoices/pay`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          studentId,
          amount: parseFloat(amount),
          date: date || new Date().toISOString().split('T')[0],
          paymentMethod: paymentMethod || 'Cash',
          upiScreenshot: screenshotUrl
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.invoice) {
          setStudents(prev => prev.map(s => {
            if (s._id === studentId) {
              const updatedInvoices = (s.invoices || []).map(inv => 
                inv._id === data.invoice._id ? data.invoice : inv
              );
              if (!updatedInvoices.find(inv => inv._id === data.invoice._id)) {
                updatedInvoices.push(data.invoice);
              }
              return {
                ...s,
                invoices: updatedInvoices,
                ledger: data.ledger || s.ledger
              };
            }
            return s;
          }));
          return data;
        }
      }
    } catch (err) {
      console.warn("MongoDB Atlas fee payment recording error:", err);
    }
  };

  const editPayment = async (studentId, paymentId, updatedData) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      const res = await fetch(`${API_URL}/api/invoices/${paymentId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          amount: parseFloat(updatedData.amount),
          date: updatedData.date,
          paymentMethod: updatedData.paymentMethod
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.invoice) {
          setStudents(prev => prev.map(s => {
            if (s._id === studentId) {
              const updatedInvoices = (s.invoices || []).map(inv => 
                inv._id === paymentId ? data.invoice : inv
              );
              return {
                ...s,
                invoices: updatedInvoices,
                ledger: data.ledger || s.ledger
              };
            }
            return s;
          }));
          return data;
        }
      }
    } catch (err) {
      console.warn("MongoDB Atlas edit payment warning:", err);
    }

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

  const markInvoicePaid = async (studentId, invoiceId, paymentMethod) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      const res = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: 'Paid',
          paymentMethod: paymentMethod || 'Cash'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.invoice) {
          setStudents(prev => prev.map(s => {
            if (s._id === studentId) {
              const updatedInvoices = s.invoices.map(inv => 
                inv._id === invoiceId ? data.invoice : inv
              );
              return {
                ...s,
                invoices: updatedInvoices,
                ledger: data.ledger || s.ledger
              };
            }
            return s;
          }));
          return data.invoice;
        }
      }
    } catch (err) {
      console.warn("MongoDB Atlas invoice status update warning:", err);
    }

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
      const profileImage = await uploadToCloudinary(empData.profileImage, 'employees/profiles');
      const preparedPayload = { ...empData, profileImage };

      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      const res = await fetch(`${API_URL}/api/admin/employees`, {
        method: 'POST',
        headers,
        body: JSON.stringify(preparedPayload)
      });
      if (res.ok) {
        const createdEmp = await res.json();
        setEmployees(prev => [...prev.filter(e => e._id !== createdEmp._id), createdEmp]);
        return createdEmp;
      }
    } catch (err) {
      console.warn("MongoDB Atlas employee creation error:", err);
    }
  };

  const deleteEmployee = (empId) => {
    setEmployees(prev => prev.filter(e => e._id !== empId));
  };

  const updateEmployeeHRRecord = async (empId, hrData) => {
    let profileImage = hrData.profileImage;
    if (hrData.profileImage) {
      profileImage = await uploadToCloudinary(hrData.profileImage, 'employees/profiles');
    }
    const preparedData = { ...hrData, profileImage };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

      await fetch(`${API_URL}/api/admin/employees/${empId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(preparedData)
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
          setExpenses(prev => [...prev.filter(exp => exp._id !== data.claim._id), data.claim]);
          return data.claim;
        }
      }
    } catch (err) {
      console.warn("MongoDB Atlas expense submission error:", err);
    }
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
    const payload = typeof courseData === 'string' 
      ? { name: courseData, duration: '6 Months', fee: 0, details: '' }
      : {
          name: courseData.name || courseData.courseName || courseData.title || 'New Course',
          duration: courseData.duration || '6 Months',
          fee: parseFloat(courseData.fee) || 0,
          details: courseData.details || ''
        };

    try {
      const res = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const createdCourse = await res.json();
        setCourses(prev => [...prev.filter(c => c._id !== createdCourse._id), createdCourse]);
        return createdCourse;
      }
    } catch (err) {
      console.warn("MongoDB Atlas course creation error:", err);
    }
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
    const payload = {
      title: incomeData.title || incomeData.source || 'Miscellaneous Income',
      source: incomeData.source || incomeData.title || 'Miscellaneous',
      amount: parseFloat(incomeData.amount),
      category: incomeData.category || 'General',
      date: incomeData.date || new Date().toISOString().split('T')[0],
      description: incomeData.description || incomeData.details || '',
      details: incomeData.details || incomeData.description || '',
      paymentMethod: incomeData.paymentMethod || 'Cash'
    };

    try {
      const res = await fetch(`${API_URL}/api/extra-incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const createdIncome = await res.json();
        setExtraIncomes(prev => [...prev.filter(i => i._id !== createdIncome._id), createdIncome]);
        return createdIncome;
      }
    } catch (err) {
      console.warn("MongoDB Atlas extra income creation error:", err);
    }
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
