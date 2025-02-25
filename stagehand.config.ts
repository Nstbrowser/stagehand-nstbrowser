import type { ConstructorParams, LogLine } from "@/dist";
import dotenv from "dotenv";
import { logLineToString } from "@/lib/utils";
dotenv.config();

const StagehandConfig: ConstructorParams = {
  env:
    process.env.NSTBROWSER_API_KEY && process.env.BROWSERBASE_PROJECT_ID
      ? "BROWSERBASE"
      : "LOCAL",
  apiKey: process.env.NSTBROWSER_API_KEY /* API key for authentication */,
  projectId: process.env.BROWSERBASE_PROJECT_ID /* Project identifier */,
  debugDom: true /* Enable DOM debugging features */,
  headless: false /* Run browser in headless mode */,
  logger: (message: LogLine) =>
    console.log(logLineToString(message)) /* Custom logging function */,
  domSettleTimeoutMs: 30_000 /* Timeout for DOM to settle in milliseconds */,
  browserbaseSessionCreateParams: {
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
  },
  enableCaching: true /* Enable caching functionality */,
  browserbaseSessionID:
    undefined /* Session ID for resuming Browserbase sessions */,
  modelName: "gpt-4o" /* Name of the model to use */,
  nstbrowserParams: {},
  profileId: process.env.NSTBROWSER_PROFILE_ID,
  modelClientOptions: {
    apiKey: process.env.OPENAI_API_KEY,
  } /* Configuration options for the model client */,
};
export default StagehandConfig;
