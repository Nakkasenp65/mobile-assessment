# Assessments API

This document describes the `expiredAt` field and server-side validation implemented for the assessments creation flow.

## POST /api/assessments

- Purpose: create a new assessment record and establish the price lock expiration control via `expiredAt`.
- Accepts either:
  - A specific ISO 8601 timestamp in UTC or with timezone offset.
  - If omitted, the server sets `expiredAt = now + 7 days`.
- Status: server-side validation is performed before forwarding the request to the upstream backend.

### Request Body

```
{
  "phoneNumber": "0812345678",
  "status": "pending",
  "estimatedValue": 19999,
  "deviceInfo": { "brand": "Apple", "model": "iPhone 13", "storage": "128GB" },
  "conditionInfo": { /* ... */ },
  "expiredAt": "2025-01-31T23:59:59Z" // OPTIONAL; if omitted, server defaults to now+7d
}
```

### Field: expiredAt

- Type: string (ISO 8601)
- Required server-side: yes (the server guarantees the final payload includes a valid `expiredAt`)
- Accepted formats: `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss±HH:MM` (milliseconds optional)
- Constraints:
  - Must parse as a valid datetime
  - Must be strictly in the future

### Validation and Errors

If `expiredAt` is provided but invalid, the server responds with HTTP 400 and one of the following error payloads:

- Invalid timestamp format
```
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "field": "expiredAt",
    "message": "expiredAt must be a valid ISO 8601 timestamp"
  }
}
```

- Past datetime value
```
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "field": "expiredAt",
    "message": "expiredAt must be in the future"
  }
}
```

- Null value
```
{
  "success": false,
  "error": {
    "code": "INVALID_FIELD",
    "field": "expiredAt",
    "message": "expiredAt is required and must be a string in ISO 8601 format"
  }
}
```

- Missing field example (for clients sending `expiredAt` with a different name): the server will default if `expiredAt` is truly omitted, but if you send an empty string or wrong key, it will behave like invalid format.

### Notes

- Until backend configuration is provided for customizable durations, the default is `now + 7 days`.
- `expiredAt` is the authoritative control for price lock validity. All services must validate this and reject processing for expired records.

## GET /api/assessments/:id

- Returns a single assessment record. If the upstream backend does not provide `priceLockExpiresAt`, the server enriches the record with an inferred expiry of `assessmentDate || createdAt + 7 days`.

### Debug Preview

- You can preview the Step3 UI and expiration blocking at:
  - `http://localhost:3000/details/debug`
  - This stub returns a record with `priceLockExpiresAt` set a few minutes ahead.