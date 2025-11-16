import { Schema, model, type Document, Types } from "mongoose";
import { Role } from "../rbac/permissions.js";

export interface IMember extends Document {
  orgId: Types.ObjectId;
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Org",
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    role: {
      type: String,
      enum: [Role.OWNER, Role.MAINTAINER, Role.VIEWER],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: user can only have one role per project
MemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });
MemberSchema.index({ projectId: 1 });
MemberSchema.index({ userId: 1 });
MemberSchema.index({ orgId: 1 });

export const MemberModel = model<IMember>("Member", MemberSchema);

