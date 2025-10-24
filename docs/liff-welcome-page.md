# LIFF Welcome Page

## 📍 Route

`/liff-welcome`

## 🎯 วัตถุประสงค์

หน้านี้เป็นหน้าต้อนรับสำหรับผู้ใช้ที่เปิดผ่าน LINE LIFF Application เท่านั้น จะแสดง popup ถามว่าผู้ใช้เคยประเมินอุปกรณ์มาก่อนหรือไม่

## ✨ Features

### 1. **LIFF Authentication**

- ตรวจสอบว่าผู้ใช้เปิดผ่าน LINE app หรือไม่
- Auto login ผ่าน LIFF
- ดึง LINE user profile (userId)

### 2. **Welcome Dialog**

- 🎨 Design สวยงามแบบ Apple-style
- 📱 Responsive สำหรับทุกขนาดหน้าจอ
- ✨ Gradient background และ animation effects

### 3. **User Flow**

#### เคยประเมินแล้ว:

```
1. กด "เคยประเมินแล้ว"
2. ระบบค้นหา assessment ล่าสุดจาก LINE user ID
3. Redirect ไปยังหน้า /details/{assessmentId}
```

#### ยังไม่เคยประเมิน:

```
1. กด "เริ่มประเมินใหม่"
2. Redirect ไปยังหน้า /assess
```

## 🔧 Technical Details

### Components Used

- `Dialog` - จาก shadcn/ui
- `Button` - จาก shadcn/ui
- `Loading` - Custom loading component
- Icons: `ClipboardList`, `Sparkles` จาก lucide-react

### State Management

```typescript
- isModalOpen: boolean          // ควบคุมการแสดง dialog
- isLoading: boolean            // แสดง loading ขณะ init LIFF
- lineUserId: string | null     // LINE user ID จาก profile
- isFetchingAssessment: boolean // แสดง loading ขณะค้นหา assessment
```

### API Integration

**Endpoint:** `GET /api/assessments/by-line-user/{lineUserId}`

**Response:**

```typescript
{
  success: boolean;
  assessment?: Assessment;
  message?: string;
}
```

## 🚀 การใช้งาน

### 1. ตั้งค่า Environment Variables

ต้องมีตัวแปรนี้ใน `.env.local`:

```env
NEXT_PUBLIC_LIFF_ID=your-liff-id-here
```

### 2. เปิดผ่าน LIFF URL

```
https://liff.line.me/{LIFF_ID}
```

หรือ

```
https://your-domain.com/liff-welcome
```

### 3. Testing Flow

1. เปิดผ่าน LINE app
2. ดู welcome popup
3. เลือกตัวเลือกที่ต้องการ

## 📝 TODO: Backend Implementation

**ตอนนี้ API endpoint ยังไม่ได้ implement จริง** ต้องเพิ่มการทำงานดังนี้:

### 1. Database Schema

เพิ่ม field `line_user_id` ในตาราง `assessments`:

```sql
ALTER TABLE assessments ADD COLUMN line_user_id VARCHAR(255);
CREATE INDEX idx_line_user_id ON assessments(line_user_id);
```

### 2. Update API Route

แก้ไขไฟล์: `/api/assessments/by-line-user/[lineUserId]/route.ts`

```typescript
// Example implementation
const assessment = await supabase
  .from("assessments")
  .select("*")
  .eq("line_user_id", lineUserId)
  .order("created_at", { ascending: false })
  .limit(1)
  .single();

if (assessment.data) {
  return NextResponse.json({
    success: true,
    assessment: assessment.data,
  });
}
```

### 3. Save LINE User ID

เมื่อสร้าง assessment ใหม่ ให้บันทึก LINE user ID ด้วย:

```typescript
await supabase.from("assessments").insert({
  ...assessmentData,
  line_user_id: lineUserId, // จาก LIFF profile
});
```

## 🎨 UI/UX Features

### Design Elements:

- ✅ Apple-style rounded corners (3xl)
- ✅ Gradient backgrounds (orange → pink)
- ✅ Smooth animations
- ✅ Loading states
- ✅ Icon animations (pulse, sparkles)
- ✅ Shadow effects
- ✅ Responsive spacing

### Color Scheme:

- Primary: Orange 600 → Pink 600 (gradient)
- Background: Orange 50 → Pink 50 (gradient)
- Text: Gray 900 (titles), Gray 500 (descriptions)
- Success: Green indicators
- Info: Blue/Pink accent boxes

## 🔐 Security Notes

1. **LIFF Authentication:** ใช้ LIFF SDK เพื่อ verify ว่าผู้ใช้เป็น LINE user จริง
2. **API Protection:** ควรเพิ่ม authentication middleware ที่ API route
3. **Data Privacy:** LINE user ID เป็นข้อมูลส่วนบุคคล ควรเก็บอย่างปลอดภัย

## 📱 Fallback Behavior

ถ้าไม่ได้เปิดผ่าน LINE app:

- Redirect ไปยัง `/assess` อัตโนมัติ
- แสดง console warning
- ไม่แสดง error ให้ผู้ใช้เห็น (UX ที่ดี)

## 🧪 Testing Checklist

- [ ] เปิดผ่าน LINE app ได้
- [ ] LIFF login สำเร็จ
- [ ] แสดง popup สวยงาม
- [ ] กดปุ่ม "เคยประเมินแล้ว" redirect ถูกต้อง
- [ ] กดปุ่ม "เริ่มประเมินใหม่" redirect ถูกต้อง
- [ ] Loading state แสดงถูกต้อง
- [ ] ปุ่มถูก disable ขณะ loading
- [ ] Responsive บนหน้าจอขนาดต่างๆ

## 📚 Related Files

- `/app/liff-welcome/page.tsx` - หน้าหลัก
- `/app/api/assessments/by-line-user/[lineUserId]/route.ts` - API endpoint
- `/app/assess/page.tsx` - หน้าประเมินใหม่
- `/app/details/[id]/page.tsx` - หน้าแสดงรายละเอียดการประเมิน (TODO: redirect ถ้าเคยประเมิน)
