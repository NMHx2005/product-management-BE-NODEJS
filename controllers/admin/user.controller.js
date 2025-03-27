const User = require("../../model/user.model");
const moment = require("moment");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helpers/pagination.helpers");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");

// [GET] /admin/userAccount
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
        status: "active"
    };

    try {
        // Tính năng phân trang
        const pagination = await paginationHelper.paginationUser(req, find);

        // Lấy danh sách người dùng với phân trang
        const users = await User.find(find)
            .select("id fullName email status deleted createdAt updatedAt")
            .skip(pagination.skip)
            .limit(pagination.limitItems);

        // Định dạng ngày tháng
        for (const item of users) {
            item.createdAtFormat = moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss");
        };

        // Gửi dữ liệu đến view
        res.render("admin/pages/userAccount/index", {
            pageTitle: "Trang danh sách người dùng",
            users: users,
            paginationUser: pagination
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Có lỗi xảy ra khi lấy danh sách người dùng.");
    }
}


// [GET] /admin/userAccount/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({
            deleted: false,
            status: "active",
            _id: id
        });
        console.log(user);
        res.render("admin/pages/userAccount/detail", {
            pageTitle: "Trang chi tiết User",
            user
        })
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Có lỗi xảy ra khi lấy dchi tiết người dùng.");
    }
}


// [GET] /admin/userAccount/create
module.exports.create = async (_req, res) => {
    try {
        res.render("admin/pages/userAccount/create", {
            pageTitle: "Trang tạo mới User"
        })
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Có lỗi xảy ra khi lấy tạo người dùng người dùng.");
    }
}


// [POST] /admin/userAccount/create
module.exports.createPost = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;
        const check = true;
        // Validate required fields

        if (!fullName) {
            check = false;
            req.flash("error", "Vui lòng nhập họ tên.");
        }
        if (!email) {
            check = false;
            req.flash("error", "Vui lòng nhập email.");
        }
        if (!phone) {
            check = false;
            req.flash("error", "Vui lòng nhập số điện thoại.");
        }
        if (!password) {
            check = false;
            req.flash("error", "Vui lòng nhập mật khẩu.");
        }
        if (check == false) {
            return res.redirect(`/${systemConfig.prefixAdmin}/userAccount/create`);
        }
        if (check == true) {
            // If all fields are valid, proceed with password hashing and saving user
            req.body.password = md5(password); // Hash the password
            req.body.token = generateHelper.generateRandomString(30); // Generate token

            const user = new User(req.body);
            await user.save();

            req.flash("success", "Tạo tài khoản thành công");
            res.redirect(`/${systemConfig.prefixAdmin}/userAccount`);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Có lỗi xảy ra khi lấy tạo người dùng người dùng.");
    }
}


// [GET] /admin/userAccount/edit
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({
            _id: id,
            status: "active",
            deleted: false
        }).select("id fullName email tokenUser phone status deleted createAt")

        res.render("admin/pages/userAccount/edit", {
            pageTitle: "Trang chỉnh sửa User",
            user: user
        })
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Có lỗi xảy ra khi lấy người dùng.");
    }
}


// [PATCH] /admin/userAccount/editPatch
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.body.id;

        // Kiểm tra nếu mật khẩu không được cung cấp
        if (req.body.password == "") {
            delete req.body.password;
        } else {
            // Mã hóa mật khẩu bằng md5
            req.body.password = md5(req.body.password);
        }


        await User.updateOne({
            _id: id,
            deleted: false,
        }, req.body);

        req.flash("success", "Đã Cập Nhật Thành Công!");

        res.redirect(`/${systemConfig.prefixAdmin}/userAccount`);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(403).send("Có lỗi xảy ra khi cập nhật thông tin người dùng.");
    }
}