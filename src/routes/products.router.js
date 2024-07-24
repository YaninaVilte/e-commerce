import { Router } from "express";
import ProductManager from "../managers/product-manager.js";

const manager = new ProductManager("./src/data/products.json");
const router = Router();

router.get("/", async (req, res) => {
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


router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
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


router.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        const addedProduct = await manager.addProduct(newProduct);
        if (addedProduct) {
            res.status(201).json({ message: "Producto agregado exitosamente", product: addedProduct });
        } else {
            res.status(400).send("No se pudo agregar el producto");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: error.message });
    }
});


router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, code, stock, status = true, category } = req.body;
    try {
        await manager.updateProduct(Number(pid), { title, description, price, code, stock, status, category });
        res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al intentar editar producto");
    }
});


router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        await manager.deleteProduct(Number(pid));
        res.send("Producto eliminado exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar producto");
    }
});



export default router;