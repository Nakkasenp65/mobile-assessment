// // src/app/assess/step3/(services)/PawnService.tsx

// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { DeviceInfo } from "../../../../types/device";
// import { Store, User, Phone, Home, Train, Check, Pencil } from "lucide-react";
// import FramerButton from "@/components/ui/framer/FramerButton";
// import { combineDateTime } from "@/util/dateTime";
// import { SERVICE_TYPES, BRANCHES, getBranchIdFromName } from "@/constants/queueBooking";
// import { useRouter } from "next/navigation";
// import DateTimeSelect from "@/components/ui/DateTimeSelect";
// import { useUpdateAssessment } from "@/hooks/useUpdateAssessment";
// import type { PawnServiceInfo } from "@/types/service";
// import Swal from "sweetalert2";
// import { PhoneNumberEditModal } from "@/components/ui/PhoneNumberEditModal";
// import { useBtsStations } from "@/hooks/useBtsStations"; // ✨ Fetch BTS API
// import { mergeTrainDataWithApi } from "@/util/trainLines"; // ✨ Merge with static MRT/SRT
// import Image from "next/image";

// interface PawnServiceProps {
//   assessmentId: string;
//   deviceInfo: DeviceInfo;
//   pawnPrice: number;
//   phoneNumber: string;
//   lineUserId?: string | null; // เพิ่ม lineUserId (optional)
//   onSuccess?: () => void;
// }

// export default function PawnService({
//   assessmentId,
//   pawnPrice,
//   phoneNumber,
//   onSuccess,
// }: PawnServiceProps) {
//   const router = useRouter();
//   const [locationType, setLocationType] = useState<"home" | "bts" | "store">("home");
//   const [selectedBtsLine, setSelectedBtsLine] = useState("");
//   const [formState, setFormState] = useState({
//     customerName: "",
//     phone: phoneNumber,
//     address: "",
//     province: "BKK",
//     district: "PHN",
//     btsStation: "",
//     storeLocation: BRANCHES[0].name,
//     date: "",
//     time: "",
//     termsAccepted: false,
//   });

//   const { data: btsData, isLoading: isLoadingBts, error: btsError } = useBtsStations();
//   const merged = mergeTrainDataWithApi(btsData);
//   const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

//   const handleInputChange = (
//     field: keyof typeof formState,
//     value: string | Date | boolean | undefined,
//   ) => {
//     if (field === "phone") {
//       const numericValue = (value as string).replace(/[^0-9]/g, "");
//       setFormState((prev) => ({ ...prev, [field]: numericValue }));
//     } else {
//       setFormState((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleEditPhoneClick = () => {
//     setIsPhoneModalOpen(true);
//   };

//   const isFormComplete =
//     formState.customerName &&
//     formState.phone &&
//     formState.date &&
//     formState.time &&
//     formState.termsAccepted &&
//     (locationType === "home"
//       ? formState.address
//       : locationType === "bts"
//         ? formState.btsStation
//         : true);

//   const THB = (n: number) =>
//     n.toLocaleString("th-TH", {
//       style: "currency",
//       currency: "THB",
//       minimumFractionDigits: 0,
//     });

//   const formVariants = {
//     initial: { opacity: 0, y: 10 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -10 },
//   };

//   const updateAssessment = useUpdateAssessment(assessmentId);

//   const handleConfirmPawn = () => {
//     // Combine date and time for queue booking
//     const appointmentAt = combineDateTime(formState.date, formState.time);

//     // Determine branch ID based on location type
//     // For store: use selected branch
//     // For BTS/Home: use default branch (Center One)
//     let branchId: string;
//     if (locationType === "store" && formState.storeLocation) {
//       branchId = getBranchIdFromName(formState.storeLocation);
//       console.log("📍 Pawn store location - branchId:", branchId);
//     } else {
//       // Default branch for BTS/Home services
//       branchId = BRANCHES[0].id; // "เซ็นเตอร์วัน" (Center One)
//       console.log("📍 Pawn BTS/Home service - default branchId:", branchId);
//     }

