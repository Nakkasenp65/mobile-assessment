import { ConditionInfo } from "./device";
import { PawnServiceInfo } from "./service";

export interface AssessmentRecord {
  id: string;
  phoneNumber: string;
  assessmentDate: string;
  device: {
    brand: string;
    model: string;
    storage: string;
    imageUrl: string;
  };
  conditionInfo: ConditionInfo;
  pawnServiceInfo?: PawnServiceInfo;
  status: "completed" | "pending" | "in-progress";
  estimatedValue: number;
  priceLockExpiresAt: string;
  nextSteps: string[];
}
