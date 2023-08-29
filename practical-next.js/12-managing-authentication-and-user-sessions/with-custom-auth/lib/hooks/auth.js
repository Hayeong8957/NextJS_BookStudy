import { useState, useEffect } from 'react';

// 리액트 useEffect 훅이 시작되면 /api/get-session API로 HTTP 요청을 보낸다. 
// 이제 보호해야할 페이지에서 이 커스턴 훅을 사용해 사용자가 인증 받은 상태에서만 콘텐츠를 표시하도록 만든다. 

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/get-session')
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setLoggedIn(true);
          setUser(data.user);
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return {
    user,
    loggedIn,
    loading,
    error,
  };
}