//     const base = {
//       type: "PAWN" as const,
//       customerName: formState.customerName,
//       phone: formState.phone,
//       locationType,
//       appointmentDate: String(formState.date),
//       appointmentTime: String(formState.time),
//       // Queue booking fields
//       appointmentAt,
//       branchId,
//       serviceType: SERVICE_TYPES.PAWN,
//     };

//     const payload: PawnServiceInfo =
//       locationType === "home"
//         ? {
//             ...base,
//             address: formState.address,
//             province: formState.province,
//             district: formState.district,
//           }
//         : locationType === "bts"
//           ? { ...base, btsStation: formState.btsStation, btsLine: selectedBtsLine }
//           : { ...base, storeLocation: formState.storeLocation };

//     updateAssessment.mutate(
//       { status: "reserved", pawnServiceInfo: payload },
//       {
//         onSuccess: () => {
//           void Swal.fire({
//             icon: "success",
//             title: "ยืนยันข้อมูลสำเร็จ",
//             text: "เราจะติดต่อคุณเร็วๆ นี้",
//           });
//           onSuccess?.();
//         },
//         onError: () => {
//           void Swal.fire({
//             icon: "error",
//             title: "บันทึกข้อมูลไม่สำเร็จ",
//             text: "กรุณาลองใหม่อีกครั้ง",
//           });
//         },
//       },
//     );
//   };

//   return (
//     <main className="w-full space-y-6 pt-4">
//       {/* Price Display */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{
//           duration: 0.5,
//           ease: [0.22, 1, 0.36, 1],
//         }}
//         className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-white p-6 text-center shadow-lg"
//       >
//         <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-orange-100/50 blur-2xl" />
//         <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-amber-100/50 blur-2xl" />
//         <div className="relative z-10">
//           <h3 className="text-lg font-semibold text-orange-900">ยอดเงินที่คุณจะได้รับ (จำนำ)</h3>
//           <div className="mt-2 flex items-center justify-center gap-2">
//             <p className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
//               {THB(pawnPrice)}
//             </p>
//             <Image
//               src={"https://lh3.googleusercontent.com/d/1X_QS-ahnw2ubo0brwEt-oZwLX64JpNiK"}
//               width={100}
//               height={100}
//               alt="animated-coin"
//               className="-m-6"
//               priority
//             />
//           </div>
//           <p className="mt-2 text-sm text-orange-800/80">รับเงินสดทันทีเมื่อการตรวจสอบเสร็จสิ้น</p>
//         </div>
//       </motion.div>

//       {/* Benefits Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         className="rounded-xl border border-orange-100 bg-orange-50/50 p-4"
//       >
//         <h4 className="mb-3 text-sm font-semibold text-orange-900">สิทธิประโยชน์ที่คุณได้รับ</h4>
//         <ul className="space-y-2 text-sm text-orange-800">
//           <li className="flex items-start gap-2">
//             <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
//             <span>รับเงินสดทันที 30 นาที</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
//             <span>ไม่มีค่าธรรมเนียมใดๆ ทั้งสิ้น</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
//             <span>ไม่ต้องตัดจีพีเอสและไอคราวด์</span>
//           </li>
//           <li className="flex items-start gap-2">
//             <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
//             <span>ไถ่คืนได้ตลอดเวลา ไม่มีดอกเบี้ย</span>
//           </li>
//         </ul>
//       </motion.div>

