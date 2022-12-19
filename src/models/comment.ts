import { Schema, model, ObjectId } from "mongoose";
import { DateTime } from "luxon";
//Schema
export type CommentDocument = {
  user: ObjectId;
  post: ObjectId;
  comment_text: string;
  timestamp: Date;
};
//Schema
const CommentSchema = new Schema<CommentDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  comment_text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
});

// CommentSchema.virtual("url").get(function () {
//   return `/comments/${this._id}`;
// });

// Virtual
CommentSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toFormat("MMMM dd yyyy, h:mm a");
});

//Export model

export const Comment = model<CommentDocument>("Comment", CommentSchema);
