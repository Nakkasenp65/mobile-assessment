import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useMobile = (product: string, model: string) => {
  return useQuery({
    // 1. Query Key: คือ "ID" ของข้อมูลนี้ใน Cache ของ TanStack
    // มันต้องเปลี่ยนไปตาม product และ model ที่เลือก
    queryKey: ["productImage", { product, model }],

    // 2. Query Function: คือฟังก์ชันที่จะทำงานเพื่อดึงข้อมูล
    queryFn: async () => {
      let queryModel = "";
      let queryProduct = "";

      if (product === "Apple") {
        queryProduct = "iPhone";
        queryModel = model;
      } else if (product === "Samsung") {
        queryModel = model.replace("Galaxy", "Samsung");
        queryProduct = "Samsung";
      } else {
        queryModel = model;
      }

      const { data, error } = await supabase
        .from("Mobile")
        .select("image_url")
        .eq("product", queryProduct)
        .eq("model", queryModel)
        .limit(1)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!product && !!model,
    staleTime: 60 * 1000 * 60,
    retry: 1,
    retryDelay: 1000,
  });
};
