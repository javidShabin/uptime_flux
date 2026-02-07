import { Schema, model, type Document, Types } from "mongoose";

export interface InvitationDocument extends Document {
  projectId: Types.ObjectId;
  email: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
  token: string;
  invitedBy: Types.ObjectId;
  expiresAt: Date;
  acceptedAt?: Date;
}

const invitationSchema = new Schema<InvitationDocument>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "MEMBER", "VIEWER"],
      default: "MEMBER",
    },
    token: { type: String, required: true },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

export const Invitation = model<InvitationDocument>(
  "Invitation",
  invitationSchema
);
