const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const helmet = require("helmet");

// Security Middleware
app.use(helmet()); // Adds security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://food-delivery-tau-sooty.vercel.app"],
        connectSrc: ["'self'", "https://food-delivery-tau-sooty.vercel.app"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
  })
);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Serve React Frontend
app.use(express.static(path.join(__dirname, "build")));

// API Routes
const singUpRoute = require("./Routes/SingUp");
const login = require("./Routes/Login");
const verifyCode = require("./Routes/VerifyCode");
const logout = require("./Routes/Logout");
const verifyUserLogin = require("./Routes/CheackUserLogin");
const UserDelete = require("./Routes/UserDelete");
const showAllUser = require("./Routes/ShowUser");
const forgetPassword = require("./Routes/ForgetPasswod");
const newPassword = require("./Routes/newPassword");
const HeaderImageUpload = require("./Routes/HeaderImageupload");
const showHeaderImages = require("./Routes/ShowHeaderImages");
const deleteHeaderImage = require("./Routes/DeleteHeaderImage");
const AddFood = require("./Routes/AddFoods");
const ShowFoods = require("./Routes/ShowFoods");
const DeleteFood = require("./Routes/DeleteFood");
const order = require("./Routes/order");
const ShowOrders = require("./Routes/ShowOrders");
const changeOrderStatus = require("./Routes/ChangeorderStatus");
const viewOrderStatus = require("./Routes/viewOrderStatus");
const deleteOrder = require("./Routes/DeleteOrder");
const cancleOrder = require("./Routes/CancleOrder");
const toggleStore = require("./Routes/ToggleStore");
const showStoreToggle = require("./Routes/ShowStoreToggle");

app.use("/api/", login);
app.use("/api/", singUpRoute);
app.use("/api/", forgetPassword);
app.use("/api/", verifyCode);
app.use("/api/", newPassword);

// Protected Routes
app.use("/api/", verifyUserLogin);
app.use("/api/", logout);
app.use("/api/", UserDelete);
app.use("/api/", showAllUser);
app.use("/api/", HeaderImageUpload);
app.use("/api/", showHeaderImages);
app.use("/api/", deleteHeaderImage);
app.use("/api/", AddFood);
app.use("/api/", ShowFoods);
app.use("/api/", DeleteFood);
app.use("/api/", order);
app.use("/api/", ShowOrders);
app.use("/api/", changeOrderStatus);
app.use("/api/", viewOrderStatus);
app.use("/api/", deleteOrder);
app.use("/api/", cancleOrder);
app.use("/api/", toggleStore);
app.use("/api/", showStoreToggle);

// React App Catch-All Route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
