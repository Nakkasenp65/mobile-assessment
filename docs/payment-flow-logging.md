# Payment Flow Logging Documentation

## Overview

Comprehensive logging has been added to the payment gateway flow to help identify errors and track the complete execution sequence. All logs use emoji prefixes for easy visual scanning in the console.

## Log Emoji Legend

| Emoji | Meaning       | When Used                          |
| ----- | ------------- | ---------------------------------- |
| 🚀    | Initiated     | Flow or function starts            |
| 🔒    | Security      | Turnstile verification steps       |
| 🔓    | Security Skip | Development mode bypass            |
| ⚠️    | Warning       | Non-critical issues                |
| 📅    | Date/Time     | Date and time operations           |
| 🏪    | Store         | Store-specific operations          |
| 📦    | Data/Payload  | Payload creation or data packaging |
| ✅    | Success       | Successful operations              |
| 📤    | Outgoing      | API calls being made               |
| 🔍    | Check         | Conditional logic evaluation       |
| 🔄    | Refetch       | Refetching data                    |
| 💳    | Payment       | Payment link creation              |
| 🔀    | Redirect      | Page redirect actions              |
| ❌    | Error         | Errors and failures                |

## SellNowService Payment Flow Logs

### 1. Function Entry

```typescript
🚀 [PAYMENT] handleConfirmSell initiated
```

**Logged Data:**

- `locationType`: "bts" | "home" | "store"
- `formState`: Customer info, dates, location details (truncated)
- `docId`: Current assessment docId
- `assessmentId`: Assessment ID
- `environment`: "production" | "development"

### 2. Turnstile Verification (Production Only)

#### 2a. Check Start

```typescript
🔒 [PAYMENT] Checking Turnstile verification...
```

#### 2b. No Token Warning

```typescript
⚠️ [PAYMENT] No Turnstile token found
```

#### 2c. API Verification

```typescript
📤 [PAYMENT] Verifying Turnstile token with API...
```

#### 2d. Verification Success

```typescript
✅ [PAYMENT] Turnstile verification successful
```

#### 2e. Verification Failure

```typescript
❌ [PAYMENT] Turnstile verification failed
```

**Logged Data:**

- Full verification response

#### 2f. Verification Error

```typescript
❌ [PAYMENT] Turnstile verification error
```

**Logged Data:**

- Error object

#### 2g. Development Skip

```typescript
🔓 [PAYMENT] Skipping Turnstile (development mode)
```

### 3. Appointment Time

```typescript
📅 [PAYMENT] Appointment time combined
```

**Logged Data:**

- `appointmentAt`: ISO datetime string

### 4. Store Branch ID

```typescript
🏪 [PAYMENT] Store branch ID determined
```

**Logged Data:**

- `branchId`: Branch identifier

### 5. Payload Building

```typescript
📦 [PAYMENT] Building payload for location type
```

**Logged Data:**

- Location type being processed

### 6. Payload Created

```typescript
✅ [PAYMENT] Payload created successfully
```

**Logged Data:**

- `type`: "SELL_NOW"
- `locationType`: "home" | "bts" | "store"
- `appointmentAt`: ISO datetime
- `branchId`: Branch ID (if applicable)
- `serviceType`: Service type identifier

### 7. Assessment Update Call

```typescript
📤 [PAYMENT] Calling updateAssessment.mutate with status: reserved
```

### 8. Assessment Update Success

```typescript
✅ [PAYMENT] Assessment updated successfully
```

### 9. Payment Requirement Check

```typescript
🔍 [PAYMENT] Checking payment requirement
```

**Logged Data:**

- `locationType`: Current location type
- `requiresPayment`: true/false

### 10. Refetch Start (Payment Flow)

```typescript
🔄 [PAYMENT] Refetching assessment to get fresh docId...
```

### 11. Fresh DocId Retrieved

```typescript
✅ [PAYMENT] Fresh docId retrieved
```

**Logged Data:**

- `updatedDocId`: DocId from refetch
- `fallbackDocId`: DocId from props
- `finalDocId`: Final docId being used

### 12. Payment Link Creation

```typescript
💳 [PAYMENT] Creating payment link with:
```

**Logged Data:**

- `amount`: Payment amount in satang (e.g., 1000 = 10 THB)
- `redirectUrl`: Full confirmation page URL
- `docId`: Final assessment docId

### 13. Payment Link Success

