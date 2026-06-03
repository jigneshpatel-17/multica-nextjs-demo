import {
  Schema,
  Types,
  model,
  models,
  type Model,
  type HydratedDocument,
} from "mongoose";

export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;
export const TASK_STATUSES = ["Pending", "In Progress", "Completed"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface ITask {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category?: string;
  dueDate?: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskDocument = HydratedDocument<ITask>;

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 1000 },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "Medium",
      required: true,
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "Pending",
      required: true,
    },
    category: { type: String, trim: true, maxlength: 50, default: null },
    dueDate: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  },
);

TaskSchema.index({ userId: 1, isDeleted: 1, status: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: 1 });
TaskSchema.index({ userId: 1, title: "text", description: "text" });

const Task: Model<ITask> =
  (models.Task as Model<ITask>) ?? model<ITask>("Task", TaskSchema);

export default Task;
