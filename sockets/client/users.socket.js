const User = require("../../model/user.model");

module.exports = (req, res) => {
    // Lấy ra ib của người hiện tại 
    const userIdA = res.locals.user.id;

    _io.once("connection", (socket) => {

        // Khi A gửi yêu cầu cho B
        socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
            // Thêm id của A vào acceptFriends của B
            const existUserAInB = await User.findOne({
                _id: userIdB,
                acceptFriends: userIdA
            }) 

            if(!existUserAInB) {
                await User.updateOne({
                    _id: userIdB
                }, {
                    $push: {
                        acceptFriends: userIdA
                    }
                })
            }

            // Thêm id của B vào requestFriends của A
            const existUserBInA = await User.findOne({
                _id: userIdA,
                requestFriends: userIdB
              });
        
            if(!existUserBInA) {
                await User.updateOne({
                    _id: userIdA
                }, {
                    $push: {
                        requestFriends: userIdB
                    }
                });
            }
        })
        // End Khi A gửi yêu cầu cho B
    });
}