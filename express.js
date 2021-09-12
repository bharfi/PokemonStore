/*
Name: Bharath Prabakaran
Modified on: 12 September 2021 12:11:33
*/
const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Product = require("./models/product");
const AppError = require("./AppError");


mongoose
  .connect("mongodb://localhost:27017/FarmApp", {
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
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(
    "\n******************************************************************"
  );
  next();
});
// app.use((req,res,next) =>{
//   req.requestTime = Date.now();
//     console.log(req.method, req.path);
//     next();
// })

function WrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => {
      next(e);
    });
  };
}

app.get("/dog", (req, res) => {
  res.send("WOOF!");
});

app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "All" });
  }
});

app.get(
  "/products/new",
  WrapAsync((req, res, next) => {
    throw new AppError("Not Allowed", 402);
    res.render("products/new");
  })
);

app.post(
  "/products",
  WrapAsync(async (req, res, next) => {
    const newProduct = await new Product(req.body);
    await newProduct.save();
    //console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
  })
);

app.get(
  "/products/:id",
  WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);
    //console.log(foundProduct);
    const product = foundProduct;
    if (!product) {
      // Async Error Handling
      return next(new AppError("Product Not Found", 404));
    }
    res.render("products/show", { product });
    //throw new AppError("Hello there", 401)
  })
);

app.get(
  "/products/:id/edit",
  WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      // Async Error Handling
      return next(new AppError("Product Not Found", 404));
    }
    res.render("products/edit", { product });
  })
);

app.put(
  "/products/:id",
  WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });
    if (!product) {
      // Async Error Handling
      return next(new AppError("Product Not Found", 404));
    }
    //console.log(req.body);
    res.redirect(`/products/${product._id}`);
  })
);

app.delete(
  "/products/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id, req.body);
    res.redirect("/products");
  })
);

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("App is listening in port 3000");
});
