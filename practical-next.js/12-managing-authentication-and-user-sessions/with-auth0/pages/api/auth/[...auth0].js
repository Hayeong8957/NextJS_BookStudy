import { handleAuth } from '@auth0/nextjs-auth0';

export default handleAuth();

/**
 * Next.js 서버를 시작하면 handleAuth() 메서드가 다음 API를 제공
 * 
 * /api/auth/login : 애플리케이션에 로그인할 수 있는 API
 * /api/auth/callback : Auth0를 통해 성공적으로 로그인한 경우 사용자를 다시 되돌려 보내는 콜백 URL
 * /api/auth/logout : 애플리케이션에서 로그아웃할 수 있는 API
 * /api/auth/me : 사용자가 로그인한 후 사용자 정보를 JSON 형태로 가져올 수 있는 엔드포인트
 */