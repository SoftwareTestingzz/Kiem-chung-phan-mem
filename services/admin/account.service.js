const Account = require('../../models/user.model');
const Role = require('../../models/role.model');
const uploadToCloud = require("../../helper/uploadCloud");
const bcrypt = require("bcrypt");

module.exports.getList = async () => { 
    let find = {deleted: false} 

    const accounts = await Account.find(find).select('-token -password')

    for(const account of accounts){
        const role = await Role.findOne({
            _id: account.role_id,
            deleted: false
        })
        account.role = role
    }
    return accounts
}

module.exports.create = async () => { 
    let find = {deleted: false}
    return Role.find(find) 
}

module.exports.createAccount = async (req) => {
    const { email } = req.body;

    const existing = await Account.findOne({ email, deleted: false });
    if (existing) {
        throw new Error("EMAIL_EXISTS");
    }

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path);
        req.body.avatar = uploadResult.secure_url;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    req.body.password = hashedPassword;

    delete req.body.confirmPassword;

    const record = new Account(req.body);
    return record.save();
};

module.exports.changeStatus = async (id, status) => {
    return Account.updateOne({ _id: id }, { status })
}

module.exports.deleteAccount = async (id) => {
    return Account.updateOne(
        { _id: id },
        {
            deleted: true,
            deletedAt: new Date()
        }
    )
}

module.exports.edit = async (req) => { 
    let find = {
        _id: req.params.id,
        deleted: false
    } 

    const account = await Account.findOne(find)

    const roles = await Role.find({deleted: false})
    return {
        account,
        roles
    }
}

module.exports.editAccount = async (req) => { 
    if (req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        req.body.password = hashedPassword;
    }else{
        delete req.body.password;
    }

    if (req.body.email) {
        const email = req.body.email.trim();
        const existEmail = await Account.findOne({
            email: email,
            deleted: false,
            _id: { $ne: req.params.id}
        });

        if (existEmail) {
            throw new Error("EMAIL_EXISTS");
        }
        req.body.email = email;
    }

    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path);
        req.body.avatar = uploadResult.secure_url;
    }


    delete req.body.confirmPassword;
    await Account.updateOne({
        _id: req.params.id
    }, req.body)
}
// ======================================================
// DETAIL ACCOUNT (ADMIN)
// ======================================================
module.exports.detail = async (req) => {
    const id = req.params.id;

    const account = await Account.findOne({
        _id: id,
        deleted: false
    }).select('-password -token');

    if (!account) {
        throw new Error("ACCOUNT_NOT_FOUND");
    }

    // LẤY ROLE (GIỐNG LOGIC getList)
    let role = null;
    if (account.role_id) {
        role = await Role.findOne({
            _id: account.role_id,
            deleted: false
        });
    }

    account.role = role;

    return {
        account
    };
};
