const Product = require('../../models/product.model');
const Category = require('../../models/category.model');

// helper format tiền VND
const formatVND = (value) => value.toLocaleString("vi-VN") + "";

// helper bỏ HTML (nếu mô tả là TinyMCE)
const stripHtml = (html = "") =>
  String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getList = async () => {
  const products = await Product.find({
    status: 'active',
    deleted: false
  }).sort({ position: 1 });

  const newProducts = products.map(item => {
    const newPriceNumber = Math.round(
      item.price * (100 - (item.discountPercentage || 0)) / 100
    );

    // ✅ dùng để filter/sort ở frontend
    item.newPriceNumber = newPriceNumber;
    item.oldPriceNumber = item.price;

    // ✅ dùng để hiển thị
    item.newPrice = formatVND(newPriceNumber);
    item.oldPrice = formatVND(item.price);

    // ✅ mô tả ngắn để lấp chỗ trống (lấy từ description hoặc content)
    const rawDesc = item.description || item.content || "";
    item.shortDescription = stripHtml(rawDesc).slice(0, 260);

    return item;
  });

  return newProducts;
};

module.exports.getList = getList;

// ✅ Dùng cho trang home
module.exports.getProductsForHome = async (limit = 10) => {
  const products = await getList();
  return products.slice(0, limit);
};

module.exports.detail = async (slug) => {
  const product = await Product.findOne({
    deleted: false,
    slug: slug,
    status: 'active'
  });

  if (!product) return null;

  const newPriceNumber = Math.round(
    product.price * (100 - (product.discountPercentage || 0)) / 100
  );

  product.newPriceNumber = newPriceNumber;
  product.oldPriceNumber = product.price;

  product.newPrice = formatVND(newPriceNumber);
  product.oldPrice = formatVND(product.price);

  const rawDesc = product.description || product.content || "";
  product.shortDescription = stripHtml(rawDesc).slice(0, 260);

  return product;
};

// ✅ Lấy sản phẩm theo slug danh mục (cha hoặc con)
module.exports.getListByCategorySlug = async (slug) => {
  const category = await Category.findOne({
    slug,
    deleted: false,
    status: 'active'
  });

  if (!category) return [];

  const categoryIds = [category._id.toString()];

  if (!category.parent_category) {
    const children = await Category.find({
      parent_category: category._id.toString(),
      deleted: false,
      status: 'active'
    });

    children.forEach(child => categoryIds.push(child._id.toString()));
  }

  const products = await Product.find({
    product_category: { $in: categoryIds },
    status: 'active',
    deleted: false
  }).sort({ position: 1 });

  const newProducts = products.map(item => {
    const newPriceNumber = Math.round(
      item.price * (100 - (item.discountPercentage || 0)) / 100
    );

    item.newPriceNumber = newPriceNumber;
    item.oldPriceNumber = item.price;

    item.newPrice = formatVND(newPriceNumber);
    item.oldPrice = formatVND(item.price);

    const rawDesc = item.description || item.content || "";
    item.shortDescription = stripHtml(rawDesc).slice(0, 260);

    return item;
  });

  return newProducts;
};
