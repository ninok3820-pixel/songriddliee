import { agentNative } from "@agent-native/core/vite";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const reactRouterPlugins = reactRouter as unknown as (options?: unknown) => any[];
const agentNativePlugins = agentNative as unknown as (
  options?: Parameters<typeof agentNative>[0],
) => any[];
export default defineConfig({
  optimizeDeps: {
    entries: [
        "./entry.client.tsx",
        "./root.tsx",
        "./components/layout/{Layout,Sidebar}.tsx",
        "./components/chat/ChatRouteContent.tsx",
        "./routes/home.chat.$threadId.tsx",
      ],
    },
  plugins: [
    ...reactRouterPlugins({ appDirectory: "." }),
    ...agentNativePlugins({
      ssrStubs: ["shiki"],
    }),
  ],
});
