const Product = require("../models/product")
const formiddable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec( (err, product) => {
        if(err){
            return res.status(400).json({
                error: "product not found"
            });
        }
        req.product = product;
        next();
    });
};

exports.createProduct = (req, res) => {
    let form = new formiddable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            });
        }

        //destructure the fields
        const {name, description, price, category, stock } = fields;
        if(!name || !description || !price || !category || !stock ){
            return res. status(400).json({
                error: "Please include all fields"
            });
        }

        //todo restrictions on field

        let product = new Product(fields);

        //handle file
        if(file.photo){
            if(file.photo.size > 3000000)
                return res.status(400).json({
                    error: "File too big"
                });
                product.photo.data = fs.readFileSync(file.photo.path);
                product.photo.contentType = file.photo.type;
        }
        product.save((err, product) => {
            if(err){
                console.log(err);
                return res.status(400).json({
                    error: "Saving product failed"
                })
            }   
            res.json(product);
        });
});
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.removeProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete product"
            })
        }
        res.json({
            message: "Deletion was a success",
            deletedProduct
        })
    });
}

exports.updateProduct = (req, res) => {
    let form = new formiddable.IncomingForm();
    form.keepExtensions = true;
    // console.log("Update")
    form.parse(req, (err, fields, file) => {
        console.log(fields, file)
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            });
        }
        //destructure the fields
        const {name, description, price, category, stock } = fields;
        if(!name || !description || !price || !category || !stock ){
            return res. status(400).json({
                error: "Please include all fields"
            });
        }

        //updation code
        let product = req.product;
        product = _.extend(product, fields);

        //handle file
        if(file.photo){
            if(file.photo.size > 3000000)
                return res.status(400).json({
                    error: "File too big"
                });
                product.photo.data = fs.readFileSync(file.photo.path);
                product.photo.contentType = file.photo.type;
        }

        //save product in db
        product.save((err, product) => {
            if(err){
                console.log(err);
                return res.status(400).json({
                    error: "Updation of product failed"
                })
            }   
            res.json(product);
        });
    });
}


//product listing
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec( (err, products) => {
        if(err){
            return res.status(400).json({
                error: "Oops! Can't find the products."
            })
        }
        res.json(products);
    })
    
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error: "No category found"
            });
        }
        res.json(category);
    })
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: { stock: -prod.count, sold: +prod.count }}
            }
        }
    })
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: "Bukk operation failed"
            })
        }
        next();
    })
}

