import { NextResponse } from "next/server";
import { initializeApp, cert } from "firebase-admin/app";

let firebaseAdminInitialized = false;

function initializeFirebaseAdmin() {
  if (!firebaseAdminInitialized) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY!
    );
    initializeApp({
      credential: cert(serviceAccount),
    });
    firebaseAdminInitialized = true;
    console.log("Firebase Admin SDK initialized");
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ functionName: string }> }
) {
  try {
    initializeFirebaseAdmin();
  } catch (error) {
    if (process.env.NODE_ENV !== "development") {
      console.error("Firebase Admin SDK initialization error:", error);
      return NextResponse.json(
        { error: "Firebase Admin SDK initialization failed" },
        { status: 500 }
      );
    } else {
      // Just normal hot-reload error in development
    }
  }

  try {
    const { functionName } = await params;
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const projectId = process.env.GCLOUD_PROJECT;
    const region = process.env.FUNCTION_REGION || "us-central1";
    let functionUrl = "";
    if (process.env.NODE_ENV === "development") {
      functionUrl = `http://localhost:5001/${projectId}/${region}/${functionName}`;
    } else {
      functionUrl = `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;
    }

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    const resultData = await response.json();
    return NextResponse.json({ prediction: resultData.prediction });
  } catch (error) {
    console.error("Function call error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Function execution failed" },
      { status: 500 }
    );
  }
}
