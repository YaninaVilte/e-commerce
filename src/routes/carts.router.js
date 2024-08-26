import { Router } from "express";
import CartManager from "../dao/db/cart-manager-db.js";


const cartManager = new CartManager();
const cartsRouter = Router();


cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
})

cartsRouter.get("/:cid", async (req, res) => {
    let cartID = req.params.cid;

    try {
        const cart = await cartManager.getCartByID(cartID);
        res.json(cart.products);
    } catch (error) {
        res.status(500).send("Error al obtener los productos del carrito");
    }
})

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    let cartID = req.params.cid;
    let productID = req.params.pid;
    let quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartManager.addProductsToCart(cartID, productID, quantity);
        res.json(updatedCart.products);
    } catch (error) {
        res.status(500).send("Error al agregar un producto al carrito");
    }
})

// ir viendo desde aca

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
    const { pid, cid } = req.params;
    try {
        const cart = await cartManager.getCartByID(cid);
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        // Busca el índice del producto dentro del carrito
        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).send("Producto no encontrado en el carrito");
        }

        // Elimina el producto del carrito
        cart.products.splice(productIndex, 1);

        // Guarda el carrito actualizado
        await cart.save();

        res.send("Producto eliminado exitosamente del carrito");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar producto del carrito");
    }
});

// PUT api / carts /:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba. No entiendo que debe hacer aca
cartsRouter.put("/:cid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, code, stock, status = true, category } = req.body;
    try {
        await manager.updateProduct(String(pid), { title, description, price, code, stock, status, category });
        res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al intentar editar producto");
    }
});

// PUT api / carts /: cid / products /:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Verificar que la cantidad sea válida
    if (quantity === undefined || quantity <= 0) {
        return res.status(400).send("Cantidad inválida");
    }

    try {
        // Llama al método para actualizar la cantidad del producto en el carrito
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json(updatedCart.products);  // Devolver los productos actualizados del carrito
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al actualizar la cantidad del producto");
    }
});


export default cartsRouter;