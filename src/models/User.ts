import { Schema, model, models, type Model, type HydratedDocument } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: { type: String, required: true, minlength: 60, select: false },
    profileImage: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete (ret as Record<string, unknown>).password;
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  },
);

UserSchema.index({ email: 1 }, { unique: true });

const User: Model<IUser> =
  (models.User as Model<IUser>) ?? model<IUser>("User", UserSchema);

export default User;
