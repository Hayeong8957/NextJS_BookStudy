> 💡 **CHAPTER 4**
>
> - 아토믹 디자인 원칙에 따른 컴포넌트 구성
> - 유틸리티 구성
> - 정적 자원 구성
> - 스타일 파일 구성
> - lib 파일 구성
> - 서버에서 REST API를 사용하는 방법
> - 클라이언트에서 REST API를 사용하는 방법
> - 클라이언트 및 서버에서 Apollo를 이용하여 GraphQL API를 사용하는 방법

# 4-1. 디렉터리 구조 구성

- Next.js에서는 특정 파일과 디렉터리가 지정된 위치에 있어야 한다.
  - \_app.js나 \_document.js파일, pages/와 public/ 디렉터리 등, 그 외의 디렉터리 및 파일들은 프로젝트 내에서 원하는 대로 구성

## 컴포넌트 구성

코드를 효율적으로 구성하기 위해 아토믹 디자인 원칙에 따라 각 컴포넌트를 서로 다른 수준의 디렉터리에 둔다. 여기서는 컴포넌트를 다음과 같이 네 가지 종류로 나눈다.

- **atoms**
  - 코드에서 사용되는 가장 기본적인 컴포넌트들
  - button, input, p와 같은 표준 HTML요소를 감싸는 용도로 사용, 애니메이션 또는 컬러 팔레트 등과 같은 용도로 사용되는 컴포넌트를 이곳에 저장
- **molecules**
  - atoms에 속한 컴포넌트 여러 개를 조합하여 좀 더 복잡한 구조, 유틸리티 기능들은 많이 사용되지 않음
  - ex) input과 label 컴포넌트를 가져와서 새로운 컴포넌트를 만들면 이 컴포넌트는 molecules에 속함
- **organisms**
  - molecules + atoms 섞어 더 복잡한 구조의 컴포넌트
  - 회원 가입 양식, 푸터, 캐러셀
- **templates**
  - 페이지 스켈레톤, 어디에 organisms, atoms, molecules를 배치할지 결정해서 사용자가 접근할 수 있는 페이지를 생성

## 유틸리티 구성

- 컴포넌트를 만들지 않은 코드 파일 → 유틸리티 스크립트
- ex) 현재 시각 계산, localStorage에 특정 작업 처리, JWT를 처리, 애플리케이션의 로그 기록

## 정적 자원 구성

