const Category = require('../../models/category.model')
const uploadToCloud = require("../../helper/uploadCloud")
const createTreeHelper = require('../../helper/createTree')
const filterStatusHelper = require('../../helper/filterStatus')
const searchHelper = require('../../helper/search')

module.exports.getList = async (query) => {

    const filterStatus = filterStatusHelper(query)

    const find = { deleted: false }

    if (query.status) find.status = query.status

    const searchObject = searchHelper(query)
    if (searchObject.regex) find.title = searchObject.regex

    const allCategories = await Category.find(find).sort({ position: 1 })

    const tree = createTreeHelper.createTree(allCategories);

    return {
        categories: allCategories,
        filterStatus,
        keyword: searchObject.keyword,
        tree
    }
}

module.exports.changeStatus = async (id, status) => {
    return Category.updateOne({ _id: id }, { status })
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
        await Category.updateMany(
            { _id: { $in: ids } },
            {
                deleted: true,
                deletedAt: new Date()
            }
        )

        return {
            status: "success",
            message: `Đã xóa ${ids.length} danh mục!`
        }
    }

    if (action === "position") {
        for (const item of ids) {
            const [id, position] = item.split('-')
            await Category.updateOne(
                { _id: id },
                { position: parseInt(position) }
            )
        }

        return {
            status: "success",
            message: `Đã cập nhật vị trí ${ids.length} danh mục!`
        }
    }

    await Category.updateMany(
        { _id: { $in: ids } },
        { status: action.status }
    )

    return {
        status: "success",
        message: `Cập nhật trạng thái ${ids.length} danh mục thành công!`
    }
}

module.exports.deleteCategory = async (id) => {
    return Category.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: new Date()
        }
    )
}

module.exports.create = async (req) => {
    const find = { deleted: false }
    
    const records = await Category.find(find)
    
    const tree = createTreeHelper.createTree(records)

    return tree
}

module.exports.createCategory = async (req) => {
    const body = req.body

    if (!body.position || body.position === "") {
        const count = await Category.countDocuments({ deleted: false })
        body.position = count + 1
    } else {
        body.position = parseInt(body.position)
    }

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path)
        body.thumbnail = uploadResult.secure_url
    }

    const records = new Category(body)
    return records.save()
}

module.exports.edit = async (id) => {
    const data = await Category.findOne({
        _id: id,
        deleted: false
    })

    const records = await Category.find({deleted: false})
    
    const tree = createTreeHelper.createTree(records)
     
     return {
        data,
        tree
     }

}

module.exports.editCategory = async (req) => {
    const id = req.params.id

    req.body.position = parseInt(req.body.position)

    if (req.body.removeThumbnail === "1") {
        req.body.thumbnail = ""
    }

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path)
        req.body.thumbnail = uploadResult.secure_url
    }

    await Category.updateOne({
        _id: id
    }, req.body)

}