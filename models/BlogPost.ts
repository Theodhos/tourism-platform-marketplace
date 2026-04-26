import { Schema, model, models, type Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: Schema.Types.ObjectId;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: String,
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    published: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export default models.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);
