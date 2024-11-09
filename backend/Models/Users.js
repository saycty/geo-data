import mongoose, { mongo } from "mongoose";
const userschema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    password: {
        type: String,
        minilength: 6,
        required:true,
    },
}, {
    timestamps: true,
});
const userModel = mongoose.model("User", userschema);
export default userModel;