- 제공할 파일 public/ 아래에 둠
  - assets/ : 이미지
  - assets/js : 컴파일한 자바스크립트 파일
  - assets/css : 컴파일한 CSS파일
  - assets/icons/ : 아이콘(favicon), manifest.json, robot.txt등 정적 파일
    - manifest.json : 앱의 이름이나 모바일 기기에 앱을 설치할 때 표시할 아이콘과 같이 프로그레시브 웹 앱에 관한 유용한 정보를 가지고 있음 **→ PWA할 때 사용됨**
    ```jsx
    {
      "name": "My Next.js App",
      "short_name": "Next.js App",
      "theme_color": "#2196f3",
      "background_color": "#2196f3",
      "display": "standalone",
    	"description": "Hello this is My Next.js App",
    	"icons": [
    		{
    			"src": "/assets/icons/zzz.png",
    			"type": "image/png",
    			"sizes": "192X192"
    		},
    	]
    }
    ```
    그 다음 HTML메타 태그를 사용해 매니페스트 정보를 불러오면 사용자가 모바일 기기에서 Next.js 앱을 검색 및 설치 가능
    ```jsx
    <link rel="manifest" href="/manifest.json">
    ```
    [next js에 pwa 적용하기](https://jcon.tistory.com/171)

## 스타일 파일 구성

- styles/ 디렉터리 안에 공통 스타일 파일 저장하고 필요할 때마다 원하는 스타일 파일을 불러와서 사용

## lib 파일 구성

- 서드파티 라이브러리를 감싸는 스킄립트를 지칭, 특정 라이브러리에 특화된 것
- GraphQL 예시
  - GraphQL클라이언트를 초기화하고 몇몇 GraphQL 질의문과 뮤테이션을 저장하는 등의 작업이 필요.
  - 이런 스크립트들을 좀 더 모듈화하기 위해 프로젝트의 최상위 디렉터리에 있는 lib/ 디렉터리 안에 graphql/ 디렉터리를 만듦
  ```
  next-js-app
    - lib/
      - graphql/
        - index.js
        - queries/
          - query1.js
          - query2.js
        - mutations/
          - mutation1.js
          - mutation2.js
  ```
  이와 비슷하게 Redis같은 DB 또는 래빗MQ등의 메시지 큐에 접속하고 질의를 보낼 수 있는 스크립트를 lib 파일로 만들거나 외부 라이브러리 전용 함수들을 lib 파일로 만들수도 있다.

> 애플리케이션 상태 관점에서 애플리케이션의 컴포넌트는 대부분 동적임

# 4-2. 데이터 불러오기

- Next.js가 데이터베이스에 직접 접근해서 데이터를 가져오는 것은 좋지 않다. → 안전하지 않기 떄문 → 악의적인 사용자가 프레임워크의 알려지지 않은 보안 취약점을 이용해서 데이터에 마음대로 접근하거나 악성 코드를 실행할 수 있다.
- 데이터베이스에 대한 접근 및 질의는 백엔드 프레임워크에서 처리하는 것이 좋음 → 사용자가 입력한 데이터나 값에서 잠재적인 악성코드나 위협을 미리 탐지, 제거 & API간 안전한 연결 제공

## 서버가 데이터 불러오기

Next.js에서는 서버가 내장 getStaticProps와 getServerSideProps 함수를 사용해서 데이터를 불러올 수 있다.

Node.js는 웹 브라우저와 달리 자바스크립트 fetch API를 제공하지 않기 때문에 서버에서는 두 가지 방법으로 HTTP요청을 만들고 처리할 수 있다.

> 1. Node.js의 내장 HTTP 라이브러리를 사용 가능 > 별도의 의존성 라이브러리를 설치할 필요 없이 바로 불러와서 쓸 수 있음
>
> 2. HTTP 클라이언트 라이브러리 사용 가능 > Axios

## 서버에서 REST API 사용하기

- 퍼블릭 API를 호출할 것인지 vs 프라이빗 API를 호출할 것인지를 먼저 알아야 함.
  - 퍼블릭 API는 어떤 인증이나 권한도 필요 없으며 누구나 호출할 수 있음
  - 프라이빗 API는 호출 전 반드시 인증과 권한 검사 과정을 거쳐야 함 → 인증 방식이 항상 다를 수 있음
    - 구글 API 사용시 → OAuth 2.0
    - Pexels API → API키를 사용해서 API호출 → 인증 토큰의 일종, API를 호출할 때마다 키값을 같이 보내야 한다.

### 내장 getServerSideProps 함수를 사용해서 서버가 데이터를 불러오는 방법 예시

- getStaticProps 함수를 사용할 수도 있지만 이 경우에는 Next.js가 빌드 시점에 정적으로 페이지를 렌더링한다는 사실을 기억해야함

> 퍼블릭 API를 호출하여 몇몇 사용자의 이름과 ID를 표시 → 사용자 이름 클릭시 세부 페이지로 이동해서 사용자 정보를 자세히 볼 수 있도록하는 코드 예시

```jsx
// pages/index.js
import { useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export async function getServerSideProps() {
  // 여기에서 REST API를 호출
  const usersReq = await axios.get('https://jsonplaceholder.typicode.com/users');
  return {
    props: {
      users: usersReq.data,
  }
}

function HomePage({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.id}`} passHref>
            <a>{user.name}/</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default HomePage;
```

→ `내장 getServerSideProps함수`를 사용해 REST API를 호출하고 결과 데이터를 HomePage컴포넌트로 전달해야함

> 여기까지는 페이지를 만들지 않았기에 사용자 이름을 클릭히 404페이지가 표시됨 → 사용자 세부 정보를 표시할 수 있는 pages/users/[username].js파일을 만들기 → 해당 파일에서 다른 REST API를 호출해서 지정한 사용자 데이터를 불러오도록 만듦

```jsx
// pages/users/[username].js

import Link from 'next/link';
import axios from 'axios';

