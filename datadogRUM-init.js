import { datadogRum } from "@datadog/browser-rum";
import { reactPlugin } from "@datadog/browser-rum-react";

datadogRum.init({
  applicationId: "87f251d9-fd0c-4c7e-91f1-281dc2482084",
  clientToken: "pub4f7c0c92cead30c8b63720a1f9280c40",
  site: "us5.datadoghq.com",
  service: "<SERVICE-NAME>",
  env: "<ENV-NAME>",
  version: "<VERSION-NUMBER>",
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackResources: true,
  trackUserInteractions: true,
  trackLongTasks: true,
  plugins: [reactPlugin({ router: false })],
});
