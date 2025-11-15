import { Schema, model, type Document } from "mongoose";

export interface ProfileDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<ProfileDocument>(
  {},
  { timestamps: true }
);

export const ProfileModel = model<ProfileDocument>("Profile", profileSchema);

