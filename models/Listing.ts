import { Schema, model, models, type Document } from "mongoose";

export type ListingStatus = "pending" | "approved" | "rejected";

export interface IListing extends Document {
  owner: Schema.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  location: string;
  country?: string;
  address?: string;
  images: string[];
  price?: number;
  priceFrom?: number;
  currency?: string;
  amenities: string[];
  tags: string[];
  highlights: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: ListingStatus;
  views: number;
  featured: boolean;
  ratingAverage: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    location: { type: String, required: true, index: true },
    country: { type: String, index: true },
    address: { type: String },
    images: [{ type: String, required: true }],
    price: { type: Number },
    priceFrom: { type: Number },
    currency: { type: String, default: "USD" },
    amenities: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    contactInfo: {
      phone: String,
      email: String,
      website: String
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      tiktok: String,
      x: String
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }
    ,
    ratingAverage: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ListingSchema.index({
  title: "text",
  description: "text",
  location: "text",
  country: "text",
  category: "text",
  subcategory: "text",
  tags: "text",
  amenities: "text"
});

export default models.Listing || model<IListing>("Listing", ListingSchema);
