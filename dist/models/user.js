"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
//Schema
const UserSchema = new mongoose_1.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    job_title: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin_status: { type: Boolean, default: false },
    image: { type: String, required: false },
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
// //Virtual
// UserSchema.virtual("url").get(function () {
//   return `/user/${this._id}`;
// });
// // Virtual for author's full name
// UserSchema.virtual("full_name").get(function () {
//   // To avoid errors in cases where an author does not have either a family name or first name
//   // We want to make sure we handle the exception by returning an empty string for that case
//   let fullname = "";
//   if (this.first_name && this.last_name) {
//     fullname = `${this.first_name} ${this.last_name} `;
//   }
//   if (!this.first_name || !this.last_name) {
//     fullname = "";
//   }
//   return fullname;
// });
//Export model
// const User = mongoose.model("User", UserSchema);
// export default User;
