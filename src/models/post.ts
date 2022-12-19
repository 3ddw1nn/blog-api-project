import { Schema, model, ObjectId } from "mongoose";
import { DateTime } from "luxon";
//Schema
export type PostDocument = {
  user: ObjectId;
  post_title: string;
  text: string;
  timestamp: Date;
};

const PostSchema = new Schema<PostDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post_title: { type: String, required: true, minLength: 1, maxLength: 50 },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
});

PostSchema.virtual("url").get(function () {
  return `/posts/${this._id}`;
});

// Virtual
PostSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toFormat("MMMM dd yyyy, h:mm a");
});

//Export model

export const Post = model<PostDocument>("Post", PostSchema);
