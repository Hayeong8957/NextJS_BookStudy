import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/hooks/auth';
import styles from '../styles/app.module.css';

// 로그인 API로 요청 보내는 함수
async function handleLogin(email, password) {
  const resp = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await resp.json();

  if (data.success) {
    return;
  }

  throw new Error('Wrong email or password');
}

export default function Home() {
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);
  const { loading, loggedIn } = useAuth(); // useAuth 훅을 불러옴
  // 훅을 사용해서 로딩 단계가 끝날 때까지 기다리고 로딩이 끝나면 사용자가 로그인한 상태인지 알 수 있다.
  // 사용자가 로그인했다면 Next.js 의 useRouter 훅을 사용해서 사용자를 보호된 페이지로 이동시킴

  // 폼의 submit 이벤트를 받고 원격 API로 요청을 보내는 브라우저의 기본 submit 관련 작동을 차단한 다음
  // 로그인 성공 또는 실패를 처리
  // 로그인 성공 -> 사용자를 보호된 페이지로 보냄
  // 로그인 실패 -> loginError 상태를 지정
  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;

    setLoginError(null);
    handleLogin(email.value, password.value)
      .then(() => router.push('/protected-route'))
      .catch((err) => setLoginError(err.message));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loading && loggedIn) {
    router.push('/protected-route');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' />

        <label htmlFor='password'>Password</label>
        <input type='password' id='password' />

        <button type='submit'>Login</button>

        {loginError && <div className={styles.formError}> {loginError} </div>}
      </form>
    </div>
  );
}
