import ExtraIncome from '../models/ExtraIncome.js';

// Get all extra incomes
export const getExtraIncomes = async (req, res) => {
  try {
    const incomes = await ExtraIncome.find({}).sort({ createdAt: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add extra income
export const createExtraIncome = async (req, res) => {
  const { title, source, amount, category, date, description, details, paymentMethod } = req.body;
  try {
    const incomeTitle = title || source || 'Miscellaneous Income';
    const income = await ExtraIncome.create({
      title: incomeTitle,
      source: source || incomeTitle,
      amount: parseFloat(amount),
      category: category || 'General',
      date: date || new Date().toISOString().split('T')[0],
      description: description || details || '',
      details: details || description || '',
      paymentMethod: paymentMethod || 'Cash'
    });
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete extra income
export const deleteExtraIncome = async (req, res) => {
  const { id } = req.params;
  try {
    const income = await ExtraIncome.findById(id);
    if (!income) {
      return res.status(404).json({ message: 'Extra income entry not found' });
    }
    await ExtraIncome.findByIdAndDelete(id);
    res.json({ message: 'Extra income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
