/*
Name: Bharath Prabakaran
Modified on: 12 September 2021 12:11:33
*/
const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
//const methodOverride = require("method-override");
const Product = require("./models/product");
const AppError = require("./AppError");

mongoose
  .connect("mongodb://localhost:27017/PokemonApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    console.log("Oops Mongo Error");
    console.log(err);
  });

app.set("views", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
//app.use(methodOverride("_method"));
app.use(morgan("dev"));



// Error handling for Async Functions
function WrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => {
      next(e);
    });
  };
}

// Home Page
app.get("/", WrapAsync(async (req, res, next) => {
  const { type } = req.query;
  if (type) {
    const pokedex = await Product.find({ type });
    res.render("index", { pokedex, type });
  } else {
    const pokedex = await Product.find({});
    res.render("index", { pokedex, type: "All" });
  }
}));



// app.post(
//   "/products",
//   WrapAsync(async (req, res, next) => {
//     const newProduct = await new Product(req.body);
//     await newProduct.save();
//     //console.log(newProduct);
//     res.redirect(`/products/${newProduct._id}`);
//   })
// );

app.get(
  "/:id",
  WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);
    //console.log(foundProduct);
    const pokemon = foundProduct;
    if (!pokemon) {
      // Async Error Handling
      return next(new AppError("Product Not Found", 404));
    }
    res.render("show", { pokemon });
    //throw new AppError("Hello there", 401)
  })
);


// app.put(
//   "/products/:id",
//   WrapAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const product = await Product.findByIdAndUpdate(id, req.body, {
//       runValidators: true,
//     });
//     if (!product) {
//       // Async Error Handling
//       return next(new AppError("Product Not Found", 404));
//     }
//     //console.log(req.body);
//     res.redirect(`/products/${product._id}`);
//   })
// );


//error handling for express
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});


app.listen(3000, () => {
  console.log("App is listening in port 3000");
});
