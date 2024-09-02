const User = require("../../model/user.model");
const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // SocketIo
  usersSocket(req, res);
  // End SocketIo



  const userId = res.locals.user.id;

  // $ne: not equal
  // $nin: not in

  const requestFriends = res.locals.user.requestFriends;
  const acceptFriends = res.locals.user.acceptFriends;

  const users = await User.find({
    $and: [
      { _id: { $ne: userId }},
      { _id: { $nin: requestFriends }},
      { _id: { $nin: acceptFriends }}
    ],
    status: "active",
    deleted: false
  }).select("id avatar fullName");
  
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
};