const { Router } = require("express");
const multer = require("multer");
const path = require("path")

const Blog = require("../models/blogs")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
    }
});

const upload = multer({ storage: storage })

const router = Router();

router.get("/addblog", (req, res) => {
    return res.render("addBlog", {
        user: req.user
    });
});

router.post("/addblog", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;

    const blog = await Blog.create({
        title,
        body,
        coverImageURL:`/uploads/${req.file.filename}`
    })

    return res.render(`blog/${blog._id}`)
});

module.exports = router