const { randomBytes, createHmac } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        require: true,
    },
    profileImage: {
        type: String,
        default: "./images/user_avatar.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

userSchema.pre("save", function (next) {
    const user = this                       // this is the user (we use normal function here not arrow function)

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword

    next()
})

userSchema.static("matchPasswordAndGenrateToken", async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User Not Found");

    const salt = user.salt;
    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

    if (userProvidedHash !== user.password) throw new Error("Incorrect Password");

    const token = createTokenForUser(user);

    return token;
});

const User = model("user", userSchema);

module.exports = User