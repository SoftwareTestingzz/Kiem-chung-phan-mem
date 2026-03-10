const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    thumbnail: { 
        type: String, 
        default: "/images/no-image.jpg" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("Blog", blogSchema, "blogs");
