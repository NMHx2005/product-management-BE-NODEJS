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
