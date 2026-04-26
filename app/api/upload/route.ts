import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

function hasValidCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(
    cloudName &&
      apiKey &&
      apiSecret &&
      !["your-cloud", "demo"].includes(cloudName) &&
      !apiKey.includes("1234567890") &&
      !apiSecret.includes("your-secret")
  );
}

async function saveLocally(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const extension = extname(file.name) || (file.type === "image/png" ? ".png" : ".jpg");
  const filename = `${randomUUID()}${extension}`;
  await writeFile(join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let url: string;

    if (hasValidCloudinaryConfig()) {
      try {
        url = await new Promise<string>((resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            {
              folder: "tourism-platform",
              resource_type: "image"
            },
            (error, result) => {
              if (error || !result?.secure_url) {
                reject(error || new Error("Upload failed"));
                return;
              }
              resolve(result.secure_url);
            }
          );
          upload.end(buffer);
        });
      } catch {
        url = await saveLocally(file);
      }
    } else {
      url = await saveLocally(file);
    }

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
