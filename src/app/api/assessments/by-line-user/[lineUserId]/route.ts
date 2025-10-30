// src/app/api/assessments/by-line-user/[lineUserId]/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lineUserId: string }> },
) {
  try {
    const { lineUserId } = await params;

    if (!lineUserId) {
      return NextResponse.json(
        { success: false, error: "LINE user ID is required" },
        { status: 400 },
      );
    }

    // TODO: Implement database query to find the latest assessment by LINE user ID
    // For now, return a placeholder response
    console.log("Searching for assessments for LINE user ID:", lineUserId);

    // Example query (replace with your actual database query):
    // const assessment = await supabase
    //   .from('assessments')
    //   .select('*')
    //   .eq('line_user_id', lineUserId)
    //   .order('created_at', { ascending: false })
    //   .limit(1)
    //   .single();

    // Placeholder response
    return NextResponse.json({
      success: false,
      message: "Feature not yet implemented. Please create a new assessment.",
      assessment: null,
    });

    // When implemented, return like this:
    // if (assessment) {
    //   return NextResponse.json({
    //     success: true,
    //     assessment: assessment,
    //   });
    // } else {
    //   return NextResponse.json({
    //     success: false,
    //     message: "No assessment found for this LINE user",
    //     assessment: null,
    //   });
    // }
  } catch (error) {
    console.error("Error fetching assessment by LINE user ID:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch assessment",
      },
      { status: 500 },
    );
  }
}
