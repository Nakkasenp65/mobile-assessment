# Service Type Identifiers

## Overview

Each service info interface now includes a `type` field that acts as a discriminator to easily identify which service type is being used. This simplifies rendering logic and enables TypeScript discriminated unions for better type safety.

## Implementation Date

Added: October 25, 2025

## Service Types

All 6 service info interfaces now include a `type` field:

| Service         | Type Value          | Interface                   | Queue Booking      |
| --------------- | ------------------- | --------------------------- | ------------------ |
| Sell Now        | `"SELL_NOW"`        | `SellNowServiceInfo`        | ✅ Yes (Automatic) |
| Pawn            | `"PAWN"`            | `PawnServiceInfo`           | ✅ Yes (Automatic) |
| Consignment     | `"CONSIGNMENT"`     | `ConsignmentServiceInfo`    | ✅ Yes (Automatic) |
| Trade-In        | `"TRADE_IN"`        | `TradeInServiceInfo`        | ✅ Yes (Automatic) |
| Refinance       | `"REFINANCE"`       | `RefinanceServiceInfo`      | ❌ No (Manual)     |
| iPhone Exchange | `"IPHONE_EXCHANGE"` | `IPhoneExchangeServiceInfo` | ❌ No (Manual)     |

## Type Definitions

```typescript
// src/types/service.ts

export interface SellNowServiceInfo {
  type: "SELL_NOW"; // Service type identifier for easy rendering
  customerName: string;
  phone: string;
  // ... other fields
}

export interface PawnServiceInfo {
  type: "PAWN"; // Service type identifier for easy rendering
  customerName: string;
  phone: string;
  // ... other fields
}

export interface ConsignmentServiceInfo {
  type: "CONSIGNMENT"; // Service type identifier for easy rendering
  customerName: string;
  phone: string;
  // ... other fields
}

export interface TradeInServiceInfo {
  type: "TRADE_IN"; // Service type identifier for easy rendering
  customerName: string;
  phone: string;
  // ... other fields
}

export interface RefinanceServiceInfo {
  type: "REFINANCE"; // Service type identifier for easy rendering
  customerName: string;
  phone: string;
  // ... other fields
}

export interface IPhoneExchangeServiceInfo {
  type: "IPHONE_EXCHANGE"; // Service type identifier for easy rendering
  customerName: string;
  phone: string;
  // ... other fields
}
```

## Usage Examples

### 1. Type-Safe Discriminated Unions

```typescript
type ServiceInfo =
  | SellNowServiceInfo
  | PawnServiceInfo
  | ConsignmentServiceInfo
  | TradeInServiceInfo
  | RefinanceServiceInfo
  | IPhoneExchangeServiceInfo;

function renderServiceInfo(service: ServiceInfo) {
  switch (service.type) {
    case "SELL_NOW":
      // TypeScript knows service is SellNowServiceInfo here
      return `Sell Now - Location: ${service.locationType}`;

    case "PAWN":
      // TypeScript knows service is PawnServiceInfo here
      return `Pawn - Location: ${service.locationType}`;

    case "CONSIGNMENT":
      // TypeScript knows service is ConsignmentServiceInfo here
      return `Consignment - Store: ${service.storeLocation}`;

    case "TRADE_IN":
      // TypeScript knows service is TradeInServiceInfo here
      return `Trade-In - Device: ${service.newDevice}`;

    case "REFINANCE":
      // TypeScript knows service is RefinanceServiceInfo here
      return `Refinance - Occupation: ${service.occupation}`;

    case "IPHONE_EXCHANGE":
      // TypeScript knows service is IPhoneExchangeServiceInfo here
      return `iPhone Exchange - Occupation: ${service.occupation}`;
  }
}
```

### 2. Confirmed Page - Clean Service Detection (IMPROVED ✨)

**Before (Spaghetti Logic):**

