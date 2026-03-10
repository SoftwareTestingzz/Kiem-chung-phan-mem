const UserClient = require('../models/user-client');
const bcrypt = require('bcrypt');

const usersData = [
    {
        fullName: "Nguyễn Văn An",
        email: "nguyenvanan@gmail.com",
        password: "123456",
        phone: "0901234567",
        gender: "male",
        birthday: "1995-03-15",
        address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        status: "active"
    },
    {
        fullName: "Trần Thị Bình",
        email: "tranthiB@gmail.com",
        password: "123456",
        phone: "0912345678",
        gender: "female",
        birthday: "1990-07-22",
        address: "456 Lê Lợi, Quận 3, TP.HCM",
        status: "active"
    },
    {
        fullName: "Phạm Minh Châu",
        email: "phamminchau@gmail.com",
        password: "123456",
        phone: "0923456789",
        gender: "female",
        birthday: "1998-11-08",
        address: "789 Hai Bà Trưng, Quận Bình Thạnh, TP.HCM",
        status: "active"
    },
    {
        fullName: "Lê Quốc Dũng",
        email: "lequocdung@gmail.com",
        password: "123456",
        phone: "0934567890",
        gender: "male",
        birthday: "1987-05-30",
        address: "321 Đinh Tiên Hoàng, Quận Bình Thạnh, TP.HCM",
        status: "active"
    },
    {
        fullName: "Hoàng Thị Mai",
        email: "hoangthimai@gmail.com",
        password: "123456",
        phone: "0945678901",
        gender: "female",
        birthday: "2000-01-14",
        address: "654 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM",
        status: "active"
    }
];

module.exports = async () => {
    const salt = await bcrypt.genSalt(10);
    for (const userData of usersData) {
        const existing = await UserClient.findOne({ email: userData.email, deleted: false });
        if (!existing) {
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            await UserClient.create({ ...userData, password: hashedPassword });
            console.log(`  ✓ Đã tạo tài khoản khách hàng: ${userData.fullName} (${userData.email})`);
        } else {
            console.log(`  ~ Khách hàng đã tồn tại: ${userData.email}`);
        }
    }
};
