import { Schema, model, type Document, Types } from "mongoose";

export interface IOrg extends Document {
  name: string;
  slug: string;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrgSchema = new Schema<IOrg>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
OrgSchema.index({ slug: 1 }, { unique: true });
OrgSchema.index({ ownerId: 1 });

export const OrgModel = model<IOrg>("Org", OrgSchema);

