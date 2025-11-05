"use client";

import { Label } from "@radix-ui/react-label";
import { MapPin } from "lucide-react";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { Combobox, ComboboxOption } from "../../../../../components/ui/Combobox";
import { Textarea } from "../../../../../components/ui/textarea";
import { useLocationSuggestion } from "../../../../../hooks/useLocationSuggestion";
import useZipLocation from "../../../../../hooks/useZipLocation";
import { SellnowServiceFormState } from "../SellNowService";

interface DefaultAddressFormProps {
  formData: SellnowServiceFormState;
  setFormData: React.Dispatch<React.SetStateAction<Partial<SellnowServiceFormState>>>;
}

export default function DefaultAddressForm({ formData, setFormData }: DefaultAddressFormProps) {
  const [provinceId, setProvinceId] = useState<number | undefined>();
  const [amphoeId, setAmphoeId] = useState<number | undefined>();
  const [tambonId, setTambonId] = useState<number | undefined>();
  const [zipSearch, setZipSearch] = useState("");

  const [debouncedZipSearch] = useDebounce(zipSearch, 400);

  const provinceQ = useLocationSuggestion("", { type: "province", limit: 300 });

  const districtQ = useLocationSuggestion("", {
    type: "amphoe",
    provinceId,
    limit: 300,
  });

  const tambonQ = useLocationSuggestion("", {
    type: "tambon",
    provinceId,
    amphoeId,
    limit: 300,
  });

  const zipQ = useZipLocation(debouncedZipSearch, {
    limit: 100,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset dependent fields when province/district changes
    if (name === "province") {
      setFormData((prev) => ({
        ...prev,
        district: "",
        subDistrict: "",
        postalCode: "",
      }));
      setAmphoeId(undefined);
      setTambonId(undefined);
    }
    if (name === "district") {
      setFormData((prev) => ({
        ...prev,
        subDistrict: "",
        postalCode: "",
      }));
      setTambonId(undefined);
    }
  };

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-3 border-b pb-2 text-xl font-semibold text-gray-700">
        <MapPin className="h-6 w-6 text-green-600" />
        ข้อมูลที่อยู่
      </h2>
      <div className="space-y-6">
        {/* --- Grid สำหรับ ที่อยู่ส่วนย่อย --- */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* --- รหัสไปรษณีย์ --- */}
          <div className="flex w-full flex-col items-start gap-2">
            <Label>รหัสไปรษณีย์</Label>
            <Combobox
              options={(() => {
                const options =
                  zipQ.data?.map((r) => {
                    const zip = r.zip_code ?? "";
                    const tambon = r.tambon_name_th ?? r.tambon_name_en ?? "";
                    const amphoe = r.amphoe_name_th ?? r.amphoe_name_en ?? "";
                    const province = r.province_name_th ?? r.province_name_en ?? "";
                    return {
                      value: zip,
                      label: zip,
                      subLabel: `${tambon} • ${amphoe} • ${province}`,
                      data: r,
                    } as ComboboxOption;
                  }) ?? [];

                // ถ้ามีค่าใน postalCode แต่ไม่มีใน options ให้เพิ่ม ghost option
                if (formData.postcode && !options.find((opt) => opt.value === formData.postcode)) {
                  options.unshift({
                    value: formData.postcode,
                    label: formData.postcode,
                    subLabel: `${formData.subdistrict} • ${formData.district} • ${formData.province}`,
                    data: null,
                  });
                }

                return options;
              })()}
              value={formData.postcode}
              onOptionSelect={(option) => {
                const selectedZip = option.data;
                if (selectedZip) {
                  setFormData((prev) => ({
                    ...prev,
                    postcode: option.value,
                    subdistrict: selectedZip.tambon_name_th ?? selectedZip.tambon_name_en ?? "",
                    district: selectedZip.amphoe_name_th ?? selectedZip.amphoe_name_en ?? "",
                    province: selectedZip.province_name_th ?? selectedZip.province_name_en ?? "",
                  }));
                  setProvinceId(selectedZip.province_id);
                  setAmphoeId(selectedZip.amphoe_id);
                }
              }}
              onSearchChange={setZipSearch}
              placeholder="เลือกรหัสไปรษณีย์"
              searchPlaceholder="ค้นหารหัสไปรษณีย์..."
              emptyText="ลองพิมพ์เพื่อค้นหารหัสไปรษณีย์"
              disabled={false}
            />
          </div>

          {/* --- จังหวัด --- */}
          <div className="flex w-full flex-col items-start gap-2">
            <Label>จังหวัด</Label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={(e) => {
                handleChange(e);
                const selectedProvince = provinceQ.data?.find(
                  (p) => (p.province_name_th ?? p.province_name_en) === e.target.value,
                );
                if (selectedProvince) {
                  setProvinceId(selectedProvince.province_id);
                }
              }}
              className="border-border w-full rounded-md border px-4 py-2 shadow-sm"
              required
            >
              <option value="">-- เลือกจังหวัด --</option>
              {provinceQ.data?.map((p) => {
                const label = p.province_name_th ?? p.province_name_en ?? "";
                return (
                  <option key={p.province_id} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* --- อำเภอ/เขต --- */}
          <div className="flex w-full flex-col items-start gap-2">
            <Label>อำเภอ/เขต</Label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={(e) => {
                handleChange(e);
                const selectedDistrict = districtQ.data?.find(
                  (d) => (d.amphoe_name_th ?? d.amphoe_name_en) === e.target.value,
                );
                if (selectedDistrict) {
                  setAmphoeId(selectedDistrict.amphoe_id);
                }
              }}
              className="border-border w-full rounded-md border px-4 py-2 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
              disabled={!provinceId}
              required
            >
              <option value="">-- เลือกอำเภอ/เขต --</option>
              {districtQ.data?.map((d) => {
                const label = d.amphoe_name_th ?? d.amphoe_name_en ?? "";
                return (
                  <option key={d.amphoe_id} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* --- ตำบล/แขวง --- */}
          <div className="flex w-full flex-col items-start gap-2">
            <Label>ตำบล/แขวง</Label>
            <select
              id="subDistrict"
              name="subDistrict"
              value={formData.subdistrict}
              onChange={(e) => {
                handleChange(e);
                const selectedTambon = tambonQ.data?.find(
                  (t) => (t.tambon_name_th ?? t.tambon_name_en) === e.target.value,
                );
                if (selectedTambon) {
                  setTambonId(selectedTambon.tambon_id);
                }
              }}
              className="border-border w-full rounded-md border px-4 py-2 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
              disabled={!amphoeId}
              required
            >
              <option value="">-- เลือกตำบล/แขวง --</option>
              {tambonQ.data?.map((t) => {
                const label = t.tambon_name_th ?? t.tambon_name_en ?? "";
                return (
                  <option key={t.tambon_id} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {/* --- ที่อยู่ (รายละเอียด) --- */}
        <div className="flex w-full flex-col items-start gap-2">
          <Label>รายละเอียดที่อยู่ (บ้านเลขที่, ถนน, หมู่บ้าน, ฯลฯ)</Label>
          <Textarea
            id="addressDetails"
            name="addressDetails"
            rows={3}
            value={formData.addressDetails}
            onChange={handleChange}
            className="min-h-20 resize-y"
            placeholder="เช่น 99/9 หมู่ 1 ถ.สุขุมวิท ซ. 101"
            autoComplete="non-complete-field"
            required
          />
        </div>
      </div>
    </section>
  );
}
