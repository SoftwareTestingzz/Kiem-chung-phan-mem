const Role = require('../../models/role.model')
const permissionLabel = require('../../helper/permissionLable')

module.exports.getList = async () => {
    let find = {deleted: false}

    return Role.find(find)
}

module.exports.createRole = async (req) => {
    const role = new Role(req.body)
    
    await role.save()
}

module.exports.edit = async (id) => {
    let find = {
        _id: id,
        deleted: false
    }

    return Role.findOne(find)
}

module.exports.editRole = async (id) => {
    await Role.updateOne({_id: id}, req.body)
}

module.exports.deleteRole = async (id) => {
    return Role.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: new Date()
        }
    )

}

module.exports.detail = async (id) => {
    const role = await Role.findOne({ deleted: false, _id: id });

    const permissionsDisplay = role.permissions.map(key => permissionLabel[key]);

    return {
        role,
        permissionsDisplay
    }
}


module.exports.permissions = async (id) => {
    const role = await Role.find({ deleted: false});

    return role;
}

module.exports.permissionsRole = async (body) => {

    const permissions = JSON.parse(body.permissions)

    for (const item of permissions){
        await Role.updateOne({_id: item.id}, {permissions: item.permissions})
    }

}

