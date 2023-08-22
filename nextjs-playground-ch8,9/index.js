// 필요한 패키지
const { parse } = require('url');
const express = require('express');
const next = require('next');

// Next.js 애플리케이션을 시작하기 위해 다음 코드 추가
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

// 서버 사이드 렌더링을 위해 들어오는 모든 GET 요청을 받아 Next.js에 넘겨
async function main() {
  try {
    await app.prepare(); // 렌더링을 위한 Next.js 앱이 실행할 준비가 될 때까지 기다림

    const handle = app.getRequestHandler(); // handle 초기화
    const server = express();

    // server
    //   .get('*', (req, res) => {
    //     const url = parse(req.url, true);
    //     handle(req, res, url);
    //   })
    //   .listen(5000, () => console.log('Listening on port 5000'));

    // 이 서버는 Next.js의 페이지로 연결하지 않고 홈페이지와 가짜 API인 /api/greet를 제공
    server
      .get('/', (req, res) => {
        res.send('Hello World');
      })
      .get('/about', (req, res) => {
        const { query } = parse(req.url, true);
        app.render(req, res, '/about', query); // Next.js 페이지 렌더링 하기 위해 app.render 함수 사용
        // 이 함수는 Express.js의 request와 response, 렌더링할 페이지, 분석한 쿼리 문자열을 인자로 받음
      })
      .get('/api/greet', (req, res) => {
        res.json({ name: req.query?.name ?? 'unknown' });
      })
      .get(/_next\/.+/.dotAll, (req, res) => {
        const parsedUrl = parse(req.url, true); // _next/로 시작하는 정적 자원을 Next.js에서 처리해야 한다는 사실을 Express.js 서버가 모름
        handle(req, res, parsedUrl); // 이런 정적 자원의 대부분을 차지하는 자바스크립트 파일을 불러와야만 브라우저가 리액트를 불러오고, 하이드레이션을 처리하고, Next.js의 프론트엔드 기능을 실행할 수 있다.
      })
      .listen(5000, () => console.log('Listening on port 5000'));
  } catch (err) {
    console.log(err.stack);
  }
}

main();
