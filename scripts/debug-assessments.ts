/**
 * Debug script to see the actual structure of assessments
 */

import axios from "axios";

async function debugAssessments() {
  try {
    const response = await axios.get(
      "https://assessments-api-ten.vercel.app/api/assessments/search?phoneNumber=0812345678",
    );

    const assessments = response.data.data;
    console.log("\n🔍 Assessment Structure Debug\n");
    console.log("═══════════════════════════════════════════════════════\n");

    assessments.forEach((assessment: any, index: number) => {
      console.log(`\n📋 Assessment #${index + 1}:`);
      console.log(JSON.stringify(assessment, null, 2));
      console.log("\n---\n");
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

debugAssessments();
