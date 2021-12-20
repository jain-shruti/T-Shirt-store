var express = require('express');
var router = express.Router();

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getProductById, createProduct, getProduct, photo, removeProduct, updateProduct, getAllProducts, getAllUniqueCategories } = require("../controllers/product")

//params
router.param("userId", getUserById);
router.param("productId", getProductById);

//actual routes

//create route
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//delete route
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, removeProduct);

//update route
router.put("/product/update/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//listing route
router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories)

module.exports = router;