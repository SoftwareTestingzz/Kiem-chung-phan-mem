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
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true // có createdAt, updatedAt
  }
);

module.exports = mongoose.model('Comment', CommentSchema);