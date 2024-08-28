import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import ProductsModel from "../dao/models/products.model.js";

const manager = new ProductManager();

const viewsRouter = Router();

viewsRouter.get("/products", async (req, res) => {
    let page = req.query.page || 1;
    let limit = 10;
    let sort = req.query.sort === 'asc' ? 1 : -1;
    

    const products = await manager.getProducts();
    const productsList = await ProductsModel.paginate({}, {
        limit, 
        page,
        sort: { price: sort } 
    });


    res.render("home", {
        products: productsList.docs,
        hasPrevPage: productsList.hasPrevPage,
        hasNextPage: productsList.hasNextPage,
        prevPage: productsList.prevPage,
        nextPage: productsList.nextPage,
        currentPage: productsList.page,
        totalPages: productsList.totalPages
    })
}
)

viewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
}
)

export default viewsRouter;
