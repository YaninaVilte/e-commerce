import { Router } from "express";
import ProductManager from "../dao/db/product-manager-db.js";
import ProductsModel from "../dao/models/products.model.js";

const manager = new ProductManager();

const viewsRouter = Router();

viewsRouter.get("/products", async (req, res) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let sort = req.query.sort === 'asc' ? 1 : -1;
    let query = req.query.query || '';

    let filter = query ? {
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
            // Solo comparar status si es 'true' o 'false'
            { status: query === 'true' ? true : query === 'false' ? false : undefined },
            // Comparar stock y price como números si el query es un número válido
            { stock: !isNaN(parseInt(query)) ? parseInt(query) : undefined },
            { price: !isNaN(parseFloat(query)) ? parseFloat(query) : undefined }
            ]
    } : {};

    const products = await manager.getProducts();
    const productsList = await ProductsModel.paginate(filter, {
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