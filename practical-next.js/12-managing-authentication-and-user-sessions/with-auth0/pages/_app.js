import { UserProvider } from '@auth0/nextjs-auth0';

export default function App({ Component, pageProps }) {
  // 웹 애플리케이션에서 페이지 간 세션이 계속 유지되도록 컴포넌트를 Auth0의 UserProvider 콘텍스트로 감싼다.
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
