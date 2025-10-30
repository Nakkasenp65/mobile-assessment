# LINE Assessments Page

## Overview

A dedicated mobile-only page for LINE users to view their assessments using `line_user_id` instead of phone number + OTP verification.

## Route

`/line-assessments`

## Features

### 1. **LIFF Authentication**

- Automatically initializes LIFF when page loads
- Extracts LINE user ID from LIFF profile
- Redirects to `/my-assessments` if not in LINE app

### 2. **Assessment Fetching**

- Uses TanStack Query to fetch assessments by `line_user_id`
- API endpoint: `{{backendApiUrl}}/api/assessments/search?line_user_id={{lineUserId}}`
- No OTP verification required (simpler flow than phone-based search)

### 3. **Assessment Display**

- Shows summary card with total count
- Search by device name (brand + model)
- Filter by status: ทั้งหมด, จองแล้ว, เสร็จสิ้น, กำลังดำเนินการ, รอประเมิน
- Displays assessments in card format with:
  - Device image
  - Device name and storage
  - Status badge
  - Service type (if selected)
  - Assessment date
  - Estimated value

### 4. **Navigation Logic**

Based on assessment status:

- **`reserved`** → Navigate to `/confirmed/[assessmentId]`
- **`pending`** → Navigate to `/details/[assessmentId]` (to select service)

### 5. **Loading States**

- Initial LIFF initialization loading
- Data fetching loading with custom `Loading` component
- Error state with clear error messages

## User Flow

```
liff-welcome page
    ↓ (User clicks "ดูการประเมินล่าสุด")
line-assessments page
    ↓ (Initialize LIFF)
    ↓ (Get LINE user ID)
    ↓ (Fetch assessments by line_user_id)
    ↓ (Display assessments list)
    ↓ (User clicks assessment card)
    ├─ reserved → /confirmed/[assessmentId]
    └─ pending → /details/[assessmentId]
```

## Components

### `/line-assessments/page.tsx`

Main page component that:

- Handles LIFF initialization
- Manages LINE user ID state
- Fetches assessments using TanStack Query
- Handles loading and error states

### `/line-assessments/components/AssessmentsList.tsx`

List component that:

- Displays summary statistics
- Provides search and filter functionality
- Renders assessment cards
- Shows empty state when no results

### `/line-assessments/components/AssessmentCard.tsx`

Card component that:

- Shows device information with image
- Displays status badge and service type
- Shows assessment date and estimated value
- Navigates to appropriate page based on status

## API Integration

### Endpoint

```
GET {{backendApiUrl}}/api/assessments/search?line_user_id={{lineUserId}}
```

### Response Format

```typescript
{
  success: boolean;
  data: RawAssessmentRecord[];
}
```

### Data Transformation

Raw assessment records are transformed into `Assessment` type with:

- Device information (brand, model, storage)
- Status (pending, reserved, completed, in-progress)
- Assessment date (formatted in Thai locale)
- Estimated value
- Service information (if available)

## Mobile-First Design

- Optimized for mobile screens
- Touch-friendly buttons and cards
- Smooth animations with Framer Motion
- Gradient backgrounds matching brand colors
- Fixed header for easy navigation back

## Environment Variables Required

- `NEXT_PUBLIC_LIFF_ID`: LINE LIFF app ID
- `NEXT_PUBLIC_BACKEND_URL`: Backend API base URL

## Build Output

- Route: `○ /line-assessments` (Static)
- Size: 15.6 kB
- First Load JS: 287 kB

## Comparison with `/my-assessments`

| Feature            | /my-assessments     | /line-assessments    |
| ------------------ | ------------------- | -------------------- |
| Authentication     | Phone + OTP         | LIFF (LINE user ID)  |
| User Type          | Web + LINE          | LINE only            |
| Complexity         | Higher (multi-step) | Lower (single step)  |
| Session Management | Yes (with caching)  | No (LIFF handles it) |
| Turnstile          | Required            | Not required         |
| Layout             | Desktop + Mobile    | Mobile only          |

## Next Steps

### Backend Implementation Required:

1. Add support for `line_user_id` query parameter in search endpoint
2. Ensure assessments are stored with `line_user_id` during creation
3. Return assessments filtered by LINE user ID

### Testing Checklist:

- [ ] Test in LINE app (LIFF environment)
- [ ] Verify LIFF initialization works correctly
- [ ] Test assessment fetching with valid LINE user ID
- [ ] Verify navigation to confirmed/details pages
- [ ] Test search and filter functionality
- [ ] Verify empty state displays correctly
- [ ] Test error handling when API fails
- [ ] Verify back navigation to liff-welcome page