```typescript
// Old way - using string keys and complex mapping
const serviceComponentMap: Record<string, React.ReactElement | null> = useMemo(() => {
  if (!assessment) return {};
  return {
    sellNow: assessment.sellNowServiceInfo ? <SellNowService /> : null,
    pawn: assessment.pawnServiceInfo ? <PawnService /> : null,
    // ... repeat for all services
  };
}, [assessment]);

const activeService = useMemo(() => {
  if (!assessment) return null;
  const services = [
    { key: "sellNow", info: assessment.sellNowServiceInfo },
    { key: "pawn", info: assessment.pawnServiceInfo },
    // ... checking all services
  ];
  const found = services.find((service) => service.info);
  return found ? { type: found.key, component: serviceComponentMap[found.key] } : null;
}, [assessment, serviceComponentMap]);
```

**After (Clean with Type Field):**

```typescript
// New way - using type discriminator directly
const activeService = useMemo(() => {
  if (!assessment) return null;

  if (assessment.sellNowServiceInfo) {
    return {
      type: assessment.sellNowServiceInfo.type, // "SELL_NOW"
      info: assessment.sellNowServiceInfo,
      component: <SellNowService info={assessment.sellNowServiceInfo} assessment={assessment} />,
    };
  }

  if (assessment.pawnServiceInfo) {
    return {
      type: assessment.pawnServiceInfo.type, // "PAWN"
      info: assessment.pawnServiceInfo,
      component: <PawnService info={assessment.pawnServiceInfo} assessment={assessment} />,
    };
  }

  // ... same pattern for other services
  return null;
}, [assessment]);

// Now you can use activeService.type directly
// Example: activeService?.type === "SELL_NOW"
```

### 3. Simple Service Type Checking

```typescript
// Old way - checking for existence of specific fields
if (assessment.sellNowServiceInfo) {
  // Handle sell now
}

// New way - using type field
const activeService = getActiveService(assessment);
if (activeService?.type === "SELL_NOW") {
  // Handle sell now
}
```

### 4. Conditional Rendering

```tsx
function ServiceDetails({ service }: { service: ServiceInfo }) {
  return (
    <div>
      {service.type === "SELL_NOW" && <div>Location Type: {service.locationType}</div>}

      {service.type === "TRADE_IN" && (
        <div>
          <div>New Device: {service.newDevice}</div>
          <div>Storage: {service.storage}</div>
          <div>Color: {service.color}</div>
        </div>
      )}

      {(service.type === "REFINANCE" || service.type === "IPHONE_EXCHANGE") && (
        <div>
          <div>Occupation: {service.occupation}</div>
          <div>Documents: {service.documentFileUrl}</div>
        </div>
      )}
    </div>
  );
}
```

### 5. Filtering by Service Type

````typescript
// Get all assessments with automatic queue booking
const queueBookingServices = assessments.filter(a => {
  const service = getActiveService(a);
  return service?.type &&
    ["SELL_NOW", "PAWN", "CONSIGNMENT", "TRADE_IN"].includes(service.type);
});

// Get all manual booking services
const manualBookingServices = assessments.filter(a => {
  const service = getActiveService(a);
  return service?.type &&
    ["REFINANCE", "IPHONE_EXCHANGE"].includes(service.type);
});
```### 2. Simple Service Type Checking

```typescript
// Old way - checking for existence of specific fields
if (assessment.sellNowServiceInfo) {
  // Handle sell now
}

// New way - using type field
const activeService = getActiveService(assessment);
if (activeService?.type === "SELL_NOW") {
  // Handle sell now
}
````

### 3. Conditional Rendering

```tsx
function ServiceDetails({ service }: { service: ServiceInfo }) {
  return (
    <div>
      {service.type === "SELL_NOW" && <div>Location Type: {service.locationType}</div>}

      {service.type === "TRADE_IN" && (
        <div>
          <div>New Device: {service.newDevice}</div>
          <div>Storage: {service.storage}</div>
          <div>Color: {service.color}</div>
        </div>
      )}

      {(service.type === "REFINANCE" || service.type === "IPHONE_EXCHANGE") && (
        <div>
          <div>Occupation: {service.occupation}</div>
          <div>Documents: {service.documentFileUrl}</div>
        </div>
      )}
    </div>
  );
}
```

### 4. Filtering by Service Type

