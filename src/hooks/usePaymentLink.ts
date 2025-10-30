import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface PaymentLinkResponse {
  payment_link: string | URL;
  assessment_doc_id: string;
}

interface CreatePaymentLinkResponse {
  id: number;
  created_at: string;
  payment_link: string;
  assessment_doc_id: string;
}

interface CreatePaymentLinkInput {
  link: string;
  link_id: string;
}

interface CreatePaymentLinkPayload {
  doc_id: string;
  link: string;
  link_id: string;
}
const paymentEdgeUrl = process.env.NEXT_PUBLIC_SUPABASE_PAYMENT_LINK_STORAGE;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function ensureEnv(name: string, value?: string | undefined) {
  if (!value) {
    throw new Error(`${name} is not configured. Set the environment variable.`);
  }
}

export const usePaymentLink = (assessment_doc_id: string) => {
  return useQuery<PaymentLinkResponse>({
    queryKey: ["payment_link", { assessment_doc_id }],
    queryFn: async () => {
      ensureEnv("NEXT_PUBLIC_SUPABASE_PAYMENT_LINK_STORAGE", paymentEdgeUrl);
      ensureEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey);

      try {
        const url = new URL(String(paymentEdgeUrl));
        url.searchParams.set("doc_id", assessment_doc_id);

        const { data } = await axios.get<PaymentLinkResponse>(url.toString(), {
          headers: {
            Authorization: `Bearer ${anonKey}`,
          },
        });

        if (!data) {
          throw new Error("Getting payment link returned empty response");
        }

        return data;
      } catch (err) {
        const axErr = err as AxiosError<{ message?: string } & { error?: { message?: string } }>;
        const msg =
          axErr.response?.data?.error?.message ||
          axErr.response?.data?.message ||
          axErr.message ||
          "Cannot get payment link";
        console.error("GET payment edge failed:", axErr);
        throw new Error(msg);
      }
    },
    enabled: !!assessment_doc_id,
    staleTime: 60 * 1000 * 60,
    retry: 1,
    retryDelay: 3000,
  });
};

export const useCreatePaymentLink = (doc_id: string) => {
  function validateInput(input: CreatePaymentLinkInput): string[] {
    const errors: string[] = [];
    if (!input.link_id) errors.push("link_id is required");
    if (!input.link) errors.push("link is required");
    return errors;
  }

  return useMutation<CreatePaymentLinkResponse, Error, CreatePaymentLinkInput>({
    mutationFn: async (input: CreatePaymentLinkInput) => {
      ensureEnv("NEXT_PUBLIC_SUPABASE_PAYMENT_LINK_STORAGE", paymentEdgeUrl);
      ensureEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey);

      const validationErrors = validateInput(input);
      if (validationErrors.length) {
        throw new Error(validationErrors.join("; "));
      }

      const payload: CreatePaymentLinkPayload = {
        doc_id: doc_id,
        link: input.link,
        link_id: input.link_id,
      };

      try {
        const { data } = await axios.post<CreatePaymentLinkResponse>(paymentEdgeUrl, payload, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonKey}` },
        });

        if (!data) {
          throw new Error("Create payment link returned empty response");
        }
        return data;
      } catch (err) {
        const axErr = err as AxiosError<{ message?: string } & { error?: { message?: string } }>;
        const msg =
          axErr.response?.data?.error?.message ||
          axErr.response?.data?.message ||
          axErr.message ||
          "Cannot create payment link";
        console.error("POST payment edge failed:", axErr);
        throw new Error(msg);
      }
    },
  });
};
