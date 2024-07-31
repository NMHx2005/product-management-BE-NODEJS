// Khôi phục bản ghi
const restoreButtons = document.querySelectorAll("[restore]");
if (restoreButtons.length > 0) {
  restoreButtons.forEach(button => {
    button.addEventListener("click", () => {
      const link = button.getAttribute("restore");
      fetch(link, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 200) {
            window.location.reload();
          }
        });
    });
  });
}
// Hết Khôi phục bản ghi




// Xóa Vĩnh Viễn bản ghi
const listButtonDeleted = document.querySelectorAll("[button-deleted]");
if (listButtonDeleted.length > 0) {
    listButtonDeleted.forEach(button => {
      button.addEventListener("click", () => {
        const link = button.getAttribute("button-deleted");
        fetch(link, {
          method: "DELETE"
        })
         .then(res => res.json())
         .then(data => {
            if (data.code == 200) {
              window.location.reload();
            }
          });
      });
    });
}
// Hết Xóa Vĩnh Viễn bản ghi




// Check Item ProductCategory
const inputCheckAllCategory = document.querySelector("input[name='checkAllProductCategory']");
if (inputCheckAllCategory) {

  // Lấy ra danh sách các checkItemProductCategory
  const listInputCheckItem = document.querySelectorAll("input[name='checkItemProductCategory']");


  // Bắt sự kiện click vào nút checkAllProductCategory
  inputCheckAllCategory.addEventListener("click", () => {
    listInputCheckItem.forEach(inputCheckItem => {
      inputCheckItem.checked = inputCheckAllCategory.checked;
    });
  });

  // Bắt sự kiện click vào nút checkItemProductCategory
  listInputCheckItem.forEach(inputCheckItem => {
    inputCheckItem.addEventListener("click", () => {
      const listInputCheckItemChecked = document.querySelectorAll("input[name='checkItemProductCategory']:checked");

      if(listInputCheckItemChecked.length == listInputCheckItem.length) {
        inputCheckAllCategory.checked = true;
      } else {
        inputCheckAllCategory.checked = false;
      }
    });
  });
}
// End Check Item




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


// Check Item ArticleCategory
const inputCheckAllArticlesCategory = document.querySelector("input[name='checkAllArticlesCategory']");
if (inputCheckAllArticlesCategory) {

  // Lấy ra danh sách các checkItemProductCategory
  const listInputCheckItem = document.querySelectorAll("input[name='checkItemArticlesCategory']");


  // Bắt sự kiện click vào nút inputCheckAllArticlesCategory
  inputCheckAllArticlesCategory.addEventListener("click", () => {
    listInputCheckItem.forEach(inputCheckItem => {
      inputCheckItem.checked = inputCheckAllArticlesCategory.checked;
    });
  });

  // Bắt sự kiện click vào nút checkItemArticleCategory
  listInputCheckItem.forEach(inputCheckItem => {
    inputCheckItem.addEventListener("click", () => {
      const listInputCheckItemChecked = document.querySelectorAll("input[name='checkItemArticleCategory']:checked");

      if(listInputCheckItemChecked.length == listInputCheckItem.length) {
        inputCheckAllArticlesCategory.checked = true;
      } else {
        inputCheckAllArticlesCategory.checked = false;
      }
    });
  });
}
// End Check Item




// Check Item Article
const inputCheckAllArticles = document.querySelector("input[name='checkAllArticles']");
if (inputCheckAllArticles) {

  // Lấy ra danh sách các checkItemProductCategory
  const listInputCheckItem = document.querySelectorAll("input[name='checkItemArticles']");


  // Bắt sự kiện click vào nút checkAllProductCategory
  inputCheckAllArticles.addEventListener("click", () => {
    listInputCheckItem.forEach(inputCheckItem => {
      inputCheckItem.checked = inputCheckAllArticles.checked;
    });
  });

  // Bắt sự kiện click vào nút checkItemProductCategory
  listInputCheckItem.forEach(inputCheckItem => {
    inputCheckItem.addEventListener("click", () => {
      const listInputCheckItemChecked = document.querySelectorAll("input[name='checkItemProductCategory']:checked");

      if(listInputCheckItemChecked.length == listInputCheckItem.length) {
        inputCheckAllArticles.checked = true;
      } else {
        inputCheckAllArticles.checked = false;
      }
    });
  });
}
// End Check Item Articles




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



// show-alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  let time = showAlert.getAttribute("show-alert") || 3000;
  time = parseInt(time);

  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
// End show-alert


// Box actions
const boxActions = document.querySelector("[box-actions]");
if (boxActions) {
  const button = boxActions.querySelector("button");

  button.addEventListener("click", () => {
    const select = boxActions.querySelector("select");
    const status = select.value;

    // Lấy danh sách các mục được chọn
    const listInputCheckedProduct = document.querySelectorAll("input[name='checkItem']:checked");
    const listInputCheckedCategory = document.querySelectorAll("input[name='checkItemProductCategory']:checked");

    const ids = [];

    if (listInputCheckedProduct.length > 0) {
      listInputCheckedProduct.forEach(input => {
        ids.push(input.value);
      });
    } else if (listInputCheckedCategory.length > 0) {
      listInputCheckedCategory.forEach(input => {
        ids.push(input.value);
      });
    }

    if (ids.length > 0 && status !== "") {
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
        if (data.code === 200) {
          window.location.reload();
        }
      });
    } else {
      alert("Vui lòng chọn ít nhất 1 sản phẩm và chọn trạng thái!");
    }
  });
}

// End Box Actions




// Thay đổi vị trí
const listInputPosition = document.querySelectorAll("[name='position']");
if (listInputPosition.length > 0) {
  listInputPosition.forEach(input => {
    input.addEventListener("change", () => {
      const link = input.getAttribute("link");
      const position = input.value;

      fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position: position }),
      })
       .then(res => res.json())
       .then(data => {
          console.log(data);
        });

    });
  });
}
// Hết Thay đổi vị trí