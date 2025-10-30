/**
 * Script to check if assessments in the database have the 'type' field at root level
 * AND test the extraction logic
 *
 * This script:
 * 1. Fetches a sample of assessments from the API
 * 2. Checks if they have type at root level
 * 3. Tests the extraction logic to add type field
 * 4. Shows before/after comparison
 *
 * Run with: npx tsx scripts/check-assessment-types.ts
 */

import axios from "axios";

interface Assessment {
  _id: string;
  phoneNumber: string;
  status: string;
  type?: string; // This is what we're checking for
  sellNowServiceInfo?: { type?: string; [key: string]: any };
  pawnServiceInfo?: { type?: string; [key: string]: any };
  consignmentServiceInfo?: { type?: string; [key: string]: any };
  refinanceServiceInfo?: { type?: string; [key: string]: any };
  iphoneExchangeServiceInfo?: { type?: string; [key: string]: any };
  tradeInServiceInfo?: { type?: string; [key: string]: any };
  conditionInfo?: any;
}

interface ApiResponse {
  success: boolean;
  data: Assessment[];
}

/**
 * Extract type from service info (simulates what our fetch functions do)
 * UPDATED: Infer type from which service info object exists
 */
function extractTypeFromServiceInfo(rec: Assessment): Assessment {
  // @ts-ignore
  let type = rec.type;
  if (!type) {
    // Check which service info exists and infer the type
    if (rec.sellNowServiceInfo) {
      type = "SELL_NOW";
    } else if (rec.pawnServiceInfo) {
      type = "PAWN";
    } else if (rec.consignmentServiceInfo) {
      type = "CONSIGNMENT";
    } else if (rec.refinanceServiceInfo) {
      type = "REFINANCE";
    } else if (rec.iphoneExchangeServiceInfo) {
      type = "IPHONE_EXCHANGE";
    } else if (rec.tradeInServiceInfo) {
      type = "TRADE_IN";
    }
  }

  return {
    ...rec,
    ...(type && { type }),
  };
}

