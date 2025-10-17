/**
 * @fileoverview Defines the data structure and exports the train line data for Bangkok.
 * This file can be used to populate UI components like dropdown selectors for train lines and stations.
 */

/**
 * Interface for a single train station.
 * โครงสร้างข้อมูลสำหรับสถานีรถไฟแต่ละสถานี
 */
export interface Station {
  station_code: string;
  name_th: string;
  internal_id: number | string; // ID อาจเป็นตัวเลขหรือข้อความ
}

/**
 * Interface for a single train line, containing its name and a list of stations.
 * โครงสร้างข้อมูลสำหรับสายรถไฟแต่ละสาย ประกอบด้วยชื่อสายและรายชื่อสถานี
 */
export interface TrainLine {
  line_name_th: string;
  line_name_en: string;
  stations: Station[];
}

/**
 * Interface for the main data object, which maps a line code (e.g., "BL") to its TrainLine object.
 * โครงสร้างสำหรับข้อมูลรถไฟทั้งหมด ที่จับคู่รหัสสาย (เช่น "BL") เข้ากับข้อมูลของสายนั้นๆ
 */
export interface TrainLineData {
  [key: string]: TrainLine;
}

/**
 * Constant containing all train line and station data.
 * ข้อมูลรถไฟฟ้าและสถานีทั้งหมด
 */
