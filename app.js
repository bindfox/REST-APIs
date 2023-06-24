import Express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const app = Express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(Express.json());

mongoose
  .connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after successfully connecting to MongoDB
    app.listen(4500, () => {
      console.log(
        "Server is running. Please use this link: http://localhost:4500"
      );
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

const ecommerce = new mongoose.Schema({
  name: String,
  type: String,
  quantity: String,
});

const Product = new mongoose.model("Product", ecommerce);

// product creation
app.post("/api/product/new", async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
  });
});

//read product
app.get("/api/products", async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//update product
app.put("/api/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: true,
    runValidator: true,
  });
  res.status(200).json({
    success: true,
    Product,
  });
});

//delete product
app.delete("/api/product/delete/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product deletion successful",
  });
});
