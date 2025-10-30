# Disable Payment Link API Route

## Overview

This API route provides a reverse proxy to disable payment links through the Beam Checkout payment gateway.

## Endpoint

```
PATCH /api/disable-payment-link/[payment_link_id]
```

## Parameters

| Parameter         | Type   | Required | Description                                            |
| ----------------- | ------ | -------- | ------------------------------------------------------ |
| `payment_link_id` | string | Yes      | The payment link ID to disable (must start with `pl_`) |

## Example Request

```bash
curl -X PATCH \
  http://localhost:3000/api/disable-payment-link/pl_test456789012345678 \
  -H "Content-Type: application/json"
```

## Example Response

### Success Response (HTTP 200)

```json
{
  "code": 0,
  "message": "Payment link disabled successfully"
}
```

### Error Response (HTTP 4xx/5xx)

```json
{
  "code": 1,
  "error": {
    "errorCode": "INVALID_JSON_ERROR",
    "errorMessage": "Invalid payment link ID format"
  },
  "message": "Failed to disable payment link"
}
```

## Response Fields

| Field                | Type   | Description                                   |
| -------------------- | ------ | --------------------------------------------- |
| `code`               | number | Response code (0 = success, non-zero = error) |
| `message`            | string | Human-readable message                        |
| `error`              | object | Error details (only present when code ≠ 0)    |
| `error.errorCode`    | string | Error code identifier                         |
| `error.errorMessage` | string | Detailed error message                        |

## Error Codes

| HTTP Status | Code | Description                                    |
| ----------- | ---- | ---------------------------------------------- |
| 400         | -    | Missing or invalid `payment_link_id` parameter |
| 500         | -    | Environment configuration error                |
| 4xx/5xx     | \*   | Forwarded from Beam Checkout API               |

## Environment Variables

This route requires the following environment variable:

```env
NEXT_PUBLIC_CANCEL_PAYMENT_LINK_URL=https://api.beamcheckout.com/api/v1/payment-links/
```

## Implementation Details

- **Method**: PATCH
- **Framework**: Next.js 15 App Router
- **HTTP Client**: Axios
- **Validation**: Parameter presence and format validation
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Proxy**: Acts as a reverse proxy to the Beam Checkout API

## URL Construction

The route constructs the disable URL as follows:

```
${NEXT_PUBLIC_CANCEL_PAYMENT_LINK_URL}${payment_link_id}/disable
```

Example:

```
https://api.beamcheckout.com/api/v1/payment-links/pl_test123/disable
```

## Testing

Run the test suite:

```bash
npm test -- src/app/api/disable-payment-link/[payment_link_id]/route.test.ts
```

## Usage in Frontend

```typescript
const disablePaymentLink = async (paymentLinkId: string) => {
  try {
    const response = await fetch(`/api/disable-payment-link/${paymentLinkId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.code === 0) {
      console.log("Payment link disabled successfully");
    } else {
      console.error("Failed to disable payment link:", data.error);
    }

    return data;
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
};
```

## Security Considerations

- This route forwards requests to an external payment gateway
- Ensure proper authentication/authorization is implemented at the application level
- Validate payment link IDs before calling this API
- Monitor for abuse and implement rate limiting if necessary

## Related Files

- `src/app/api/disable-payment-link/[payment_link_id]/route.ts` - Main API route
- `src/app/api/disable-payment-link/[payment_link_id]/route.test.ts` - Test suite
- `.env` - Environment configuration