export const trainLines: TrainLineData = {
  BL: {
    line_name_th: "สายสีน้ำเงิน",
    line_name_en: "Blue Line",
    stations: [
      { station_code: "BL01", name_th: "ท่าพระ", internal_id: 1 },
      { station_code: "BL02", name_th: "จรัญฯ 13", internal_id: 2 },
      { station_code: "BL03", name_th: "ไฟฉาย", internal_id: 3 },
      { station_code: "BL04", name_th: "บางขุนนนท์", internal_id: 4 },
      { station_code: "BL05", name_th: "บางยี่ขัน", internal_id: 5 },
      { station_code: "BL06", name_th: "สิรินธร", internal_id: 6 },
      { station_code: "BL07", name_th: "บางพลัด", internal_id: 7 },
      { station_code: "BL08", name_th: "บางอ้อ", internal_id: 8 },
      { station_code: "BL09", name_th: "บางโพ", internal_id: 9 },
      { station_code: "BL10", name_th: "เตาปูน", internal_id: 10 },
      { station_code: "BL11", name_th: "บางซื่อ", internal_id: 11 },
      { station_code: "BL12", name_th: "กำแพงเพชร", internal_id: 12 },
      { station_code: "BL13", name_th: "สวนจตุจักร", internal_id: 13 },
      { station_code: "BL14", name_th: "พหลโยธิน", internal_id: 14 },
      { station_code: "BL15", name_th: "ลาดพร้าว", internal_id: 15 },
      { station_code: "BL16", name_th: "รัชดาภิเษก", internal_id: 16 },
      { station_code: "BL17", name_th: "สุทธิสาร", internal_id: 17 },
      { station_code: "BL18", name_th: "ห้วยขวาง", internal_id: 18 },
      { station_code: "BL19", name_th: "ศูนย์วัฒนธรรมแห่งประเทศไทย", internal_id: 19 },
      { station_code: "BL20", name_th: "พระราม 9", internal_id: 20 },
      { station_code: "BL21", name_th: "เพชรบุรี", internal_id: 21 },
      { station_code: "BL22", name_th: "สุขุมวิท", internal_id: 22 },
      { station_code: "BL23", name_th: "ศูนย์การประชุมแห่งชาติสิริกิติ์", internal_id: 23 },
      { station_code: "BL24", name_th: "คลองเตย", internal_id: 24 },
      { station_code: "BL25", name_th: "ลุมพินี", internal_id: 25 },
      { station_code: "BL26", name_th: "สีลม", internal_id: 26 },
      { station_code: "BL27", name_th: "สามย่าน", internal_id: 27 },
      { station_code: "BL28", name_th: "หัวลำโพง", internal_id: 28 },
      { station_code: "BL29", name_th: "วัดมังกร", internal_id: 29 },
      { station_code: "BL30", name_th: "สามยอด", internal_id: 30 },
      { station_code: "BL31", name_th: "สนามไชย", internal_id: 31 },
      { station_code: "BL32", name_th: "อิสรภาพ", internal_id: 32 },
      { station_code: "BL33", name_th: "บางไผ่", internal_id: 33 },
      { station_code: "BL34", name_th: "บางหว้า", internal_id: 34 },
      { station_code: "BL35", name_th: "เพชรเกษม 48", internal_id: 35 },
      { station_code: "BL36", name_th: "ภาษีเจริญ", internal_id: 36 },
      { station_code: "BL37", name_th: "บางแค", internal_id: 37 },
      { station_code: "BL38", name_th: "หลักสอง", internal_id: 38 },
    ],
  },
  PP: {
    line_name_th: "สายสีม่วง",
    line_name_en: "Purple Line",
    stations: [
      { station_code: "PP01", name_th: "คลองบางไผ่", internal_id: 43 },
      { station_code: "PP02", name_th: "ตลาดบางใหญ่", internal_id: 44 },
      { station_code: "PP03", name_th: "สามแยกบางใหญ่", internal_id: 45 },
      { station_code: "PP04", name_th: "บางพลู", internal_id: 46 },
      { station_code: "PP05", name_th: "บางรักใหญ่", internal_id: 47 },
      { station_code: "PP06", name_th: "บางรักน้อยท่าอิฐ", internal_id: 48 },
      { station_code: "PP07", name_th: "ไทรม้า", internal_id: 49 },
      { station_code: "PP08", name_th: "สะพานพระนั่งเกล้า", internal_id: 50 },
      { station_code: "PP09", name_th: "แยกนนทบุรี 1", internal_id: 51 },
      { station_code: "PP10", name_th: "บางกระสอ", internal_id: 52 },
      { station_code: "PP11", name_th: "ศูนย์ราชการนนทบุรี", internal_id: 53 },
      { station_code: "PP12", name_th: "กระทรวงสาธารณสุข", internal_id: 54 },
      { station_code: "PP13", name_th: "แยกติวานนท์", internal_id: 55 },
      { station_code: "PP14", name_th: "วงศ์สว่าง", internal_id: 56 },
      { station_code: "PP15", name_th: "บางซ่อน", internal_id: 57 },
      { station_code: "PP16", name_th: "เตาปูน", internal_id: 58 },
    ],
  },
  RN: {
    line_name_th: "สายนครวิถี (สายเหนือ)",
    line_name_en: "Nakhon Withi Line (Northern)",
    stations: [
      { station_code: "RN01", name_th: "กรุงเทพอภิวัฒน์", internal_id: "3" },
      { station_code: "RN02", name_th: "จตุจักร", internal_id: "4" },
      { station_code: "RN03", name_th: "วัดเสมียนนารี", internal_id: "5" },
      { station_code: "RN04", name_th: "บางเขน", internal_id: "6" },
      { station_code: "RN05", name_th: "ทุ่งสองห้อง", internal_id: "7" },
      { station_code: "RN06", name_th: "หลักสี่", internal_id: "8" },
      { station_code: "RN07", name_th: "การเคหะ", internal_id: "9" },
      { station_code: "RN08", name_th: "ดอนเมือง", internal_id: "10" },
      { station_code: "RN09", name_th: "หลักหก", internal_id: "11" },
      { station_code: "RN10", name_th: "รังสิต", internal_id: "12" },
    ],
  },
  RW: {
    line_name_th: "สายธานีรัถยา (สายตะวันตก)",
    line_name_en: "Thani Ratthaya Line (Western)",
    stations: [
      { station_code: "RW01", name_th: "ตลิ่งชัน", internal_id: "0" },
      { station_code: "RW02", name_th: "บางบำหรุ", internal_id: "1" },
      { station_code: "RW04", name_th: "บางซ่อน", internal_id: "2" },
    ],
  },
  ARL: {
    line_name_th: "แอร์พอร์ต เรล ลิงก์",
    line_name_en: "Airport Rail Link",
    stations: [
      { station_code: "A1", name_th: "สุวรรณภูมิ", internal_id: 60 },
      { station_code: "A2", name_th: "ลาดกระบัง", internal_id: 61 },
      { station_code: "A3", name_th: "บ้านทับช้าง", internal_id: 62 },
      { station_code: "A4", name_th: "หัวหมาก", internal_id: 63 },
      { station_code: "A5", name_th: "รามคำแหง", internal_id: 64 },
      { station_code: "A6", name_th: "มักกะสัน", internal_id: 65 },
      { station_code: "A7", name_th: "ราชปรารภ", internal_id: 66 },
      { station_code: "A8", name_th: "พญาไท", internal_id: 67 },
    ],
  },
};

