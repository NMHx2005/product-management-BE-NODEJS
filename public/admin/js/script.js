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

    // Lấy ra xem url hiện tại status đang ở trạng thái nào
    const statusCurrent = url.searchParams.get("status") || "";
    // Tìm button có trạng thái statusCurrent
    const buttonCurrent = document.querySelector(`[button-status="${statusCurrent}"]`);
    // Nếu tìm thấy button thì thêm class active vào button đó
    if(buttonCurrent) {
        buttonCurrent.classList.add("active");
    }
}
// End Button status 



// From search
const formSearch = document.querySelector("[form-search]");
if(formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    const keyword = event.target.elements.keyword.value;

    if(keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}
// End From search




// Pagination
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if(listButtonPagination.length > 0) {
  let url = new URL(window.location.href);

  listButtonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);

      window.location.href = url.href;
    });
  });
}
// End Pagination




// Button Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0) {
  buttonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const link = button.getAttribute("link");
      fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })
    });
  });
};

// End Button Change Status