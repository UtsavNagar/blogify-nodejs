const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser")
const mongodb = require("mongoose");

const userRoute = require("./routers/user");
const blogRoute = require("./routers/blog")
const { checkForAuthenticationCokkie } = require("./middlewares/authentication");

const Blogs = require("./models/blogs");

const app = express();

const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(checkForAuthenticationCokkie("token"));
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use(express.static(path.join(__dirname,"public")));          // static serving of public enabled

mongodb.connect("mongodb://127.0.0.1:27017/blogify")
    .then(() => console.log(`mongodb Connected`))
    .catch((e) => console.log(e))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
    const blogs = await Blogs.find({})

    return res.render("home", {
        user: req.user,
        blogs
    })
})

app.listen(PORT, () => console.log(`Server started st PORT:${8000}`));