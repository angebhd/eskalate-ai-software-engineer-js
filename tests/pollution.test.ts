import { HttpClient } from "../src/httpClient";
import { OAuth2Token } from "../src/tokens";
import { describe, test, expect } from "vitest";

describe("HttpClient header pollution", () => {
  test("header pollution: headers from one request should not affect another", () => {
    const c = new HttpClient();
    c.oauth2Token = new OAuth2Token("token", Math.floor(Date.now() / 1000) + 3600);
    const myHeaders: Record<string, string> = {};

    // Request with api=true
    const resp1 = c.request("GET", "/api", { api: true, headers: myHeaders });
    expect(resp1.headers.Authorization).toBe("Bearer token");
    expect(myHeaders.Authorization).toBeUndefined(); // Verify no pollution

    // Request with api=false using SAME headers object
    const resp2 = c.request("GET", "/public", { api: false, headers: myHeaders });
    expect(resp2.headers.Authorization).toBeUndefined();
  });
});
