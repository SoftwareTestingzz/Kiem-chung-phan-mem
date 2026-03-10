const Category = require('../../models/category.model');

module.exports.getMenuCategories = async () => {
    const categories = await Category.find({
        deleted: false,
        status: 'active'
    }).sort({ position: 1 });

    return categories;
};
