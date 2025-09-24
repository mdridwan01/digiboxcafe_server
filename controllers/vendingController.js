const Vending = require('../models/Vending');

// Create   

exports.createVending = async (req, res) => {
  try {
    const newVending = new Vending(req.body);
    const saved = await newVending.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Read All
exports.getAllVending = async (req, res) => {
  try {
    const vending = await Vending.find();
    res.json(vending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Read One
exports.getVendingById = async (req, res) => {
  try {
    const vending = await Vending.findById(req.params.id);
    if (!vending) return res.status(404).json({ error: 'Not found' });
    res.json(vending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update
exports.updateVending = async (req, res) => {
   const { id } = req.params;
const { onKey, uiToken } = req.body;
console.log("Received onKey:", onKey);  // Log the onKey value

try {
  const vending = await Vending.findById(id);
  if (!vending) return res.status(404).json({ error: 'Not found' });

  // Loop through "1" to "5" and set values based on onKey
  for (let i = 1; i <= 5; i++) {
    const key = i.toString();
    vending[key] = key === onKey ? 'on' : 'off';
  }

  // Handle uiToken separately if needed
  if (uiToken !== undefined) {
    vending.uiToken = uiToken;  // Update uiToken as well
  }

  await vending.save();
  res.json(vending);
} catch (err) {
  res.status(500).json({ error: err.message });
}
    }

// Delete
exports.deleteVending = async (req, res) => {
  try {
    await Vending.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vending machine deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}