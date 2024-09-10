const { Router } = require("express");
const multer = require("multer");
const path = require("path")

const Blog = require("../models/blogs")
const Comment = require("../models/comment")

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

router.get("/:id",async (req,res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId : req.params.id}).populate("createdBy");
    return res.render("blog",{
        user : req.user,
        blog,
        comments
    })
});

router.post("/addblog", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;

    const blog = await Blog.create({
        title,
        body,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy : req.user._id
    })

    return res.redirect(`/blog/${blog._id}`)
});

router.post("/comment/:blogId", async (req,res) => {
    await Comment.create({
        blogId : req.params.blogId,
        content : req.body.content,
        createdBy : req.user._id 
    })

    return res.redirect(`/blog/${req.params.blogId}`)
});

module.exports = router