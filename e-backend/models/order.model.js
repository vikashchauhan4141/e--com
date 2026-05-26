const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      required: [true, 'Item size is required'],
    },
    color: {
      type: String,
      required: [true, 'Item color is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
    },
    pricing: {
      subtotal: Number,
      shipping: Number,
      discount: Number,
      discountPercent: Number,
      couponCode: String,
      total: Number,
    },
    payment: {
      method: {
        type: String,
        enum: ['COD', 'ONLINE'],
        default: 'COD',
      },
      status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
      },
      razorpayOrderId: {
        type: String,
      },
      razorpayPaymentId: {
        type: String,
      },
      razorpaySignature: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
