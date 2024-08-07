import { Router } from "express";
import { productManager } from "../app.js";

const viewsRouter = Router();

viewsRouter.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
}
)

viewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
}
)

export default viewsRouter;
