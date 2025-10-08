// Script to check environment variables
console.log("Environment Variables Check:");
console.log("============================");
console.log("NEXT_PUBLIC_TURNSTILE_SITEKEY:", process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY);
console.log("Type:", typeof process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY);
console.log("Length:", process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY?.length);
console.log("TURNSTILE_SECRET:", process.env.TURNSTILE_SECRET ? "✓ Set" : "✗ Not set");
console.log("============================");
