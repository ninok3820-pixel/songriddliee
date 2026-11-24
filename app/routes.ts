import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/__index.tsx"),
  route("support", "routes/support.tsx"),
  route("agent-native.auth.session*", "routes/agent-native.auth.session.tsx"),
] satisfies RouteConfig;
