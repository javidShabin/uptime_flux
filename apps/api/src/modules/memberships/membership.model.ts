import { Schema, model, type Document, Types } from "mongoose";

export interface MembershipDocument extends Document {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  createdAt: Date;
}

const membershipSchema = new Schema<MembershipDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
      default: "MEMBER",
    },
  },
  { timestamps: true }
);

// Prevent duplicates
membershipSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export const Membership = model<MembershipDocument>(
  "Membership",
  membershipSchema
);
