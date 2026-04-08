const Product = require('../../models/product.model')
const Account = require('../../models/user.model')
const filterStatusHelper = require('../../helper/filterStatus')
const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')
const uploadToCloud = require("../../helper/uploadCloud")
const Category = require('../../models/category.model')
const createTreeHelper = require('../../helper/createTree')

module.exports.getList = async (query) => {
    const filterStatus = filterStatusHelper(query)
    const find = { deleted: false }
    const count = await Product.countDocuments({ deleted: false })

    if (query.status) find.status = query.status

    const searchObject = searchHelper(query)
    if (searchObject.regex) find.title = searchObject.regex

    const totalProducts = await Product.countDocuments(find)
    const pagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 6
        },
        query,
        totalProducts
    )

    let sort = {};

    if (query.sort) {
        const [field, order] = query.sort.split("-")
        sort[field] = order === "asc" ? 1 : -1
    } else {
        sort = { position: -1 }
    }


    const products = await Product.find(find)
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limitItems)

    products.count = count
    return {
        products,
        filterStatus,
        keyword: searchObject.keyword,
        pagination
    }
}

module.exports.changeStatus = async (id, status) => {
    return Product.updateOne({ _id: id }, { status })
}

module.exports.changeMulti = async (type, ids) => {
    const actions = {
        active: { status: "active" },
        inactive: { status: "inactive" },
        "delete-all": "delete",
        "change-position": "position"
    }

    const action = actions[type]
    if (!action) {
        return { status: "error", message: "Hành động không hợp lệ!" }
    }

    if (action === "delete") {
        await Product.updateMany(
            { _id: { $in: ids } },
            {
                deleted: true,
                deletedAt: new Date()
            }
        )

        return {
            status: "success",
            message: `Đã xóa ${ids.length} sản phẩm!`
        }
    }

    if (action === "position") {
        for (const item of ids) {
            const [id, position] = item.split('-')
            await Product.updateOne(
                { _id: id },
                { position: parseInt(position) }
            )
        }

        return {
            status: "success",
            message: `Đã cập nhật vị trí ${ids.length} sản phẩm!`
        }
    }

    await Product.updateMany(
        { _id: { $in: ids } },
        { status: action.status }
    )

    return {
        status: "success",
        message: `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`
    }
}

module.exports.deleteProduct = async (id) => {
    return Product.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: new Date()
        }
    )
}

module.exports.create = async () => {
    const find = { deleted: false }

    const records = await Category.find(find)

    const categories = createTreeHelper.createTree(records)

    return categories
}

module.exports.createProduct = async (req, res) => {
    const body = req.body

    // ✅ Kiểm tra trùng tên sản phẩm (không tính các sản phẩm đã xóa)
    const existingProduct = await Product.findOne({
        title: body.title,
        deleted: false
    });

    if (existingProduct) {
        throw new Error("TITLE_EXISTS");
    }

    body.price = parseInt(body.price) || 0
    body.discountPercentage = parseInt(body.discountPercentage) || 0
    body.stock = parseInt(body.stock) || 0

    if (!body.position || body.position === "") {
        const count = await Product.countDocuments({ deleted: false })
        body.position = count + 1
    } else {
        body.position = parseInt(body.position)
    }

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path)
        body.thumbnail = uploadResult.secure_url
    }

    const userId = res.locals.user ? (res.locals.user._id || res.locals.user.id) : null;
    if (userId) {
        body.createdBy = {
            account_id: userId.toString(),
            createdAt: new Date()
        }
    }

    const product = new Product(body)
    return product.save()
}

const mongoose = require("mongoose");

module.exports.detail = async (id) => {

    const product = await Product.findOne({ deleted: false, _id: id });
    if (!product) return null;

    let categoryTitle = null;

    if (product.product_category) {
        const category = await Category.findOne({
            deleted: false,
            _id: product.product_category,
        });
        categoryTitle = category ? category.title : null;
    }

    const user = await Account.findOne({
        _id: product.createdBy.account_id
    });
    if (user) {
        product.createdBy.fullName = user.fullName;
    }

    const updatedUser = await Account.findOne({
        _id: product.updatedBy.account_id
    });

    if (updatedUser) {
        product.updatedBy.fullName = updatedUser.fullName;
    }

    product.nameCategory = categoryTitle;

    return product;
};



module.exports.edit = async (id) => {
    const find = { deleted: false }

    const records = await Category.find(find)

    const categories = createTreeHelper.createTree(records)

    const product = await Product.findOne({ deleted: false, _id: id })
    return {
        product,
        categories
    }
}

module.exports.editProduct = async (req, id, res) => {
    const body = req.body

    // ✅ Kiểm tra trùng tên sản phẩm (không tính sản phẩm hiện tại và các sản phẩm đã xóa)
    const existingProduct = await Product.findOne({
        _id: { $ne: id },
        title: body.title,
        deleted: false
    });

    if (existingProduct) {
        throw new Error("TITLE_EXISTS");
    }

    body.price = parseInt(body.price) || 0
    body.discountPercentage = parseInt(body.discountPercentage) || 0
    body.stock = parseInt(body.stock) || 0
    body.position = parseInt(body.position) || 0

    if (body.removeThumbnail === "1") {
        body.thumbnail = ""
    }

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path)
        body.thumbnail = uploadResult.secure_url
    }

    const userId = res.locals.user ? (res.locals.user._id || res.locals.user.id) : null;
    if (userId) {
        body.updatedBy = {
            account_id: userId.toString(),
            updatedAt: new Date()
        }
    }

    const result = await Product.updateOne({ _id: id }, body)
    return result.modifiedCount > 0
}
