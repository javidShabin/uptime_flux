import { Schema, model, type Document, Types } from "mongoose";

export interface AlertPolicyChannels {
  email: string[];
  telegram?: {
    botToken: string;
    chatId: string;
  };
  whatsapp?: {
    phoneNumber: string;
    apiKey: string;
  };
  webhook?: string[];
}

export interface AlertPolicyRules {
  failConsecutive: number;
  recoverConsecutive: number;
  escalateAfterMin: number;
}

export interface IAlertPolicy extends Document {
  projectId: Types.ObjectId;
  name: string;
  rules: AlertPolicyRules;
  channels: AlertPolicyChannels;
  createdAt: Date;
  updatedAt: Date;
}

const AlertPolicySchema = new Schema<IAlertPolicy>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    rules: {
      failConsecutive: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      recoverConsecutive: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      escalateAfterMin: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
    },
    channels: {
      email: {
        type: [String],
        required: true,
        default: [],
        validate: {
          validator: (v: string[]) => Array.isArray(v) && v.length > 0,
          message: "At least one email is required",
        },
      },
      telegram: {
        type: {
          botToken: { type: String, required: true, trim: true },
          chatId: { type: String, required: true, trim: true },
        },
        required: false,
      },
      whatsapp: {
        type: {
          phoneNumber: { type: String, required: true, trim: true },
          apiKey: { type: String, required: true, trim: true },
        },
        required: false,
      },
      webhook: {
        type: [String],
        required: false,
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AlertPolicySchema.index({ projectId: 1 });
AlertPolicySchema.index({ projectId: 1, name: 1 }, { unique: true });

export const AlertPolicyModel = model<IAlertPolicy>("AlertPolicy", AlertPolicySchema);

