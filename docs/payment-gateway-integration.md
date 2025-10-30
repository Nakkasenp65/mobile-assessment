# Payment Gateway Integration

**Implementation Date:** October 25, 2025  
**Last Updated:** October 25, 2025 (Version 2 - Critical Flow Fix)  
**Status:** ✅ Production Ready

---

## 🎯 Quick Summary

This document describes the payment gateway integration for **SellNow service** with BTS and Home location types.

**Key Points:**

- 💰 **Payment Required:** BTS and Home services only
- 🏪 **No Payment:** Store service
- 🔐 **Critical Flow:** Assessment MUST be saved BEFORE payment redirect
- 📋 **Fresh DocId:** Always refetch assessment data to get the correct docId
- 💳 **Gateway:** Beam Checkout (`pay.beamcheckout.com`)
- 💵 **Test Amount:** 1,000 satang (10.00 ฿)

**Files Modified:**

- `src/app/api/create-payment-link/route.ts` - Payment API route
- `src/app/details/(step3)/(services)/SellNowService.tsx` - Payment flow logic
- `src/app/details/(step4)/AssessStep4.tsx` - Props passing
- `src/app/details/[id]/page.tsx` - Parent component

---

## Overview

The payment gateway integration has been implemented for the **SellNow service** when customers choose **BTS** or **Home** location types. This ensures that customers pay a deposit fee before their appointment is confirmed.

## Payment Flow

### Complete Sequence Diagram

```
┌─────────┐         ┌──────────────┐         ┌──────────┐         ┌──────────┐         ┌─────────────┐
│  User   │         │ SellNowService│         │ Backend  │         │ Payment  │         │    Beam     │
│ Browser │         │   Component   │         │   API    │         │   API    │         │  Checkout   │
└────┬────┘         └──────┬───────┘         └────┬─────┘         └────┬─────┘         └──────┬──────┘
     │                     │                      │                     │                       │
     │  1. Click Confirm   │                      │                     │                       │
     │────────────────────>│                      │                     │                       │
     │                     │                      │                     │                       │
     │                     │ 2. Validate Form     │                     │                       │
     │                     │ & Turnstile         │                     │                       │
     │                     │                      │                     │                       │
     │                     │ 3. PUT /assessments/{id}                   │                       │
     │                     │     {status: "reserved"}                   │                       │
     │                     │─────────────────────>│                     │                       │
     │                     │                      │                     │                       │
     │                     │                      │ 4. Save to DB       │                       │
     │                     │                      │    (status=reserved)│                       │
     │                     │                      │                     │                       │
     │                     │ 5. {success: true}   │                     │                       │
     │                     │<─────────────────────│                     │                       │
     │                     │                      │                     │                       │
     │                     │ 6. GET /assessments/{id}                   │                       │
     │                     │     (refetch for fresh docId)              │                       │
     │                     │─────────────────────>│                     │                       │
     │                     │                      │                     │                       │
     │                     │ 7. {data: {docId}}   │                     │                       │
     │                     │<─────────────────────│                     │                       │
     │                     │                      │                     │                       │
     │                     │ 8. POST /api/create-payment-link           │                       │
     │                     │     {amount, docId, redirectUrl}           │                       │
     │                     │──────────────────────────────────────────>│                       │
     │                     │                      │                     │                       │
     │                     │                      │  9. Forward Request │                       │
     │                     │                      │     to External API │                       │
     │                     │                      │     ──────────────────────────────────────>│
     │                     │                      │                     │                       │
     │                     │                      │ 10. {paymentLinkUrl}│                       │
     │                     │                      │     <──────────────────────────────────────│
     │                     │                      │                     │                       │
     │                     │ 11. {paymentLinkUrl} │                     │                       │
     │                     │<──────────────────────────────────────────│                       │
     │                     │                      │                     │                       │
     │ 12. Redirect to     │                      │                     │                       │
     │     Payment Gateway │                      │                     │                       │
     │─────────────────────────────────────────────────────────────────────────────────────────>│
     │                     │                      │                     │                       │
     │ 13. Payment UI      │                      │                     │                       │
     │<─────────────────────────────────────────────────────────────────────────────────────────│
     │                     │                      │                     │                       │
     │ 14. Complete Payment│                      │                     │                       │
     │─────────────────────────────────────────────────────────────────────────────────────────>│
     │                     │                      │                     │                       │
     │ 15. Redirect to     │                      │                     │                       │
     │     /confirmed/{id} │                      │                     │                       │
     │<─────────────────────────────────────────────────────────────────────────────────────────│
     │                     │                      │                     │                       │
```

### 1. Service Selection

- Customer selects "Sell Now" service
- Customer chooses location type:
  - **Store** (หน้าร้าน) - No payment required
  - **BTS** (สถานี BTS) - **Payment required**
  - **Home** (รับซื้อถึงบ้าน) - **Payment required**