```typescript
✅ [PAYMENT] Payment link created successfully
```

**Logged Data:**

- `paymentLinkUrl`: URL to redirect user to
- `paymentLinkId`: Payment link identifier

### 14. Payment Redirect

```typescript
🔀 [PAYMENT] Redirecting to payment gateway
```

**Logged Data:**

- Full payment URL

### 15. Payment Link Missing

```typescript
❌ [PAYMENT] No payment link URL in response
```

**Logged Data:**

- Full payment response

### 16. Payment Flow Error

```typescript
❌ [PAYMENT] Payment flow error
```

**Logged Data:**

- `error`: Full error object
- `errorMessage`: Error message string
- `errorStack`: Stack trace (if available)

### 17. Store Service (No Payment)

```typescript
🏪 [PAYMENT] Store service - no payment required
```

### 18. Store Service Confirmed

```typescript
✅ [PAYMENT] Store service confirmed successfully
```

### 19. Assessment Update Failed

```typescript
❌ [PAYMENT] Assessment update failed
```

**Logged Data:**

- `error`: Full error object
- `errorMessage`: Error message string
- `errorStack`: Stack trace (if available)

## DateTimeSelect Preferred Time Logs

### 1. Post Initiated

```typescript
📅 [PREFERRED-TIME] Posting preferred time
```

**Logged Data:**

- `serviceType`: Service type identifier
- `type`: "OFFSITE" (only fires for offsite)
- `date`: Selected date
- `time`: Selected time
- `customerName`: Customer name
- `phone`: Phone number
- `extra`: Additional service data

### 2. Response Received

```typescript
✅ [PREFERRED-TIME] Response received
```

**Logged Data:**

- `status`: HTTP status code
- `statusText`: HTTP status text
- `ok`: Boolean success indicator

### 3. Response Data

```typescript
📦 [PREFERRED-TIME] Response data
```

**Logged Data:**

- Full API response body

### 4. Post Failed

```typescript
❌ [PREFERRED-TIME] Post failed
```

**Logged Data:**

- `error`: Error object
- `message`: Error message string

### 5. Error

```typescript
❌ [PREFERRED-TIME] Error
```

**Logged Data:**

- `error`: Error object
- `message`: Error message string

## How to Use These Logs

### Debugging Payment Flow

1. **Open Browser DevTools Console**
   - Press F12 or Cmd+Option+I
   - Go to Console tab
   - Filter by "[PAYMENT]" to see only payment logs

2. **Follow the Flow**
   - Look for 🚀 to find flow start
   - Follow the emoji sequence
   - Check for ❌ to identify failures

3. **Identify Issues**
   - Missing steps indicate where flow broke
   - Error logs include full context
   - Payment link creation shows exact parameters

### Debugging Preferred Time 404

1. **Filter Console**
   - Search for "[PREFERRED-TIME]"
   - Check if it's even being called

2. **Verify Conditions**
   - Only fires for OFFSITE services
   - Requires dateReady and selectedTime
   - Check logged payload

3. **Check Response**
   - Look for status code in response log
   - 404 means route not found or build issue
   - Check if API route exists in build

### Common Issues

#### Payment Link Not Created

**Look for:**

- 🔄 Refetch log - was assessment refetched?
- ✅ Fresh docId log - was docId retrieved?
- 💳 Creating payment link - what parameters?
- ❌ Payment flow error - what went wrong?

#### Turnstile Failures

**Look for:**

- 🔒 Checking verification
- ⚠️ No token warning
- ❌ Verification failed

#### Assessment Update Failures

**Look for:**

- 📤 Calling updateAssessment
- ❌ Assessment update failed
- Check error message and stack

#### Preferred Time 404

**Look for:**

- 📅 Posting preferred time - is it being called?
- ✅ Response received - what's the status?
- Check if route exists: `/app/api/preferred-time/route.ts`

## Performance Considerations

### Log Verbosity

These logs are comprehensive and may impact performance slightly. Consider:

1. **Development**: Keep all logs enabled
2. **Staging**: Keep all logs enabled
3. **Production**: Consider:
   - Removing detailed data logs
   - Keeping only error logs
   - Using a log aggregation service

### Removing Logs

To remove logs for production, search for:

- `[PAYMENT]`
- `[PREFERRED-TIME]`

And either remove the console.log statements or wrap them:

```typescript
if (process.env.NODE_ENV === "development") {
  console.log(...);
}
```

