const mongoose = require("mongoose");
module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Kết nối database thành công!");
    } catch (erron) {
        // console.log(erron);
        console.log("Kết nối database thất bại");
    }
}