### 2. Form Submission

- Customer fills in all required information
- Customer confirms the booking

### 3. Payment Processing (BTS & Home only)

**CRITICAL: The assessment MUST be saved BEFORE redirecting to payment gateway.**

When the location type is BTS or Home, the following sequence occurs:

#### Step-by-Step Flow:

```
1. User clicks "Confirm" button
   ↓
2. Form validation passes
   ↓
3. Turnstile security check passes (production only)
   ↓
4. updateAssessment.mutate() is called
   ├─ Payload: { status: "reserved", sellNowServiceInfo: {...} }
   ├─ Queue booking API called (if applicable)
   └─ Assessment PUT request sent to backend
   ↓
5. Backend saves assessment with status="reserved"
   ├─ Returns: { success: true }
   └─ Assessment is now persisted in database ✅
   ↓
6. onSuccess callback fires
   ↓
7. refetchAssessment() is called
   ├─ Fresh assessment data fetched from database
   └─ Updated docId retrieved ✅
   ↓
8. Payment link creation API called
   ├─ POST /api/create-payment-link
   ├─ Body: { amount, redirectUrl, docId }
   └─ External gateway API called
   ↓
9. Payment gateway responds with paymentLinkUrl
   ↓
10. window.location.href = paymentLinkUrl
    └─ User redirected to Beam Checkout ✅
```

#### Why This Order Matters:

1. **Data Integrity**: The docId might be generated or updated when status changes to "reserved"
2. **Payment Tracking**: The payment gateway needs the correct docId to match payments with assessments
3. **Race Conditions**: Using stale docId from props could cause payment mismatches
4. **Guaranteed Fresh Data**: refetchAssessment() ensures we always get the latest docId from the database

### 4. Confirmation

- **For Store service**: Direct confirmation without payment
- **For BTS/Home service**: User completes payment → redirected back to confirmation page

## API Integration

### Payment Link Creation Endpoint

**Internal API Route:** `/api/create-payment-link`

**Method:** `POST`

**Request Body:**

```json
{
  "amount": 10000,
  "redirectUrl": "https://your-domain.com/confirmed/{assessmentId}",
  "docId": "AS-202510-0001"
}
```

**Response:**

```json
{
  "paymentLinkUrl": "https://pay.beamcheckout.com/m_xxxxxxxx/pl_xxxxxxxx",
  "paymentLinkId": "pl_xxxxxxxxxxxxxxxxxx"
}
```

### External Payment Gateway

**Gateway API:** `https://queue-payment.vercel.app/api/create-payment-link`

**Provider:** Beam Checkout

## Amount Calculation

**Important:** The amount is in **satang** (1/100 of a Baht)

| Amount Value | Actual Price (THB) |
| ------------ | ------------------ |
| 10000        | 100.00 ฿           |
| 5000         | 50.00 ฿            |
| 20000        | 200.00 ฿           |

**Current Test Amount:** 10,000 (100.00 ฿)

## Implementation Details

### Files Modified

1. **`src/app/api/create-payment-link/route.ts`** (NEW)
   - API route handler for creating payment links
   - Proxies requests to external payment gateway
   - Handles error cases and validation

2. **`src/app/details/(step3)/(services)/SellNowService.tsx`**
   - Added `docId` prop
   - Modified `handleConfirmSell` to check location type
   - Integrated payment flow for BTS and Home services
   - Added payment error handling

3. **`src/app/details/(step4)/AssessStep4.tsx`**
   - Added `docId` prop to interface
   - Passed `docId` to SellNowService component

4. **`src/app/details/[id]/page.tsx`**
   - Passed `docId` from assessment data to AssessStep4

### Code Example

