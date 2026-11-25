const express = require("express");
const productController = require("../controllers/productController.js");
const verificarAdmin = require("../middlewares/adminMiddleware.js")

const router = express.Router();

router.get("/produtos", productController.listarProdutos);

router.get("/produtos/:id", productController.buscarProdutoPorId);

router.post("/produtos", verificarAdmin, productController.criarProduto);

router.put("/produtos/:id", verificarAdmin, productController.atualizarProduto);

router.delete("/produtos/:id", verificarAdmin, productController.deletarProduto);

router.get("/erro-teste", (req, res, next) => {
    try {
        throw new Error("Erro forçado para teste");
    } catch (error) {
        next(error);
    }
});

module.exports = router;