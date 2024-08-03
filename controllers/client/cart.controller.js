const Cart = require("../../model/cart.model");
const Swal = require('sweetalert2');

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);

        const cart = await Cart.findOne({
            _id: cartId
        });

        const existProductInCart = cart.products.find(
            item => item.productId == productId
        );

        if (existProductInCart) {
            await Cart.updateOne(
                {
                    _id: cartId,
                    'products.productId': productId
                },
                {
                    $set: {
                        'products.$.quantity': quantity + existProductInCart.quantity
                    }
                }
            );
        } else {
            await Cart.updateOne(
                {
                    _id: cartId
                },
                {
                    $push: {
                        products: {
                            productId: productId,
                            quantity: quantity
                        }
                    }
                }
            );
        }

        res.redirect("back");
    } catch (error) {
        res.redirect("back");
    }
};
