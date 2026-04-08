const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true,
      trim: true
    },
    userEmail: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // có createdAt, updatedAt
  }
);

module.exports = mongoose.model('Comment', CommentSchema);