//       {/* Main Form */}
//       <motion.div
//         initial="initial"
//         animate="animate"
//         variants={{
//           animate: { transition: { staggerChildren: 0.1 } },
//         }}
//         className="space-y-6"
//       >
//         {/* Step 1: Location Selection */}
//         <motion.div variants={formVariants}>
//           <Label className="mb-3 block text-lg font-semibold">1. เลือกสถานที่จำนำ</Label>
//           <div className="grid grid-cols-3 gap-3">
//             <Button
//               type="button"
//               variant={locationType === "home" ? "default" : "outline"}
//               onClick={() => setLocationType("home")}
//               className="flex h-auto flex-col items-center gap-2 py-4"
//             >
//               <Home className="h-6 w-6" />
//               <span className="text-xs">จำนำถึงบ้าน</span>
//             </Button>
//             <Button
//               type="button"
//               variant={locationType === "bts" ? "default" : "outline"}
//               onClick={() => setLocationType("bts")}
//               className="flex h-auto flex-col items-center gap-2 py-4"
//             >
//               <Train className="h-6 w-6" />
//               <span className="text-xs">BTS/MRT</span>
//             </Button>
//             <Button
//               type="button"
//               variant={locationType === "store" ? "default" : "outline"}
//               onClick={() => setLocationType("store")}
//               className="flex h-auto flex-col items-center gap-2 py-4"
//             >
//               <Store className="h-6 w-6" />
//               <span className="text-xs">จำนำที่ร้าน</span>
//             </Button>
//           </div>
//         </motion.div>

//         {/* Step 2: Customer Details */}
//         <motion.div variants={formVariants} className="space-y-4">
//           <Label className="block text-lg font-semibold">2. กรอกข้อมูลส่วนตัว</Label>

//           <div className="space-y-2">
//             <Label htmlFor="customerName-pawn">ชื่อ-นามสกุล</Label>
//             <div className="relative">
//               <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
//               <Input
//                 id="customerName-pawn"
//                 placeholder="กรอกชื่อ-นามสกุล"
//                 value={formState.customerName}
//                 onChange={(e) => handleInputChange("customerName", e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="phone-pawn">เบอร์โทรศัพท์ติดต่อ</Label>
//             <div className="relative">
//               <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
//               <Input
//                 id="phone-pawn"
//                 type="tel"
//                 placeholder="0xx-xxx-xxxx"
//                 value={formState.phone}
//                 readOnly
//                 className="pr-12 pl-10"
//               />
//               <button
//                 type="button"
//                 onClick={handleEditPhoneClick}
//                 className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md border bg-white p-2 text-slate-600 hover:bg-slate-50"
//                 aria-label="แก้ไขเบอร์โทรศัพท์"
//               >
//                 <Pencil className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           <PhoneNumberEditModal
//             open={isPhoneModalOpen}
//             initialPhone={formState.phone}
//             onCancel={() => setIsPhoneModalOpen(false)}
//             onSave={(newPhone) => {
//               handleInputChange("phone", newPhone);
//               setIsPhoneModalOpen(false);
//             }}
//           />
//         </motion.div>

//         {/* Step 3: Location Details */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={locationType}
//             variants={formVariants}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//             className="space-y-4"
//           >
//             <Label className="block text-lg font-semibold">3. ระบุรายละเอียดสถานที่</Label>

