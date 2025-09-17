import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { DeviceInfo } from "../page";

interface AssessStep1Props {
  deviceInfo: DeviceInfo;
  onDeviceUpdate: (info: DeviceInfo) => void;
  onNext: () => void;
}

// Mock data
const MOCK_DATA = {
  brands: ["Apple", "Samsung", "Google"],
  models: {
    Apple: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro"],
    Samsung: ["Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra"],
    Google: ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7"],
  } as Record<string, string[]>,
  storage: {
    "iPhone 15 Pro Max": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 15 Pro": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 15": ["128 GB", "256 GB", "512 GB"],
    "Galaxy S24 Ultra": ["256 GB", "512 GB", "1 TB"],
    "Galaxy S24+": ["256 GB", "512 GB"],
    "Galaxy S24": ["128 GB", "256 GB", "512 GB"],
    "Pixel 8 Pro": ["128 GB", "256 GB", "512 GB"],
    "Pixel 8": ["128 GB", "256 GB"],
  } as Record<string, string[]>,
};

const AssessStep1 = ({ deviceInfo, onDeviceUpdate, onNext }: AssessStep1Props) => {
  const [localInfo, setLocalInfo] = useState<DeviceInfo>(deviceInfo);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableStorage, setAvailableStorage] = useState<string[]>([]);

  useEffect(() => {
    if (localInfo.brand && MOCK_DATA.models[localInfo.brand]) {
      setAvailableModels(MOCK_DATA.models[localInfo.brand]);
      // Reset model and storage when brand changes
      if (localInfo.brand !== deviceInfo.brand) {
        setLocalInfo((prev) => ({ ...prev, model: "", storage: "" }));
      }
    } else {
      setAvailableModels([]);
    }
  }, [localInfo.brand, deviceInfo.brand]);

  useEffect(() => {
    if (localInfo.model && MOCK_DATA.storage[localInfo.model]) {
      setAvailableStorage(MOCK_DATA.storage[localInfo.model]);
      // Reset storage when model changes
      if (localInfo.model !== deviceInfo.model) {
        setLocalInfo((prev) => ({ ...prev, storage: "" }));
      }
    } else {
      setAvailableStorage([]);
    }
  }, [localInfo.model, deviceInfo.model]);

  useEffect(() => {
    onDeviceUpdate(localInfo);
  }, [localInfo, onDeviceUpdate]);

  const handleSelectChange = (field: keyof DeviceInfo, value: string) => {
    setLocalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const isComplete = localInfo.brand && localInfo.model && localInfo.storage;

  return (
    <div className="card-assessment">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">ระบุรุ่นมือถือของคุณ</h2>
        <p className="text-muted-foreground">เลือกยี่ห้อ รุ่น และความจุเก็บข้อมูลของเครื่องที่ต้องการประเมิน</p>
      </div>

      <div className="space-y-6">
        {/* Brand Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">ยี่ห้อ *</label>
          <div className="relative">
            <select
              value={localInfo.brand}
              onChange={(e) => handleSelectChange("brand", e.target.value)}
              className="w-full p-4 bg-card border border-border rounded-xl appearance-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth text-foreground"
            >
              <option value="">เลือกยี่ห้อ</option>
              {MOCK_DATA.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">รุ่น *</label>
          <div className="relative">
            <select
              value={localInfo.model}
              onChange={(e) => handleSelectChange("model", e.target.value)}
              disabled={!localInfo.brand}
              className="w-full p-4 bg-card border border-border rounded-xl appearance-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">เลือกรุ่น</option>
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Storage Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">ความจุ *</label>
          <div className="relative">
            <select
              value={localInfo.storage}
              onChange={(e) => handleSelectChange("storage", e.target.value)}
              disabled={!localInfo.model}
              className="w-full p-4 bg-card border border-border rounded-xl appearance-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">เลือกความจุ</option>
              {availableStorage.map((storage) => (
                <option key={storage} value={storage}>
                  {storage}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-smooth shadow-soft hover:shadow-card transform hover:scale-105 disabled:hover:scale-100"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default AssessStep1;