**export async function getServerSideProps(ctx) {
  // 여기에서 REST API를 호출
  const {username} = ctx.query;
  const usersReq = await axios.get(`https://jsonplaceholder.typicode.com/users/${username}`);

  return {
    props: {
      user: usersReq.data,
  };
}**

function UserPage({ user }) {
  return (
    <div>
      <div>
        <Link href="/" passHref>
          Back to Home
        </Link>
      </div>
      <hr />
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        {user.username}
        {user.last_name}
        {user.email}
        {user.company}
        {/* ... */}
      </div>
    </div>
  );
}

export default UserPage;
```

> 이렇게까지 해도 API 호출 서버에서 인증되지 않았다는 오류를 받게 됨 → 이 경우 HTTP 헤더로 올바른 인증 토큰을 함께 정송해서 API를 호출해야함 → 서버는 이 토큰을 검사하여 인증 받았는지 확인

```jsx
export async function getServerSideProps(ctx) {
  // 여기에서 REST API를 호출
  const { username } = ctx.query;
  const usersReq = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${username}`,
    **{
      headers: {
        authorization: process.env.API_TOKEN,
      },
    },**
  );

  return {
    props: {
      users: usersReq.data,
    },
  };
}
```

→ Axios를 사용하면 HTTP 요청 시 쉽게 헤더 추가 가능

> http://localhost:3000/users/mitch와 같은 페이지에 접근하면 에러 발생 → ‘mitch’라는 이름을 가진 사용자가 없어서 REST API가 404 코드를 반환
> ⇒ **이런 에러 발생 시 Next.js가 기본 404 처리 페이지를 표시할 수 있도록** 다음과 같이 코드 추가

```jsx
export async function getServerSideProps(ctx) {
  // 여기에서 REST API를 호출
  const { username } = ctx.query;
  const usersReq = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${username}`,
    **{
      headers: {
        authorization: process.env.API_TOKEN,
      },
    },**
  );

	if (userReq.statue === 404) {
		return {
			notFound: true
		};
	}

  return {
    props: {
      users: usersReq.data,
    },
  };
}
```

## 클라이언트가 데이터 불러오기

클라이언트에서 HTTP 요청 작업을 처리하면 중요한 정보가 외부에 노출될 수 있으며, 악의적인 사용자가 이 정보를 가로채 데이터를 훔치거나 조작할 위험성 있다.

브라우저에서 HTTP 요청 보낼 때는 반드시 다음 사항을 지키자.

> 1.  믿을 수 있는 곳에만 요청, 누가 API개발하고 제공하는지, 적용된 보안 규칙이나 표준이 무엇인지를 꼭 확인
>
> 2.  SSL 인증서를 통해 안정하게 접근할 수 있는 곳의 HTTP API만 사용해야 함. 원격 API 제공 측이 HTTPS를 사용하지 않는다면 중간자 공격과 같은 보안 공격에 노출 가능
>
> 3.  브라우저에서 원격 DB에 직접 연결해서는 안됨. 악의적 사용자 원격 DB에 접근 위험성 증가

## 클라이언트에서 REST API 사용하기

Next.js에서는 내장 getServerSideProps나 getStaticProps함수 내에서 REST API를 호출하면 서버가 데이터를 가져오지만 그 외의 컴포넌트 내에서 데이터를 불러오는 작업은 클라이언트가 실행한다.

클라이언트는 주로 두 가지 시점에 데이터를 불러온다.

- 컴포넌트가 마운트 된 후
- 특정 이벤트가 발생한 후

> React에서 데이터 불러오는 것처럼 요청 보내면 됨

```jsx
// pages/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';

