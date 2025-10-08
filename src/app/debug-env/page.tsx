"use client";

import { useEffect, useState } from "react";

export default function EnvDebugPage() {
  const [envInfo, setEnvInfo] = useState<any>(null);

  useEffect(() => {
    const raw = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY;
    setEnvInfo({
      raw,
      type: typeof raw,
      isString: typeof raw === "string",
      value: raw ? String(raw) : "undefined",
      length: raw ? String(raw).length : 0,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Environment Variable Debug</h1>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">NEXT_PUBLIC_TURNSTILE_SITEKEY:</h2>
            <pre className="mt-2 rounded bg-gray-100 p-4 text-sm">{JSON.stringify(envInfo, null, 2)}</pre>
          </div>
          <div>
            <h2 className="font-semibold">All NEXT_PUBLIC_ vars:</h2>
            <pre className="mt-2 rounded bg-gray-100 p-4 text-sm">
              {JSON.stringify(
                Object.keys(process.env).filter((k) => k.startsWith("NEXT_PUBLIC_")),
                null,
                2,
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
