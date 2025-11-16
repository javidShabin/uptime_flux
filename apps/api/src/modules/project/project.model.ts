import { Schema, model, type Document, Types } from "mongoose";

export interface IProject extends Document {
  orgId: Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Org",
      index: true,
    },
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
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: slug must be unique within an organization
ProjectSchema.index({ orgId: 1, slug: 1 }, { unique: true });
ProjectSchema.index({ orgId: 1 });
ProjectSchema.index({ createdAt: -1 });

export const ProjectModel = model<IProject>("Project", ProjectSchema);
