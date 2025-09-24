const express = require('express');
const { getAllVending, getVendingById, createVending, updateVending, deleteVending } = require('../controllers/vendingController');
//const { getVendingStatus, updateVendingStatus } = require('../controllers/vendingController');
const router = express.Router();

// GET/POST/UPDATE/DELETE /api/vending –
 router.get('/', getAllVending);
 router.get('/:id', getVendingById);
 router.post('/', createVending);
 router.patch('/:id', updateVending); 
 router.delete('/:id', deleteVending);

 module.exports = router;