```typescript
// Get all assessments with automatic queue booking
const queueBookingServices = assessments.filter((a) => {
  const service = getActiveService(a);
  return service?.type && ["SELL_NOW", "PAWN", "CONSIGNMENT", "TRADE_IN"].includes(service.type);
});

// Get all manual booking services
const manualBookingServices = assessments.filter((a) => {
  const service = getActiveService(a);
  return service?.type && ["REFINANCE", "IPHONE_EXCHANGE"].includes(service.type);
});
```

## Where Type Field is Set

### Service Components

The type field is set when creating the service info payload:

```typescript
// src/app/details/(step3)/(services)/SellNowService.tsx
const base = {
  type: "SELL_NOW",
  customerName: formState.customerName,
  phone: formState.phone,
  // ... other fields
};

// src/app/details/(step3)/(services)/ConsignmentService.tsx
const payload: ConsignmentServiceInfo = {
  type: "CONSIGNMENT",
  customerName: formState.customerName,
  phone: formState.phone,
  // ... other fields
};
```

### Utility Functions

```typescript
// src/util/servicePayloads.ts
export function buildRefinancePayload(params: {...}): RefinanceServiceInfo {
  return {
    type: "REFINANCE",
    customerName: params.customerName,
    // ... other fields
  };
}

export function buildIPhoneExchangePayload(params: {...}): IPhoneExchangeServiceInfo {
  return {
    type: "IPHONE_EXCHANGE",
    customerName: params.customerName,
    // ... other fields
  };
}
```

### FormData Builders

```typescript
// src/util/servicePayloads.ts
export function buildRefinanceFormData(params: {...}): FormData {
  const serviceInfo = {
    type: "REFINANCE",
    customerName: params.customerName,
    // ... other fields
  };
  // ... FormData construction
}
```

## Benefits

### 1. Type Safety

TypeScript can narrow types automatically when using discriminated unions, preventing runtime errors.

### 2. Simplified Logic

No need to check multiple optional fields to determine service type.

```typescript
// Before
if (assessment.sellNowServiceInfo) {
  /* ... */
} else if (assessment.pawnServiceInfo) {
  /* ... */
} else if (assessment.consignmentServiceInfo) {
  /* ... */
}

// After
const service = getActiveService(assessment);
switch (service?.type) {
  case "SELL_NOW": /* ... */
  case "PAWN": /* ... */
  case "CONSIGNMENT": /* ... */
}
```

### 3. Better Maintainability

Easy to understand what service type is being handled at any point in the code.

### 4. Future-Proof

Easy to add new service-specific logic or rendering based on type.

## Testing

All test builders have been updated to include the type field:

```typescript
// src/hooks/useUpdateAssessment.test.ts
const createSellNowServiceInfo = (): SellNowServiceInfo => ({
  type: "SELL_NOW",
  customerName: "สมชาย ทดสอบ",
  // ... other fields
});

const createRefinanceServiceInfo = (): RefinanceServiceInfo => ({
  type: "REFINANCE",
  customerName: "ประวิทย์ ทดสอบ",
  // ... other fields
});
```

## Related Documentation

- [Queue Booking Documentation](./queue-booking.md) - Details on which services use automatic queue booking
- [Service Interfaces](../src/types/service.ts) - Complete type definitions
- [Service Payloads Utilities](../src/util/servicePayloads.ts) - Helper functions for building service info

## Migration Notes

If you need to add a new service type in the future:

1. Add the new interface to `src/types/service.ts` with a unique `type` field
2. Update the service component to include the type when creating payloads
3. Update any utility functions that build the service info
4. Add test builders with the type field
5. Update this documentation with the new service type

## Important Reminders

- ⚠️ **Always include the `type` field** when creating any service info object
- ⚠️ **Type values are uppercase with underscores** (e.g., `"SELL_NOW"`, not `"sell-now"`)
- ⚠️ **The `type` field is separate from `serviceType`** which is used for queue booking API
- ✅ **All service components** have been updated to include the type field
- ✅ **All test builders** include the type field
- ✅ **All utility functions** include the type field