//             {locationType === "home" && (
//               <motion.div key="home-form" variants={formVariants} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="address-pawn">ที่อยู่</Label>
//                   <p className="text-sm font-bold text-red-600">
//                     *หากต้องการจำนำด่วนภายในวันนี้ กรุณาติดต่อ 098-950-9222
//                   </p>
//                   <Textarea
//                     id="address-pawn"
//                     placeholder="กรอกที่อยู่โดยละเอียด"
//                     value={formState.address}
//                     onChange={(e) => handleInputChange("address", e.target.value)}
//                     className="min-h-[80px]"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="province-pawn">จังหวัด</Label>
//                     <Select
//                       value={formState.province}
//                       onValueChange={(value) => handleInputChange("province", value)}
//                     >
//                       <SelectTrigger id="province-pawn" className="w-full">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="BKK">กรุงเทพมหานคร</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="district-pawn">เขต</Label>
//                     <Select
//                       value={formState.district}
//                       onValueChange={(value) => handleInputChange("district", value)}
//                     >
//                       <SelectTrigger id="district-pawn" className="w-full">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="PHN">เขตพระนคร</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {locationType === "bts" && (
//               <motion.div key="bts-form" variants={formVariants} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="bts-line-pawn">สายรถไฟ BTS/MRT</Label>
//                     <Select
//                       onValueChange={setSelectedBtsLine}
//                       disabled={isLoadingBts || !!btsError}
//                     >
//                       <SelectTrigger id="bts-line-pawn" className="w-full">
//                         <SelectValue
//                           placeholder={
//                             isLoadingBts
//                               ? "กำลังโหลด..."
//                               : btsError
//                                 ? "เกิดข้อผิดพลาด"
//                                 : "เลือกสายรถไฟ"
//                           }
//                         />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {merged.lines.map((line) => (
//                           <SelectItem key={line.LineId} value={line.LineName_TH}>
//                             {line.LineName_TH}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="bts-station-pawn">ระบุสถานี</Label>
//                     <Select
//                       disabled={!selectedBtsLine}
//                       onValueChange={(value) => handleInputChange("btsStation", value)}
//                     >
//                       <SelectTrigger id="bts-station-pawn" className="w-full">
//                         <SelectValue placeholder="เลือกสถานี" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {(merged.stationsByLine[selectedBtsLine] || []).map((station) => (
//                           <SelectItem key={station.StationId} value={station.StationNameTH}>
//                             {station.StationNameTH}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {locationType === "store" && (
//               <motion.div key="store-form" variants={formVariants} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="store-branch-pawn">สาขา</Label>
//                   <Select
//                     value={formState.storeLocation}
//                     onValueChange={(value) => handleInputChange("storeLocation", value)}
//                   >
//                     <SelectTrigger id="store-branch-pawn" className="w-full">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {BRANCHES.map((branch) => (
//                         <SelectItem key={branch.id} value={branch.name}>
//                           {branch.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </motion.div>
//             )}
//           </motion.div>
//         </AnimatePresence>

//         {/* Step 4: Date & Time (combined) */}
//         <motion.div variants={formVariants} className="space-y-4">
//           <Label className="block text-lg font-semibold">4. เลือกวันและเวลา</Label>
//           <div className="grid grid-cols-1 gap-4">
//             <DateTimeSelect
//               serviceType="บริการจำนำ"
//               serviceData={{ ...formState, locationType }}
//               dateValue={formState.date}
//               onDateChange={(value) => handleInputChange("date", value)}
//               timeValue={formState.time}
//               onTimeChange={(value) => handleInputChange("time", value)}
//               className="w-full"
//               labelDate="วัน"
//               labelTime="เวลา"
//             />
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* Confirmation */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{
//           opacity: 1,
//           y: 0,
//           transition: { delay: 0.3 },
//         }}
//         className="space-y-6 pt-4"
//       >
//         <div className="flex items-start space-x-3">
//           <Checkbox
//             id="terms-pawn"
//             checked={formState.termsAccepted}
//             onCheckedChange={(checked) => handleInputChange("termsAccepted", Boolean(checked))}
//             className="mt-1"
//           />
//           <label
//             htmlFor="terms-pawn"
//             className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//           >
//             ฉันยอมรับข้อตกลงและเงื่อนไข{" "}
//             <a href="#top" className="text-blue-600 underline">
//               การจำนำสินค้าของทางร้าน
//             </a>
//           </label>
//         </div>
//         <FramerButton
//           size="lg"
//           disabled={!isFormComplete || updateAssessment.isPending}
//           className="h-14 w-full"
//           onClick={handleConfirmPawn}
//         >
//           {updateAssessment.isPending ? "กำลังบันทึก..." : "ยืนยันการจำนำและรับเงินทันที"}
//         </FramerButton>
//       </motion.div>
//     </main>
//   );
// }
