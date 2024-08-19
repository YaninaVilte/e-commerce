import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

import ProductManager from "./dao/fs/managers/product-manager.js";
import CartManager from "./dao/fs/managers/cart-manager.js";

import mongoose from "mongoose";

const app = express();
const PORT = 8080;

const productManager = new ProductManager();
const cartManager = new CartManager("./src/dao/fs/data/carts.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Escuchando en http://localhost:${PORT}`);
});

// const io = new Server(httpServer);

// io.on("connection", async (socket) => {
//     socket.on("message", (data) => {
//         console.log("Nuevo cliente");
//     });
//     socket.emit("products", await productManager.getProducts());

//     socket.on("deleteProduct", async (productId) => {
//         await productManager.deleteProduct(productId);
//         socket.emit("products", await productManager.getProducts());
//     });

//     socket.on("productForm", async (data) => {
//         const { title, description, code, price, stock, category, thumbnails } = data;
//         await productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
//         socket.emit("products", await productManager.getProducts());
//     });
// });

mongoose.connect("mongodb+srv://yanivilte:coderhouse@cluster0.jyqtcqx.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Nos conectamos a la BD correctamente"))
    .catch((error) => console.log("Tenemos un error de conexión en la BD", error))

export { productManager };
export { cartManager };