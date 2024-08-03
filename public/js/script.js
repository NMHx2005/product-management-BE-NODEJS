// Hiển thị thông báo 1.5 giây
const button = document.querySelector("#addToCartForm");
const arletAddCart = document.querySelector(".arlet-addCart");
if (arletAddCart) {
    button.addEventListener("click", () => {
        arletAddCart.style.display = "block";
        setTimeout(() => {
            arletAddCart.style.display = "none";
        }, 10000);
    });
}
// Kết thúc thông báo sau khi thêm sản phẩm vào giỏ hàng


// Cập nhật số lượng sản phẩm trong giỏ hàng
const listInputQuantity = document.querySelectorAll("[cart] input[name='quantity']");
if(listInputQuantity.length > 0) {
  listInputQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("product-id");
      const quantity = parseInt(input.value);

      if(productId && quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    })
  })
}
// Hết Cập nhật số lượng sản phẩm trong giỏ hàng