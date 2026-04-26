import { connectDB } from "./db";
import Activity, { type ActivityType } from "@/models/Activity";

type LogActivityInput = {
  type: ActivityType;
  title: string;
  description?: string;
  actor?: string;
  actorName?: string;
  listing?: string;
  listingTitle?: string;
  meta?: Record<string, unknown>;
};

export async function logActivity(input: LogActivityInput) {
  try {
    await connectDB();
    await Activity.create({
      type: input.type,
      title: input.title,
      description: input.description,
      actor: input.actor,
      actorName: input.actorName,
      listing: input.listing,
      listingTitle: input.listingTitle,
      meta: input.meta
    });
  } catch {
    // Activity logging should never break core flows.
  }
}
