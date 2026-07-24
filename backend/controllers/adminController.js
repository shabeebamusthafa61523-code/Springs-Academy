import User from '../models/User.js';
import Expense from '../models/Expense.js';

// Get list of all staff / employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({}).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new staff / employee
export const createEmployee = async (req, res) => {
  const { name, username, email, password, role, department, designation, salary } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const employee = await User.create({
      name,
      username: username || name.toLowerCase().replace(/\s+/g, ''),
      email,
      password: password || 'password123',
      role: role || 'Employee',
      department: department || 'Academic',
      designation: designation || 'Staff',
      salary: salary || 0
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Employee HR Data (Super Admin / Admin)
export const updateEmployeeHR = async (req, res) => {
  const { employeeId } = req.params;
  const { name, email, role, username, password, department, designation, salary, phoneNumber, address, qualification } = req.body;

  try {
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (name !== undefined) employee.name = name;
    if (email !== undefined) employee.email = email;
    if (role !== undefined) employee.role = role;
    if (username !== undefined) employee.username = username;
    if (password !== undefined && password.trim() !== '') employee.password = password;
    if (department !== undefined) employee.department = department;
    if (designation !== undefined) employee.designation = designation;
    if (salary !== undefined) employee.salary = salary;
    if (phoneNumber !== undefined) employee.phoneNumber = phoneNumber;
    if (address !== undefined) employee.address = address;
    if (qualification !== undefined) employee.qualification = qualification;

    await employee.save();
    res.json({ message: 'Employee HR records updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Expense Claim (Any authenticated user)
export const submitExpenseClaim = async (req, res) => {
  const { title, amount, date, description } = req.body;

  try {
    const claim = await Expense.create({
      employeeId: req.user._id,
      title,
      amount,
      date,
      description,
      status: 'Pending'
    });
    res.status(201).json({ message: 'Expense claim filed successfully', claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Expense Claims (Filtered by User or Role)
export const getExpenseClaims = async (req, res) => {
  try {
    let claims;
    if (req.user.role === 'Super Admin' || req.user.role === 'Admin') {
      // Admins and Super Admins see all claims
      claims = await Expense.find({}).populate('employeeId', 'name email role department');
    } else {
      // Employees see their own claims
      claims = await Expense.find({ employeeId: req.user._id });
    }
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Review / Action Expense Claim (Super Admin / Admin)
export const reviewExpenseClaim = async (req, res) => {
  const { claimId } = req.params;
  const { status } = req.body; // Approved or Rejected

  try {
    const claim = await Expense.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Expense claim not found' });
    }

    claim.status = status;
    await claim.save();
    res.json({ message: `Expense claim status updated to ${status}`, claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update / Edit Expense Claim (Super Admin / Admin)
export const updateExpenseClaim = async (req, res) => {
  const { claimId } = req.params;
  const { title, amount, date, description, status } = req.body;

  try {
    const claim = await Expense.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Expense claim not found' });
    }

    if (title !== undefined) claim.title = title;
    if (amount !== undefined) claim.amount = amount;
    if (date !== undefined) claim.date = date;
    if (description !== undefined) claim.description = description;
    if (status !== undefined) claim.status = status;

    await claim.save();
    res.json({ message: 'Expense claim updated successfully', claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Expense Claim (Super Admin / Admin)
export const deleteExpenseClaim = async (req, res) => {
  const { claimId } = req.params;

  try {
    const claim = await Expense.findByIdAndDelete(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Expense claim not found' });
    }
    res.json({ message: 'Expense claim deleted successfully', claimId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

