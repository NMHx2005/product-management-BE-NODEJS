// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            // Việc 1: Thêm class "add" cho box-user
            button.closest(".box-user").classList.add("add");

            // Việc 2: Gửi lên Server userIdB
            const  userIdB = button.getAttribute("btn-add-friend");
            socket.emit("CLIENT_ADD_FRIEND", userIdB);
        })
    })
}
// Hết Chức năng gửi yêu cầu

// Chức năng hủy gửi yêu cầu
const btnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (btnCancelFriend.length > 0) {
    btnCancelFriend.forEach((button) => {
        button.addEventListener("click", () => {
            // Việc 1: Xóa class "add" khỏi "box-user"
            button.closest(".box-user").classList.remove("add");

            // Việc 2: gửi userIdB lên trên Server
            const userIdB = button.getAttribute("btn-cancel-friend"); // Lấy giá trị của attribute
            socket.emit("CLIENT_CANCEL_FRIEND", userIdB); // Gửi giá trị userIdB lên server
        });
    });
}
// Hết Chức năng hủy gửi yêu cầu

// Chức năng từ chối kết bạn
const btnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (btnRefuseFriend) {
    btnRefuseFriend.forEach((button) => {
        button.addEventListener("click", () => {
            // Việc 1: Thêm class "refuse" cho box-user
            button.closest(".box-user").classList.add("refuse");

            // Việc 2: Gửi lên server userIdB
            const userIdB = button.getAttribute("btn-refuse-friend");
            socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
        });
    })
}
// Hết Chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if(listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener("click", () => {
      // Việc 1: Thêm class "accepted" cho box-user
      button.closest(".box-user").classList.add("accepted");

      // Việc 2: Gửi lên server userIdB
      const userIdB = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
    })
  })
}
// Hết Chức năng chấp nhận kết bạn