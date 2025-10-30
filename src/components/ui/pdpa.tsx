"use client";
import clsx from "clsx";

export default function PDPA({
  serviceName,
  handleShowConsent,
}: {
  serviceName: "consignment" | "iphone-exchange" | "sellnow" | "tradein" | "refinance";
  handleShowConsent: () => void;
}) {
  const pdpaColor = () => {
    switch (serviceName) {
      case "consignment":
        return "text-sky-600  hover:text-sky-700 ";
      case "iphone-exchange":
        return "text-green-600  hover:text-green-700 ";
      case "sellnow":
        return "text-pink-600 underline hover:text-pink-700 ";
      case "tradein":
        return "text-amber-600  hover:text-amber-700  ";
      case "refinance":
        return "text-purple-600  hover:text-purple-700 ";
      default:
        return "text-gray-600";
    }
  };

  const pdpaWord = () => {
    switch (serviceName) {
      case "consignment":
        return 'การคลิก "ยืนยันการฝากขาย" ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน';
      case "iphone-exchange":
        return 'การคลิก "ยืนยันการแลกเปลี่ยน iPhone" ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน';
      case "sellnow":
        return 'การคลิก "ยืนยันการขาย" ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน';
      case "tradein":
        return 'การคลิก "ยืนยันการแลกเปลี่ยนเครื่องใหม่" ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน';
      case "refinance":
        return 'การคลิก "ยืนยันการรีไฟแนนซ์" ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน';
      default:
        return 'การคลิก "ยืนยัน" ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน';
    }
  };

  return (
    <>
      <p className="text-center text-xs text-black">
        {pdpaWord()}{" "}
        <button onClick={handleShowConsent} className={clsx("font-semibold", pdpaColor())}>
          ข้อตกลงและเงื่อนไขการใช้บริการ
        </button>
      </p>
    </>
  );
}
