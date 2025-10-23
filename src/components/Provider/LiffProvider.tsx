"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import liff from "@line/liff";
import Loading from "../ui/Loading";

// Types
type ServerEnv = "dev" | "prod" | undefined;

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

type TextResultStatus = "dev-noop" | "unsupported" | "sent" | "error";

interface TextResult {
  status: TextResultStatus;
  error?: string;
}

interface LiffActions {
  closeWindow: () => void;
  openWindow: (url: string, external?: boolean) => void;
  text: (message: string) => Promise<TextResult>;
  shareTargetPicker: (walletUniqueId: string, phoneNumber: string) => Promise<void>;
}

interface LiffContextValue {
  liffProfile: LiffProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  lineAccessToken: string;
  liff: typeof liff | null;
  actions: LiffActions;
  liffDecodedIdToken: unknown | null;
}

const noopActions: LiffActions = {
  closeWindow: () => {},
  openWindow: () => {},
  text: async () => ({ status: "dev-noop" }),
  shareTargetPicker: async () => {},
};

const LiffContext = createContext<LiffContextValue>({
  liffProfile: null,
  isLoggedIn: false,
  isLoading: true,
  lineAccessToken: "",
  liff: null,
  actions: noopActions,
  liffDecodedIdToken: null,
});

const inClient = (): boolean => {
  try {
    return typeof window !== "undefined" && liff.isInClient();
  } catch {
    return false;
  }
};

const liffenvId = process.env.NEXT_PUBLIC_LIFF_ID;
const server = process.env.NEXT_PUBLIC_SERVER_OPTION as ServerEnv; // "dev" | "prod" etc.

interface LiffProviderProps {
  children: React.ReactNode;
}

