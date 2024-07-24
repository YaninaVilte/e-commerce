import { Router } from "express";
import CartManager from "../managers/cart-manager.js";


const cartManager = new CartManager("./src/data/carts.json");
const router = Router();


router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
})

router.get("/:cid", async (req, res) => {
    let cartID = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartByID(cartID);
        res.json(cart.products);
    } catch (error) {
        res.status(500).send("Error al obtener los productos del carrito");
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    let cartID = parseInt(req.params.cid);
    let productID = req.params.pid;
    let quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartManager.addProductsToCart(cartID, productID, quantity);
        res.json(updatedCart.products);
    } catch (error) {
        res.status(500).send("Error al agregar un producto al carrito");
    }
})

export default router;