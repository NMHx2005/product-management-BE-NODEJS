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