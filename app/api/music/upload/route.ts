import { uploadSingleFile } from "@/utils/cloudinary";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client"; // Make sure this path is correct
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const genre = formData.get("genre") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    const session = await auth.api.getSession({ headers: await headers() });
    const uploadedById = (formData.get("userId") as string) || session?.user.id;

    if (!file || !title || !artist || !uploadedById) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: title, artist, file, or userId",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileUrl = await uploadSingleFile(
      buffer,
      "music",
      file.type as string
    );

    // Save to DB
    const track = await prisma.music.create({
      data: {
        title,
        author: artist,
        genre,
        url: fileUrl,
        uploadedById,
        // Optionally add description if you add it to your schema
      },
    });

    return NextResponse.json({
      success: true,
      track,
      message: "Track uploaded successfully",
    });
  } catch (error) {
    console.error("[v0] Music upload error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