async function checkAssessmentTypes() {
  console.log("🔍 Checking assessments for type field...\n");

  try {
    // Fetch assessments from the API
    // Using a phone number that likely has assessments
    const response = await axios.get<ApiResponse>(
      "https://assessments-api-ten.vercel.app/api/assessments/search?phoneNumber=0812345678",
    );

    if (!response.data || !response.data.success || !Array.isArray(response.data.data)) {
      console.log("❌ Invalid response from API");
      return;
    }

    const assessments = response.data.data;
    console.log(`📊 Found ${assessments.length} assessments\n`);

    if (assessments.length === 0) {
      console.log("⚠️  No assessments found for this phone number");
      console.log("💡 Try using a different phone number that has reserved assessments\n");
      return;
    }

    // Analyze each assessment
    const stats = {
      totalAssessments: assessments.length,
      withRootType: 0,
      withoutRootType: 0,
      withServiceInfo: 0,
      reserved: 0,
      completed: 0,
      pending: 0,
      typeDistribution: {} as Record<string, number>,
      serviceInfoTypes: {} as Record<string, number>,
    };

    assessments.forEach((assessment, index) => {
      console.log(`\n📋 Assessment #${index + 1} (ID: ${assessment._id})`);
      console.log(`   Status: ${assessment.status}`);

      const originalType = assessment.type;

      // Check for root-level type
      if (assessment.type) {
        console.log(`   ✅ Has root-level type: ${assessment.type}`);
        stats.withRootType++;
        stats.typeDistribution[assessment.type] =
          (stats.typeDistribution[assessment.type] || 0) + 1;
      } else {
        console.log(`   ❌ No root-level type field`);
        stats.withoutRootType++;
      }

      // Check for service info
      const serviceInfos = [
        { name: "sellNowServiceInfo", data: assessment.sellNowServiceInfo },
        { name: "pawnServiceInfo", data: assessment.pawnServiceInfo },
        { name: "consignmentServiceInfo", data: assessment.consignmentServiceInfo },
        { name: "refinanceServiceInfo", data: assessment.refinanceServiceInfo },
        { name: "iphoneExchangeServiceInfo", data: assessment.iphoneExchangeServiceInfo },
        { name: "tradeInServiceInfo", data: assessment.tradeInServiceInfo },
      ];

      const activeService = serviceInfos.find((s) => s.data);
      if (activeService) {
        console.log(`   📦 Has service info: ${activeService.name}`);
        if (activeService.data?.type) {
          console.log(`      - Service info type: ${activeService.data.type}`);
          stats.serviceInfoTypes[activeService.data.type] =
            (stats.serviceInfoTypes[activeService.data.type] || 0) + 1;
        }
        stats.withServiceInfo++;

        // Test extraction logic
        if (!originalType) {
          const extracted = extractTypeFromServiceInfo(assessment);
          if (extracted.type) {
            console.log(`   ✨ AFTER EXTRACTION: type = "${extracted.type}"`);
          }
        }
      }

      // Track status
      if (assessment.status === "reserved") stats.reserved++;
      if (assessment.status === "completed") stats.completed++;
      if (assessment.status === "pending") stats.pending++;
    });

    // Print summary
    console.log("\n\n═══════════════════════════════════════════════════════");
    console.log("📊 SUMMARY");
    console.log("═══════════════════════════════════════════════════════\n");

    console.log(`Total Assessments: ${stats.totalAssessments}`);
    console.log(
      `Assessments WITH root-level type: ${stats.withRootType} (${Math.round((stats.withRootType / stats.totalAssessments) * 100)}%)`,
    );
    console.log(
      `Assessments WITHOUT root-level type: ${stats.withoutRootType} (${Math.round((stats.withoutRootType / stats.totalAssessments) * 100)}%)`,
    );
    console.log(`Assessments with service info: ${stats.withServiceInfo}`);

    console.log("\nStatus Distribution:");
    console.log(`  - Reserved: ${stats.reserved}`);
    console.log(`  - Completed: ${stats.completed}`);
    console.log(`  - Pending: ${stats.pending}`);

    if (Object.keys(stats.typeDistribution).length > 0) {
      console.log("\nRoot-Level Type Distribution:");
      Object.entries(stats.typeDistribution).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
    }

    if (Object.keys(stats.serviceInfoTypes).length > 0) {
      console.log("\nService Info Type Distribution:");
      Object.entries(stats.serviceInfoTypes).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
    }

    console.log("\n═══════════════════════════════════════════════════════\n");

    // Recommendations
    if (stats.withoutRootType > 0 && stats.withServiceInfo > 0) {
      console.log("⚠️  INFO: Some assessments in database don't have root-level type");
      console.log("✅ SOLUTION IMPLEMENTED:");
      console.log("   - Fetch functions now extract type from service info");
      console.log("   - All assessments will display service type correctly");
      console.log("   - Both old and new assessments are supported\n");
      console.log("📝 Next steps:");
      console.log("   1. Test the assessment cards to confirm service type displays");
      console.log("   2. Verify confirmed page shows correct service");
      console.log("   3. Consider running a database migration to add type to old records\n");
    } else if (stats.withRootType === stats.totalAssessments) {
      console.log("✅ SUCCESS: All assessments have the type field at root level!");
      console.log("💚 The assessment cards will display service types correctly\n");
    } else if (stats.withoutRootType === stats.totalAssessments && stats.withServiceInfo === 0) {
      console.log("ℹ️  INFO: Assessments don't have service info yet (pending status)");
      console.log("💡 This is normal for assessments that haven't reserved a service\n");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ API Error:", error.response?.status, error.response?.statusText);
      console.error("   Message:", error.response?.data);
    } else {
      console.error("❌ Error:", error);
    }
  }
}

// Run the check
checkAssessmentTypes().catch(console.error);
