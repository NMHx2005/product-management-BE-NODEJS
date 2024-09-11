const Chat = require("../../model/chat.model");
const User = require("../../model/user.model");
const streamUpload = require("../../helpers/streamUpload.helper");
const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {

    // SocketIO
    chatSocket(req, res);
    // End SocketIO

    const roomChatId = req.params.roomChatId;

    const chats = await Chat.find({
        roomChatId: roomChatId
    });

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.userId
        });

        chat.fullName = infoUser.fullName;
    }

        
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    });
}