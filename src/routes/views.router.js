import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";

const manager = new ProductManager();

const viewsRouter = Router();

viewsRouter.get("/products", async (req, res) => {
    const products = await manager.getProducts();
    res.render("home", { products });
}
)

viewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
}
)

export default viewsRouter;