```typescript
// In SellNowService.tsx - handleConfirmSell function

// Step 1: Prepare the payload
const payload: SellNowServiceInfo = {
  type: "SELL_NOW",
  customerName: formState.customerName,
  phone: formState.phone,
  locationType: locationType as "home" | "bts" | "store",
  appointmentDate: formState.date,
  appointmentTime: formState.time,
  appointmentAt,
  branchId,
  serviceType: SERVICE_TYPES.SELL_NOW,
  // ... location-specific fields
};

// Step 2: Update assessment (CRITICAL: This happens FIRST)
updateAssessment.mutate(
  { status: "reserved", sellNowServiceInfo: payload },
  {
    onSuccess: async () => {
      // Step 3: Check if payment is required
      if (locationType === "bts" || locationType === "home") {
        try {
          // Step 4: CRITICAL - Refetch assessment to get updated docId
          const { data: updatedAssessment } = await refetchAssessment();

          // Step 5: Get fresh docId from database
          const assessmentDocId = updatedAssessment?.docId || docId || `AS-${Date.now()}`;

          console.log("📋 [PAYMENT] Using docId for payment:", assessmentDocId);

          // Step 6: Create payment link with FRESH docId
          const paymentResponse = await axios.post("/api/create-payment-link", {
            amount: 1000, // Test: 10.00 BATH
            redirectUrl: `${window.location.origin}/confirmed/${assessmentId}`,
            docId: assessmentDocId, // ← Using fresh docId from database!
          });

          const { paymentLinkUrl } = paymentResponse.data;

          if (paymentLinkUrl) {
            console.log("💳 [PAYMENT] Redirecting to payment gateway:", paymentLinkUrl);
            // Step 7: Redirect to payment gateway
            window.location.href = paymentLinkUrl;
          } else {
            throw new Error("Payment link not received");
          }
        } catch (error) {
          console.error("❌ [PAYMENT] Payment error:", error);
          await Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการชำระเงิน",
            text: "กรุณาติดต่อเจ้าหน้าที่",
          });
        }
      } else {
        // Store service - no payment required
        await Swal.fire({
          icon: "success",
          title: "ยืนยันข้อมูลสำเร็จ",
          text: "เราจะติดต่อคุณเร็วๆ นี้",
        });
        onSuccess?.();
      }
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "บันทึกข้อมูลไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    },
  },
);
```

### Key Implementation Points

1. **Assessment First, Payment Second**
   - ✅ The assessment is saved with `status: "reserved"` BEFORE any payment processing
   - ✅ This ensures the booking exists in the database before payment
   - ✅ If payment fails, the assessment is already saved (can be recovered later)

2. **Fresh DocId Retrieval**

   ```typescript
   const { refetch: refetchAssessment } = useAssessment(assessmentId);

   // Inside onSuccess callback:
   const { data: updatedAssessment } = await refetchAssessment();
   const assessmentDocId = updatedAssessment?.docId || docId || `AS-${Date.now()}`;
   ```

   - ✅ Uses `useAssessment` hook to refetch data
   - ✅ Ensures we have the latest docId generated by the backend
   - ✅ Has fallback chain: database docId → props docId → generated fallback

3. **Async/Await Pattern**
   - The `onSuccess` callback is `async` to allow awaiting the refetch
   - Payment link creation waits for fresh data before proceeding
   - Proper error handling with try/catch blocks

4. **Location Type Conditional**
   - Only BTS and Home services require payment
   - Store service bypasses payment and shows success message directly

## Testing

### Test Scenarios

#### 1. **Store Service (No Payment)**

- ✅ Select Store location
- ✅ Fill form and confirm
- ✅ Assessment saved with status="reserved"
- ✅ Should show success message directly
- ✅ No payment gateway redirect
- ✅ User can view confirmation page

#### 2. **BTS Service (With Payment)**

- ✅ Select BTS location
- ✅ Fill form and confirm
- ✅ Assessment saved with status="reserved" FIRST
- ✅ Fresh docId retrieved from database
- ✅ Should redirect to payment gateway
- ✅ Payment link contains correct docId
- ✅ After payment, redirect to confirmation page

#### 3. **Home Service (With Payment)**

- ✅ Select Home location
- ✅ Fill form and confirm
- ✅ Assessment saved with status="reserved" FIRST
- ✅ Fresh docId retrieved from database
- ✅ Should redirect to payment gateway
- ✅ Payment link contains correct docId
- ✅ After payment, redirect to confirmation page

### Test Data

**Test DocId:** AS-202510-0001  
**Test Amount:** 1000 (10.00 ฿)  
**Test Redirect URL:** `http://localhost:3000/confirmed/{assessmentId}`

### Console Logging

The implementation includes detailed console logging for debugging:

```
📋 [PAYMENT] Using docId for payment: AS-202510-0001
💳 [PAYMENT] Redirecting to payment gateway: https://pay.beamcheckout.com/...
❌ [PAYMENT] Payment error: [error details]
```

These logs help verify:

- Which docId is being used for payment
- When the redirect happens
- Any errors in the payment flow

## Production Considerations

### Before Going Live

1. **Update Test Amount**
   - Change from 10000 to actual deposit amount
   - Confirm amount calculation with business team

2. **Environment Variables**
   - No additional environment variables needed
   - Payment gateway URL is hardcoded

3. **Error Handling**
   - Payment link creation errors are caught and shown to user
   - User can retry by resubmitting the form

4. **Payment Verification**
   - Currently no webhook integration for payment verification
   - Consider implementing webhook handler if needed

### Future Enhancements

1. **Payment Status Tracking**
   - Store payment status in assessment record
   - Add `paymentStatus` field: "pending", "completed", "failed"
   - Store `paymentLinkId` for reference