function List({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.username}`} passHref>
            {user.username}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Users() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const req = await fetch(`/api/04/users`);
      const users = await req.json();
      setLoading(false);
      setData(users);
    }
    fetchData();
  }, []);

  return (
    <>
      {loading && <div>Loading...</div>}
      {data && <List users={data} />}
    </>
  );
}

export default Users;
```

→ 서버에서 생성한 HTML 파일이 ‘Loading…’문자열만 가지고 있다. ⇒ HomePage 컴포넌트의 초기 상태

→ 리액트 하이드레이션이 일어난 후에야 사용자 목록을 볼 수 있다. ⇒ 클라이언트가 컴포넌트를 마운트할 때까지 기다리고 그 후에 브라우저의 fetch API를 사용해서 HTTP 요청을 보낸다.

> 사용자 정보 페이지 만들기

1. pages/users/[username].js파일을 생성하고 getServerSideProps 함수를 만든다. → 이 함수에서는 경로 매개변수 [username]과 .env파일의 인증 토큰값을 가져온다.

2. 그리고 같은 페이지 파일에 UserPage 컴포넌트를 만든다. 이 컴포넌트는 클라이언트에서 데이터를 불러옴 → UserPage는 setData 훅 변수에 값을 할당하면 UserData를 렌더링

3. 마지막으로 같은 페이지 파일에 UserData컴포넌트를 만든다.

```jsx
// pages/users/[username].js
import { useEffect, useState } from 'react';
import Link from 'next/link';

export async function getServerSideProps({ query }) {
  const {username} = query;
  return{
    props: {
      username,
      authorization: process.env.API_TOKEN,
    },
  };
}

function UserPage({ username, authorization }) {
  const[loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const req = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          authorization
        },
      });
      const reqData = await req.json();

      setLoading(false);
      setData(reqData);
    }
    fetchData();

  }, []);

  return(
    <div>
      <div>
        <Link href="/" passHref>Back to home</Link>
      </div>
      {loading ? <p>Loading...</p>}
      {data && <UserData user={data}/>}
    </div>
  )
}

export default UserPage;

function UserData({ user }) {
  return(
    <div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        {user.username}
        {user.last_name}
        {user.email}
        {user.company}
        {/* ... */}
      </div>
    </div>
  )
}
```

→ 컴포넌트가 마운트된 직후 클라이언트에서 HTTP요청을 보낸다. 또한 getServerSideProps를 통해 API_TOKEN값을 서버에서 받아와서 인증이 필요한 요청에 사용한다.

> 💡 **클라이언트에서 REST API 사용할 때 문제점 2가지**
>
> 1.  CORS(교차 출처 리소스 공유)
> 2.  클라이언트에 인증 토큰을 노출 → Network탭에 특정 엔드포인트로 보낸 HTTP 요청을 볼 수 있음 → >평문 인증 토큰값 확인 가능

## Next.js의 API 페이지를 사용해서 해결

API페이지로 REST API를 만들고 서버가 HTTP 요청을 보내서 그 결과만 클라이언트로 전송한다.

```jsx
// pages/api/singleUser.js
import axios from 'axios';

export default async function handler(req, res) {
  const username = req.query.username;
  const API_ENDPOINT = process.env.API_ENDPOINT;
  const API_TOKEN = process.env.API_TOKEN;

  const userReq = await axios.get(`${API_ENDPOINT}/api/04/users/${username}`, {
    headers: { authorization: API_TOKEN },
  });

  res.status(200).json(userReq.data);
}
```

- req : Node.js의 인스턴스, req.cookies, req.query, req.body와 같이 미리 만들어진 미들웨어가 포함
- res: Node.js의 http.serverResponse 인스턴스, 상태코드를 나타내는 res.status(code), JSON응답을 위한 res.json(json), 그리고 string, object, Buffer등과 같은 형태의 HTTP 응답을 보내기 위한 res.send(body) 등 미들웨어 포함

pages/api/ 디렉터리 안의 모든 파일은 Next.js가 API 라우트로 처리함. 해당 엔드포인트를 사용하면 됨

```jsx
function UserPage({ username }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(async() => {
    const req = await fetch(`/api/singleUser?username=${username}`,);
		const data = await req.json();

		setLoading(false);
    setData(reqData);
  }, []);

  return(
    <div>
      <div>
        <Link href="/" passHref>Back to home</Link>
      </div>
      {loading ? <p>Loading...</p>}
      {data && <UserData user={data}/>}
    </div>
  )
}
```

사용자 정보를 가져오는 API를 일종의 프록시 형태로 만들어 API 토큰을 숨겼지만 여전히 /api/singleUser경로로 접근하여 사용자 개인 정보를 쉽게 얻을 수 있다.

> 💡 **다음과 같이 해결할 수 있다.**
>
> - 컴포넌트 목록을 오직 서버에서만 렌더링하도록 → 서버에서 렌더링할 수 없는 경우에는 이 방법은 못 씀
> - JWT, API 키 등과 같은 인증 기법을 사용하여 인증되고 권한이 있는 사용자만 특정 API를 사용할 수 있도록 만듦
> - 백엔드 프레임워크를 사용

# 4-3. GraphQL API 사용하기

- GraphQL : API에서 사용할 수 있는 질의 언어, REST나 SOAP같은 방식과는 다른 새로운 관점으로 API데이터를 다룬다.
- GraphQL을 사용하면 꼭 필요한 데이터만 불러오도록 지정할 수 있으며 한 번의 요청으로 여러 곳의 데이터를 불러올 수 있다.
- 사용할 데이터에 대해 정적이면서 강력한 타입 시스템을 제공

> Apollo클라이언트를 사용 → 널리 사용되는 GraphQL 클라이언트로 리액트와 Next.js를 기본으로 지원

```bash
npm install @apollo/client graphql isomorphic-unfetch
```

- isomorphic-unfetch : ApolloClient가 브라우저의 fetch API를 사용해서 HTTP 요청을 처리하므로 서버에서도 같은 기능을 사용할 수 있는 폴리필

> lib/apollo/index.js파일에 Apollo 클라이언트를 만든다.

```jsx
import { useMemo } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

let uri = '/api/graphql';
let apolloClient;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // 같은 Apollo 인스턴스를 서버와 클라이언트에서 구분하여 사용할 수 있도록 함
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
  });
}
```

> lib/apollo/index.js파일에 Apollo 클라이언트를 초기화하기 위한 함수 추가

```jsx
export function initApollo(initialState = null) {
  const client = apolloClient || createApolloClient();

  if (initialState) {
    client.cache.restore({
      ...client.extract(),
      ...initialState,
    });
  }

  if (typeof window === 'undefined') {
    return client;
  }

  if (!apolloClient) {
    apolloClient = client;
  }

  return client;
}
```

→ 이 함수를 사용하면 페이지마다 새로운 Apollo 클라이언트를 만들지 않아도 됨 → 대신 만든 클라이언트 인스턴스를 apolloClient변수에 저장하며 이 인스턴스를 함수 인자에 초기 상태값으로 전달한다.

→ 다른 페이지로 이동하면 이 초기 상태값을 initApollo 함수로 전달하고, 해당 함수는 지역 캐시값과 전달받은 초기 상태값을 합쳐서 전체 상태값을 만든 다음 사용한다.

→ 복잡한 초기 상태를 가지고 매번 Apollo 클라이언트를 초기화하는 것은 성능상 큰 부담 → 리액트의 useMemo 훅을 사용

> useMemo 사용 부분

```jsx
export function useApollo(initialState) {
  return useMemo(() => initApollo(initialState), [initialState]);
}
```

> \_app.js에서 Apollo 컨텍스트 제공자

```jsx
import { useApollo } from '@/lib/apollo';
import { ApolloProvider } from '@apollo/client';

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
```

> lib/apollo/queries/getLatestSigns ~> GraphQL에서 사용할 질의문

```jsx
import { gql } from '@apollo/client';

const GET_LATEST_SIGNS = gql`
  query GetLatestSigns($limit: Int! = 10, $skip: Int! = 0) {
    sign(offset: $skip, limit: $limit, order_by: { created_at: desc }) {
      uuid
      created_at
      content
      nickname
      country
    }
  }
`;

export default GET_LATEST_SIGNS;
```

> pages/index.js에서 질의문 불러와 사용

```jsx
import { useQuery } from '@apollo/client';
import GET_LATEST_SIGNS from '@/lib/apollo/queries/getLatestSigns';

function HomePage() {
  const { loading, data } = useQuery(GET_LATEST_SIGNS, {
    fetchPolicy: 'no-cache',
  });

  return <div></div>;
}

export default HomePage;
```

- loading: 질의 처리 요청이 끝났는지 아니면 처리 중인지에 따라 true | false
- error: 요청이 어떤 이유로든 실패하면 이를 받아서 처리 or 사용자에게 관련 메세지 출력
- data: 요청한 질의의 결과 데이터

> 화면 만들기 - tailwind 적용

- 차례대로 설치, tailwind config파일 생성

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- 생성된 tailwind config파일에 tailwind를 적용시킬 파일들의 path를 정함

```jsx
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- 프로젝트에 기본적으로 Tailwind CSS를 쓸 수 있게 globals.css파일에 @tailwind를 추가

```jsx
// ./styles/global.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

<img width="1054" alt="image" src="https://github.com/Hayeong8957/NextJS_BookStudy/assets/70371342/15abcb83-4215-4eba-89ff-11b53f4bf5c6">
<img width="996" alt="image" src="https://github.com/Hayeong8957/NextJS_BookStudy/assets/70371342/e0ccbbad-517e-4f51-abae-cbac0cd1dd0d">

> 나머지는 화면 그리는 코드들임 전체 코드는 [nextjs-playground-ch4](https://github.com/Hayeong8957/NextJS_BookStudy/tree/main/nextjs-playground-ch4)
