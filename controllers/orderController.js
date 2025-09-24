const Order = require('../models/Order');

// order create
exports.createOrder = async (req, res) => {
  try {
    const { product_id, title, price, quantity , OrderStatus} = req.body;

    if (!product_id || !title || !price || !OrderStatus) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({ product_id, title, price, quantity, OrderStatus });
    await newOrder.save();

    res.status(201).json({ message: 'Order confirmed', order: newOrder });
  } catch (err) {
    console.error('Order Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
// order get all
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error('Order Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


// PATCH /api/orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // only send what needs to be updated

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true,              // return the updated document
      runValidators: true     // validate the schema
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};



// Order delete
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted', order: deletedOrder });
  } catch (err) {
    console.error('Order Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}