// -------------------------
// Helpers to merge with BTS API
// -------------------------

// Shapes compatible with /api/bts-stations
export interface ApiStation {
  StationId: number;
  StationNameTH: string;
}
export interface ApiLine {
  LineId: number;
  LineName_TH: string;
  StationList: ApiStation[];
}
export interface BtsMergedData {
  lines: ApiLine[];
  stationsByLine: Record<string, ApiStation[]>;
}

const LINE_DISPLAY_TH: Record<string, string> = {
  BL: "MRT - สายสีน้ำเงิน",
  PP: "MRT - สายสีม่วง",
  RN: "SRT - สายนครวิถี",
  RW: "SRT - สายธานีรัถยา",
};

const LINE_ID_MAP: Record<string, number> = {
  BL: -1001,
  PP: -1002,
  RN: -1003,
  RW: -1004,
};

function toApiLinesFromStatic(): ApiLine[] {
  return Object.entries(trainLines).map(([code, line]) => {
    const baseId = LINE_ID_MAP[code] ?? -2000;
    const displayName = LINE_DISPLAY_TH[code] ?? line.line_name_th;
    const StationList: ApiStation[] = line.stations.map((s, idx) => ({
      StationId: baseId * 1000 + idx, // stable negative ids
      StationNameTH: s.name_th,
    }));
    return {
      LineId: baseId,
      LineName_TH: displayName,
      StationList,
    };
  });
}

function sortStations(list: ApiStation[]): ApiStation[] {
  return [...list].sort((a, b) => a.StationNameTH.localeCompare(b.StationNameTH, "th"));
}

// Prefix BTS line names for consistent display format
function prefixBtsLineName(name: string): string {
  return name.startsWith("BTS - ") ? name : `BTS - ${name}`;
}

export function mergeTrainDataWithApi(
  api?: { lines: ApiLine[]; stationsByLine: Record<string, ApiStation[]> } | null,
): BtsMergedData {
  const staticLines = toApiLinesFromStatic();

  const byName: Record<string, ApiLine> = {};

  // Seed with API lines when present (prefix with "BTS - ")
  (api?.lines ?? []).forEach((line) => {
    const displayName = prefixBtsLineName(line.LineName_TH);
    byName[displayName] = {
      ...line,
      LineName_TH: displayName,
      StationList: sortStations(line.StationList ?? []),
    };
  });

  // Merge or add static lines
  staticLines.forEach((sLine) => {
    const existing = byName[sLine.LineName_TH];
    if (!existing) {
      byName[sLine.LineName_TH] = { ...sLine, StationList: sortStations(sLine.StationList) };
      return;
    }
    // Merge stations by name
    const names = new Set(existing.StationList.map((st) => st.StationNameTH));
    const merged = [...existing.StationList];
    sLine.StationList.forEach((st) => {
      if (!names.has(st.StationNameTH)) merged.push(st);
    });
    byName[sLine.LineName_TH] = { ...existing, StationList: sortStations(merged) };
  });

  const lines = Object.values(byName).sort((a, b) => a.LineName_TH.localeCompare(b.LineName_TH, "th"));
  const stationsByLine: Record<string, ApiStation[]> = {};
  lines.forEach((line) => {
    stationsByLine[line.LineName_TH] = sortStations(line.StationList);
  });

  return { lines, stationsByLine };
}

// Optional: helpers to build select options
export function buildSelectOptions(data: BtsMergedData) {
  const lineOptions = data.lines.map((l) => ({ value: l.LineName_TH, label: l.LineName_TH }));
  const stationOptionsByLine: Record<string, { value: string; label: string }[]> = {};
  Object.entries(data.stationsByLine).forEach(([name, stations]) => {
    stationOptionsByLine[name] = stations.map((s) => ({ value: s.StationNameTH, label: s.StationNameTH }));
  });
  return { lineOptions, stationOptionsByLine };
}

/**
 * Example usage:
 *
 * // To get a list of all train lines for the first dropdown:
 * const lineOptions = Object.keys(trainLines).map(lineCode => ({
 *   value: lineCode,
 *   label: trainLines[lineCode].line_name_th,
 * }));
 *
 * // When a user selects a line (e.g., 'BL'), get the stations for the second dropdown:
 * const selectedLineCode = 'BL';
 * const stationOptions = trainLines[selectedLineCode].stations.map(station => ({
 *   value: station.station_code,
 *   label: station.name_th,
 * }));
 *
 */
