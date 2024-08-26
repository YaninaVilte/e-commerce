import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const manager = new ProductManager();
const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    const limit = req.query.limit
    try {
        const arrayProducts = await manager.getProducts();
        if (limit) {
            res.send(arrayProducts.slice(0, limit));
        } else {
            res.send(arrayProducts);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});


productsRouter.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await manager.getProductById(id);
        if (!product) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.send(product);
        }
    } catch (error) {
        res.status(500).send("Error el id en los productos");
    }
});


productsRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        await manager.addProduct(newProduct);
        res.status(201).send("Producto agregado");
    } catch (error) {
        res.status(500).send("Error del servidor")
    }
})



productsRouter.put("/:pid", async (req, res) => {
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


productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        await manager.deleteProduct(String(pid));
        res.send("Producto eliminado exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar producto");
    }
});





export default productsRouter;