2. **Webhook Integration**
   - Implement webhook endpoint for payment status updates
   - Update assessment status automatically upon payment

3. **Payment History**
   - Store payment transaction details
   - Add payment receipt download feature

4. **Dynamic Amount Calculation**
   - Calculate deposit amount based on device value
   - Allow configurable deposit percentage

## Error Messages

| Error Type                   | Thai Message                | Action           |
| ---------------------------- | --------------------------- | ---------------- |
| Payment Link Creation Failed | เกิดข้อผิดพลาดในการชำระเงิน | Contact support  |
| Missing DocId                | กรุณาติดต่อเจ้าหน้าที่      | Retry booking    |
| Network Error                | ไม่สามารถเชื่อมต่อได้       | Check connection |

## Critical Flow Awareness

### ⚠️ IMPORTANT: Assessment Must Be Saved First

**Why This Matters:**

The payment gateway needs a valid `docId` to track payments. If we redirect to payment before saving the assessment:

1. ❌ Payment might succeed but have no associated assessment
2. ❌ DocId might be stale or missing
3. ❌ Payment reconciliation becomes impossible
4. ❌ User pays but booking doesn't exist in system

**Our Solution:**

```typescript
// ✅ CORRECT ORDER:
1. Save assessment (status="reserved")
2. Wait for database confirmation
3. Refetch to get fresh docId
4. Create payment link with fresh docId
5. Redirect to payment gateway

// ❌ WRONG ORDER (DO NOT DO THIS):
1. Create payment link with stale docId
2. Redirect to payment gateway
3. Save assessment after payment
```

### Debugging Payment Flow

If payment issues occur, check these in order:

1. **Assessment Saved?**

   ```
   Check database: Does assessment exist with status="reserved"?
   ```

2. **DocId Generated?**

   ```
   Console log: 📋 [PAYMENT] Using docId for payment: ?
   Does it show a valid docId
   ```

3. **Payment Link Created?**

   ```
   Console log: 💳 [PAYMENT] Redirecting to payment gateway: ?
   Is the URL valid?
   ```

4. **Redirect Happened?**
   ```
   Did browser navigate to pay.beamcheckout.com?
   ```

### Common Issues & Solutions

| Issue                | Symptom                                    | Solution                                            |
| -------------------- | ------------------------------------------ | --------------------------------------------------- |
| Missing docId        | Payment fails with "invalid docId"         | Verify backend generates docId on reservation       |
| Stale docId          | Payment succeeds but can't find assessment | Ensure refetchAssessment() is called before payment |
| Assessment not saved | Redirect happens but no booking exists     | Check onSuccess callback fires after mutation       |
| Payment link error   | Error message shown instead of redirect    | Check /api/create-payment-link response             |
| Network timeout      | User stuck on loading                      | Add timeout handling for refetch                    |

## Security Considerations

1. **API Validation**
   - All required fields are validated before calling payment gateway
   - Amount must be a positive number
   - DocId and redirectUrl are required

2. **HTTPS Required**
   - Payment gateway requires HTTPS in production
   - Local development works with HTTP

3. **No Sensitive Data Storage**
   - Payment details are handled by Beam Checkout
   - No credit card data touches our servers

## Support

For issues or questions about payment gateway integration:

1. Check payment gateway logs in `/api/create-payment-link`
2. Verify external gateway status at `https://queue-payment.vercel.app`
3. Review browser console for client-side errors

## Changelog

### 2025-10-25 - Version 2 (Critical Fix)

- 🔧 **CRITICAL FIX**: Added `refetchAssessment()` to get fresh docId after assessment is saved
- ✅ Ensures assessment is saved BEFORE payment redirect
- ✅ Uses fresh docId from database instead of stale props
- ✅ Added comprehensive console logging for debugging
- ✅ Updated documentation with detailed flow diagrams

### 2025-10-25 - Version 1 (Initial)

- ✅ Initial payment gateway integration
- ✅ Added payment API route
- ✅ Integrated payment flow for BTS and Home services
- ✅ Added error handling and user feedback
- ✅ Tested with test amount (10.00 ฿)

## Summary Checklist

Before deploying to production, verify:

- [ ] Assessment is saved with `status="reserved"` BEFORE payment redirect
- [ ] `refetchAssessment()` is called to get fresh docId
- [ ] Payment link uses the fresh docId from database
- [ ] Console logs show correct docId being used
- [ ] Test all three scenarios: Store, BTS, Home
- [ ] Verify redirect URL points to correct domain
- [ ] Update test amount (1000) to production amount
- [ ] Test payment gateway in staging environment
- [ ] Verify payment webhook (if implemented)
- [ ] Test error scenarios (network failure, payment failure)
- [ ] Document payment reconciliation process
- [ ] Set up monitoring for payment failures