export function LiffProvider({ children }: LiffProviderProps) {
  const [liffProfile, setLiffProfile] = useState<LiffProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lineAccessToken, setLineAccessToken] = useState<string>("");
  const [liffReady, setLiffReady] = useState<boolean>(false);
  const [liffDecodedIdToken, setLiffDecodedIdToken] = useState<unknown | null>(null);

  useEffect(() => {
    const longProfile: LiffProfile = {
      userId: "U006fb519ba07650932c6981af95d0620",
      displayName: "Long👁️‍🗨️",
      pictureUrl:
        "https://profile.line-scdn.net/0hPsTql5LvD1x5CB7EtsVxYglYDDZaeVZOVjxHahgOUGhMPU9ZVDxIORwJAj5BOhxZAWxBakoIV21bTUB3DWgHYz9BU24mUxsKPhhEezdwJwJNQTdDFRZGXRB2BRAsbhxKUDFHXDVTUDIMbD5jU2oBcTpMFWpFQCxrN19jCnw6Yd8WCngJVG9GOE4BU2_M",
    };
    const thirdProfile = {
      userId: "U87dc3cebcbaecb31cf42e2efd55af2cc",
      displayName: "PINTO🍊",
      pictureUrl:
        "https://profile.line-scdn.net/0h33pF1d5RbBxdP30rE1ASYy1vb3Z-TjUOJV4kfWloNihoD35KIVklcmA9YHkwXysZJlogf2xqZShRLBt6Q2mQKFoPMS1hCSlIeFsg8g",
    };
    const testProfile = {
      userId: "U669f6092308023f227aa435c803b2e74",
      displayName: "Zzz59🧚🏻♀️🌈",
      pictureUrl: "https://lh3.googleusercontent.com/d/1eXgDln7TvPQGiMpzaUdo7l2hKmsh8Kvc",
    };
    const mockDecodedTokenId = {
      iss: "https://access.line.me",
      sub: "U006fb519ba07650932c6981af95d0620",
      aud: "2007338329",
      exp: 1757671690,
      iat: 1757668090,
      amr: ["linesso"],
      name: "Long👁️‍🗨️",
      picture:
        "https://profile.line-scdn.net/0hPsTqXG7qD1xpCB7EtsVwCxRNATEeJgkUEW0SPRxcV21AME0NBm8SMk9YUD8WPUpeBjpCOxwOUWpFJz0CKDZGfRV7GG5GWiNZVQU2Pg1zKRoqMTF1HC44PCtULzg4UB5eFWsfPSpxCm0acBx8PGhEewd-FShCOTBuNAw",
      email: "nakkasenwunthar@gmail.com",
    };

    const lineAccessTokenDev = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    const init = async () => {
      if (server === "dev") {
        // Dev mode: mock login/profile, mark as ready
        setIsLoggedIn(true);
        setLiffProfile(longProfile);
        setLineAccessToken(lineAccessTokenDev || "");
        setLiffDecodedIdToken(mockDecodedTokenId);
        setLiffReady(true); // no real LIFF in dev
        setIsLoading(false);
        return;
      }

      try {
        if (!liffenvId) {
          console.error("[LIFF init error] Missing NEXT_PUBLIC_LIFF_ID");
          setIsLoading(false);
          return;
        }
        await liff.init({ liffId: liffenvId });
        setLiffReady(true);

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const decodedIdToken = liff.getDecodedIDToken();
          const profile = await liff.getProfile();
          setLiffProfile({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
          });
          setLiffDecodedIdToken(decodedIdToken);
          const accessToken = liff.getAccessToken();
          console.log("Access token liff provider: ", accessToken);
          setLineAccessToken(accessToken || "");
          setIsLoading(false);
        } else {
          liff.login();
        }
      } catch (e) {
        console.error("[LIFF init error]", e);
      }
    };

    init();
  }, []);

  // Safe wrappers so components can call without worrying about environment
  const actions: LiffActions = {
    closeWindow: () => {
      try {
        if (server === "dev") {
          console.warn("[LIFF] closeWindow noop in dev");
          return;
        }
        if (inClient()) {
          liff.closeWindow();
        } else {
          // Fallback when opened in external browser
          window.close();
        }
      } catch (e) {
        console.error("[LIFF closeWindow error]", e);
      }
    },
    openWindow: (url: string, external = false) => {
      try {
        if (server === "dev") {
          window.open(url, "_blank");
          return;
        }
        liff.openWindow({ url, external });
      } catch (e) {
        console.error("[LIFF openWindow error]", e);
      }
    },
    text: async (message: string): Promise<TextResult> => {
      try {
        if (server === "dev") {
          console.warn("[LIFF] text noop in dev:", message);
          return { status: "dev-noop" };
        }
        if (!inClient()) {
          console.warn("[LIFF] text() works only inside LINE client chat.");
          return { status: "unsupported" };
        }
        if (!message || typeof message !== "string") {
          return {
            status: "error",
            error: "message must be a non-empty string",
          };
        }
        await liff.sendMessages([{ type: "text", text: message }] as Parameters<
          typeof liff.sendMessages
        >[0]);
        return { status: "sent" };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[LIFF text error]", e);
        return { status: "error", error: msg };
      }
    },
    shareTargetPicker: async (walletUniqueId: string, phoneNumber: string): Promise<void> => {
      if (server === "dev") {
        console.warn("[LIFF DEV] Simulating shareTargetPicker with payload:", {
          walletUniqueId,
          phoneNumber,
        });
        return;
      }

      if (!liffReady || !liff.isLoggedIn()) {
        console.error(
          "[LIFF_ERROR] LIFF is not ready or user is not logged in for shareTargetPicker.",
        );
        return;
      }

      const messages = [
        {
          type: "text",
          text: `กระเป๋า 1 Wallet ของฉัน 👜\nWallet ID: ${walletUniqueId}\nPhone: ${phoneNumber}`,
        },
      ] as Parameters<typeof liff.shareTargetPicker>[0];

      try {
        const result = await liff.shareTargetPicker(messages, {
          isMultiple: true,
        });
        if (result) {
          console.log(`[LIFF_SUCCESS] Message sent with status:`, result.status);
        } else {
          console.log("[LIFF_INFO] TargetPicker was closed by the user.");
        }
      } catch (error: unknown) {
        console.error("[LIFF_FATAL_ERROR] shareTargetPicker failed:", error);
      }
    },
  };

  if (isLoading) {
    return (
      <div className="gradient-background flex h-dvh w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <LiffContext.Provider
      value={{
        liffProfile,
        isLoggedIn,
        isLoading,
        lineAccessToken,
        liff: liffReady ? liff : null,
        actions,
        liffDecodedIdToken,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
}

export const useLiff = () => useContext(LiffContext);
