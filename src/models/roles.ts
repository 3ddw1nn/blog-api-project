import { Schema, model } from "mongoose";

export type RolesDocument = {
  roles_name: string;
  roles_id: string;
};

//Schema
const RolesSchema = new Schema({
  roles_name: { type: String, required: true },
  roles_id: { type: String, required: true },
});

export const Roles = model<RolesDocument>("Roles", RolesSchema);
