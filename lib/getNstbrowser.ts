import { chromium } from "@playwright/test";
import { BrowserResult } from "../types/browser";
import { LogLine } from "../types/log";
import { NstbrowserParams } from "../types/stagehand";

export async function getNstBrowser(
  apiKey: string | undefined,
  env: "LOCAL" | "BROWSERBASE" = "LOCAL",
  logger: (message: LogLine) => void,
  nstbrowserParams?: NstbrowserParams,
  profileId?: string,
): Promise<BrowserResult> {
  if (!apiKey) {
    throw new Error("NSTBROWSER_API_KEY is required.");
  }

  let debugUrl: string | undefined = undefined;
  let sessionUrl: string | undefined = undefined;
  const config = {
    ...nstbrowserParams,
  };
  const query = new URLSearchParams({
    "x-api-key": apiKey, // required
    config: encodeURIComponent(JSON.stringify(config)),
  });
  const browserWSEndpoint = `ws://localhost:8848/devtool/launch/${profileId}?${query.toString()}`;

  logger({
    category: "init",
    message: "connecting to browserless",
    level: 0,
    auxiliary: {
      debugUrl: {
        value: browserWSEndpoint,
        type: "string",
      },
    },
  });

  try {
    const browser = await chromium.connectOverCDP(browserWSEndpoint, {
      timeout: 60000,
    });

    debugUrl = browserWSEndpoint;
    sessionUrl = "";

    logger({
      category: "init",
      message: "browserless session started",
      level: 0,
      auxiliary: {
        debugUrl: {
          value: browserWSEndpoint,
          type: "string",
        },
      },
    });

    const context = browser.contexts()[0];

    return {
      browser,
      context,
      debugUrl,
      env,
      sessionUrl,
      sessionId: profileId,
    };
  } catch {
    throw "Failed to connect to browserless";
  }
}

export async function connectToBrowserless(
  apiKey: string,
  query: URLSearchParams,
) {
  const url = `https://less.nstbrowser.io/connect?${query.toString()}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}
