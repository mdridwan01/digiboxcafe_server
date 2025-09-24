const express = require('express');
const { createOrder, getAllOrders, deleteOrder, updateOrder } = require('../controllers/orderController');

const router = express.Router();

// POST /api/orders – Create Order
router.post('/', createOrder);
router.get('/', getAllOrders);
router.patch('/:id', updateOrder); // Update Order
router.delete('/:id', deleteOrder);

module.exports = router;
