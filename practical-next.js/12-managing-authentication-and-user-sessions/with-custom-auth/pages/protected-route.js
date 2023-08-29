// 클라이언트 측에서 로그인하고 인증된 경우에만 볼 수 있는 페이지를 만들어서 인증 부분 관리할 수 있도록 만듦

import { useRouter } from 'next/router';
import { useAuth } from '../lib/hooks/auth';
import styles from '../styles/app.module.css';

// 로그인하지 않은 익명의 사용자가 접근하지 못하도록
export default function ProtectedRoute() {
  const router = useRouter();
  const { loading, error, loggedIn } = useAuth();

  if (!loading && !loggedIn) {
    router.push('/login');
  }

  return (
    <div className={styles.container}>
      {loading && <p>Loading...</p>}
      {error && <p> An error occurred. </p>}
      {loggedIn && (
        <>
          <h1>Protected Route</h1>
          <p>You can't see me if not logged-in!</p>
          <p>로그인 성공했다는 뜻임</p>
        </>
      )}
    </div>
  );
}
