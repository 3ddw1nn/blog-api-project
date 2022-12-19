"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const luxon_1 = require("luxon");
const PostSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    post_title: { type: String, required: true, minLength: 1, maxLength: 50 },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
});
PostSchema.virtual("url").get(function () {
    return `/posts/${this._id}`;
});
// Virtual
PostSchema.virtual("date_formatted").get(function () {
    return luxon_1.DateTime.fromJSDate(this.timestamp).toFormat("MMMM dd yyyy, h:mm a");
});
//Export model
exports.Post = (0, mongoose_1.model)("Post", PostSchema);
