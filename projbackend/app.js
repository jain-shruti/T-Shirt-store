const mongoose = require ('mongoose');
require("dotenv").config();
const express = require('express');
const app= express(); 
const cookieParser = require("cookie-parser");
const cors = require("cors");
//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/user');
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment")

//DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB connected");
}).catch(
    console.log("DB GOT OOPSS")
);

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes)

//PORT
const port = process.env.PORT || 8000;
app.get("/", (req,res)=> {
    return res.send("hello world")
});


// app.post("/payment", (req, res) => {
//     const {product, token} = req.body;
//     console.log("Product ", product);
//     console.log("Price ", product.price);
//     const idempotencyKey = uuid()

//     return stripe.customers.create({
//         email: token.email,
//         source: token.id
//     })
//     .then( customer => {
//         stripe.charges.create({
//             amount: product.price * 100,
//             currency: 'usd',
//             customer: customer.id,
//             receipt_email: token.email,
//             description: product.name,
//             shipping: {
//                 name: token.card.name,
//                 address: {
//                     country:token.card.address_country
//                 }
//             }
//         }, {idempotencyKey})
//     })
//     .then( result => res.status(200).json(result) )
//     .catch(err => console.log(err))
// })

app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
})
