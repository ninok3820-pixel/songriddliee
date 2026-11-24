// app/routes/agent-native.auth.session.tsx
import { json } from "@react-router/dev/runtime";

export async function loader() {
  return json({ message: "Agent Native Auth Session" });
}

export default function AgentNativeAuthSession() {
  return (
    <div>
      <h1>Agent Native Auth Session</h1>
      <p>Это страница для обработки сессии аутентификации.</p>
    </div>
  );
}
