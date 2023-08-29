import { serialize } from 'cookie'; // 쿠키에 JWT를 저장할 때 사용할 패키지를 추가
import { encode } from '../../lib/jwt';

// 사용자 정보를 확인하는 코드 추가
function authenticateUser(email, password) {
  const validEmail = 'shy@sqkcloud.com';
  const validPassword = 'strongpassword';

  // 사용자 페이로드를 인코딩하고 JWT에 넣도록 코드를 추가
  if (email === validEmail && password === validPassword) {
    return encode({
      id: 'f678f078-fcfe-43ca-9d20-e8c9a95209b6',
      name: 'Hayeong Shin',
      email: 'shy@sqkcloud.com',
    });
  }

  return null;
}

// 사용자 입력을 받고 인증을 처리한다.
// 먼저 요청 메서드가 POST인 경우에만 사용자 입력을 받도록 한다.
export default (req, res) => {
  const { method } = req;
  const { email, password } = req.body;

  if (method !== 'POST') {
    return res.status(404).end(); // 이메일 또는 비밀번호가 요청 바디에 없는 경우 400 상태 코드로 요청을 잘못 보냈다는 사실을 알려줌
  }

  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing required params',
    });
  }

  const user = authenticateUser(email, password);

  // my_auth라는 쿠리를 만들고 그 안에 사용자 JWT를 저장함. JWT를 클라이언트 측에 직접 제공하지 않기 떄문에 클라이언트 측에서 발생할 수 있는 보안 위험 차단
  if (user) {
    res.setHeader(
      'Set-Cookie',
      serialize('my_auth', user, { path: '/', httpOnly: true }), // 쿠키를 사용할 땐 httpOnly를 true로 설정해서 서버 측에서만 쿠키를 사용할 수 있도록 해야함
    );
    return res.json({ success: true });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Wrong email of password',
    });
  }
};
