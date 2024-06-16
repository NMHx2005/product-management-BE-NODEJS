// Button status

// Lấy ra được các nút trang thái
const listButtonStatus = document.querySelectorAll("[button-status]");
if (listButtonStatus.length > 0) {
    // Lấy ra link của trang hiện tại
    let url = new URL(window.location.href);

    // Bắt sự kiện khi click vào các trạng thái
    listButtonStatus.forEach(button => {
        button.addEventListener("click", () => {
            // Lấy ra trạng thái hiện tại của button
            const status = button.getAttribute("button-status");

            // Nếu button là trạng thái hoạt hoặc dừng thì vào đây
            if (status) {
                url.searchParams.set("status", status);
            } else {
                // Nếu button ở trang thái tất cả
                url.searchParams.delete("status");
            }

            // Cập nhật lại url cho trang web
            window.location.href = url.href;
        });
    });

    // Thêm class active mặc định
    const statusCurrent = url.searchParams.get("status") || "";
    const buttonCurrent = document.querySelector(`[button-status="${statusCurrent}"]`);
    if(buttonCurrent) {
        buttonCurrent.classList.add("active");
    }
}




// End Button status 