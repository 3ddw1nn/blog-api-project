"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const luxon_1 = require("luxon");
//Schema
const CommentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    comment_text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
});
// CommentSchema.virtual("url").get(function () {
//   return `/comments/${this._id}`;
// });
// Virtual
CommentSchema.virtual("date_formatted").get(function () {
    return luxon_1.DateTime.fromJSDate(this.timestamp).toFormat("MMMM dd yyyy, h:mm a");
});
//Export model
exports.Comment = (0, mongoose_1.model)("Comment", CommentSchema);
