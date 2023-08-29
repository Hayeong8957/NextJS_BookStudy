import { parse } from 'cookie';
import { decode } from '../../lib/jwt';

// 서버 사이드 렌더링을 통해 getServerSideProps 함수에서 사용자 쿠키를 읽고 JWT를 검사한 다음
// 사용자가 인증 받은 경우에만 페이지 콘텐츠를 렌더링할 수도 있다.

// 커스텀 훅을 만들어 사용자가 로그인했는지를 판단할 것. -> 쿠키 내용을 분석하고 사용자 세션에 관한 최소한의 정보를 제공하는 API
export default (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).end();
  }

  const { my_auth } = parse(req.headers.cookie || '');

  if (!my_auth) {
    return res.json({ loggedIn: false });
  }

  return res.json({
    loggedIn: true,
    user: decode(my_auth),
  });
};


// http://localhost:3001/api/get-session
// 주소로 api를 호출하면 다음과 같은 응답을 볼 수 있다.
// {"loggedIn":true,"user":{"id":"f678f078-fcfe-43ca-9d20-e8c9a95209b6","name":"Hayeong Shin","email":"shy@sqkcloud.com","iat":1693302330}}