## Testing the Logging

### Manual Testing

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Open Browser Console**
   - Open DevTools (F12)
   - Go to Console tab

3. **Test Payment Flow**
   - Go to assessment details
   - Fill in Sell Now service (BTS or Home)
   - Submit form
   - Watch logs in real-time

4. **Verify Log Sequence**
   - Check all expected logs appear
   - Verify data is correct
   - Confirm no unexpected errors

### Expected Log Sequence (BTS/Home)

```
🚀 [PAYMENT] handleConfirmSell initiated
🔓 [PAYMENT] Skipping Turnstile (development mode)  // or 🔒 series in production
📅 [PAYMENT] Appointment time combined
📦 [PAYMENT] Building payload for location type
✅ [PAYMENT] Payload created successfully
📤 [PAYMENT] Calling updateAssessment.mutate with status: reserved
✅ [PAYMENT] Assessment updated successfully
🔍 [PAYMENT] Checking payment requirement
🔄 [PAYMENT] Refetching assessment to get fresh docId...
✅ [PAYMENT] Fresh docId retrieved
💳 [PAYMENT] Creating payment link with:
✅ [PAYMENT] Payment link created successfully
🔀 [PAYMENT] Redirecting to payment gateway
```

### Expected Log Sequence (Store)

```
🚀 [PAYMENT] handleConfirmSell initiated
🔓 [PAYMENT] Skipping Turnstile (development mode)  // or 🔒 series in production
📅 [PAYMENT] Appointment time combined
🏪 [PAYMENT] Store branch ID determined
📦 [PAYMENT] Building payload for location type
✅ [PAYMENT] Payload created successfully
📤 [PAYMENT] Calling updateAssessment.mutate with status: reserved
✅ [PAYMENT] Assessment updated successfully
🔍 [PAYMENT] Checking payment requirement
🏪 [PAYMENT] Store service - no payment required
✅ [PAYMENT] Store service confirmed successfully
```

## Troubleshooting Guide

### No Logs Appearing

**Possible Causes:**

1. Console filter is active - clear filters
2. Function not being called - check form submission
3. JavaScript error preventing execution - check for errors

### Logs Stop Midway

**Possible Causes:**

1. Error occurred - look for ❌ logs
2. Async operation failed - check network tab
3. Conditional logic failed - check 🔍 logs

### 404 for Preferred Time

**Investigation Steps:**

1. Check if log appears: `📅 [PREFERRED-TIME] Posting preferred time`
2. If yes: API route exists but might not be in build
3. If no: Component not calling it (check isOffsite condition)
4. Verify route file: `/app/api/preferred-time/route.ts`
5. Check build output for route

### Unknown Error Before Redirect

**Investigation Steps:**

1. Look for all ❌ logs in console
2. Check Network tab for failed requests
3. Look for logs from other components
4. Verify the redirect still happens (🔀 log)
5. If redirect works, error might be non-critical

## Maintenance

### Adding New Logs

When adding new functionality:

1. **Use Consistent Format**

   ```typescript
   console.log("🔍 [PAYMENT] Description", { data });
   ```

2. **Choose Appropriate Emoji**
   - See legend above
   - Be consistent

3. **Include Context**
   - Log relevant data
   - Use object format for structured data

4. **Update Documentation**
   - Add to this file
   - Update log sequence diagrams

### Updating Existing Logs

When modifying flow:

1. **Update Log Messages**
   - Keep descriptions accurate
   - Update data being logged

2. **Update Documentation**
   - Revise log sequences
   - Update troubleshooting steps

3. **Test Thoroughly**
   - Verify all logs appear
   - Check data accuracy

## Related Documentation

- [Payment Gateway Integration](./payment-gateway-integration.md) - Complete payment flow documentation
- [Payment Gateway Tests](./payment-gateway-tests.md) - Test suite documentation
- [Service Type Identifiers](./service-type-identifiers.md) - Service type mapping

## Summary

This comprehensive logging system provides complete visibility into:

1. **Payment Gateway Flow**
   - Every step from form submission to redirect
   - All data transformations
   - All API calls and responses
   - All errors with full context

2. **Preferred Time Tracking**
   - When it's called (OFFSITE only)
   - What data is sent
   - Response status and data
   - Any errors

3. **Error Identification**
   - Exact location of failures
   - Complete error context
   - Stack traces when available

Use this logging to quickly identify and resolve issues in both development and production environments.
