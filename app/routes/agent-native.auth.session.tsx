// app/routes/agent-native.auth.session.tsx
import { json } from '@react-router/dev/runtime';

export async function loader({ request }: { request: Request }) {
  // Получаем куки из запроса
  const cookie = request.headers.get('cookie') || '';
  // Ищем токен (например, 'session_token')
  const token = cookie.split('; ').find(row => row.startsWith('session_token='))?.split('=')[1];

  if (!token) {
    // Токена нет — возвращаем ошибку
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Токен есть — возвращаем успех
  return json({ message: 'Session is valid' });
}

export default function AgentNativeAuthSession() {
  return (
    <div>
      <h1>Agent Native Auth Session</h1>
      <p>Это страница для обработки сеанса аутентификации.</p>
    </div>
  );
}
