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



// Check Item
const inputCheckAll = document.querySelector("input[name='checkAll']");
if (inputCheckAll) {

  // Lấy ra danh sách các Item
  const listInputCheckItem = document.querySelectorAll("input[name='checkItem']");


  // Bắt sự kiện click vào nút checkAll
  inputCheckAll.addEventListener("click", () => {
    listInputCheckItem.forEach(inputCheckItem => {
      inputCheckItem.checked = inputCheckAll.checked;
    });
  });

  // Bắt sự kiện click vào nút checkItem
  listInputCheckItem.forEach(inputCheckItem => {
    inputCheckItem.addEventListener("click", () => {
      const listInputCheckItemChecked = document.querySelectorAll("input[name='checkItem']:checked");

      if(listInputCheckItemChecked.length == listInputCheckItem.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });


}
// End Check Item





// Box Actions
const boxActions = document.querySelector("[box-actions]");
if (boxActions) {
  const button = boxActions.querySelector("button");

  button.addEventListener("click", () => {
    const select = boxActions.querySelector("select");
    const status = select.value;

    const listInputChecked = document.querySelectorAll("input[name='checkItem']:checked");

   
    const ids = [];
    listInputChecked .forEach(input => {
      ids.push(input.value);
    });

    if ((ids.length > 0) && status != "") {
      const dataChangeMulti = {
        ids: ids,
        status: status,
      };

      const link = boxActions.getAttribute("box-actions");

      fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataChangeMulti),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        });
    } else {
      alert("Vui lòng chọn ít nhất 1 sản phẩm và chọn trạng thái!");
    }
  });
}
// // End Box Actions



// Xóa Bản Ghi
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const link = button.getAttribute("button-delete");
      fetch(link , {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })
    });
  });
}
// Hết Xóa Bản Ghi


// Đi sang trang trash
const pagesTrash = document.querySelector(".icon-trash");
if(pagesTrash) {
  pagesTrash.addEventListener("click", () => {
    const link = pagesTrash.getAttribute("link");

    window.location.href = link;
  });
}
// End Đi sang trang trash
