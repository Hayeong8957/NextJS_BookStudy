> 💡 **CHAPTER 2**
>
> - 세 가지 렌더링 전략의 장단점, 사용하는 경우, 사용자 경험, 서버 부하 영향
> - 서버 사이드 렌더링을 사용해서 각 요청별로 페이지를 동적으로 렌더링하는 방법
> - 특정 컴포넌트를 클라이언트에서만 렌더링하는 다양한 방법
> - 빌드 시점에 정적 페이지를 생성하는 방법
> - 증분 정적 재생성으로 정적 페이지를 재생성하는 방법
> - Next.js에서 하이브리드 렌더링 방식을 제공하는 이유

> **렌더링 전략;** 웹 페이지 또는 웹 애플리케이션을 웹 브라우저에 제공하는 방법
> Next.js에서는 이 모든 방법을 완전히 새로운 수준으로 제공, 어떤 페이지를 빌드 시점에 정적으로 생성하고 어떤 페이지를 실행 시점에 동적으로 제공할 것인지 쉽게 정할 수 있음

# 2-1. 서버 사이드 렌더링(SSR)

PHP, 루비, 파이썬과 같은 언어의 경우에는 HTML 페이지를 웹 브라우저로 전송하기 전에 서버에서 전부 렌더링한다. 그리고 해당 페이지의 모든 자바스크립트 코드가 적재되면 동적으로 페이지 내용을 렌더링한다.

Next.js도 각 요청에 따라 서버에서 HTML 페이지를 동적으로 렌더링하고 웹 브라우저로 전송할 수 있다.

- **하이드레이션(Hydration)**
  - 서버에서 렌더링한 페이지에 스크립트 코드를 집어넣어서 나중에 웹페이지를 동적으로 처리한 것
  - 리액트 라이드레이션 덕분에 웹 앱은 싱글 페이지 애플리케이션처럼 작동할 수 있다.
  - 클라이언트 사이드 렌더링과 SSR의 장점을 모두 가진다.

> 사용자가 페이지에 접근 → 서버는 페이지를 렌더링해서 결과로 생성한 HTML 페이지를 클라ㅣ언트로 전송 → 브라우저는 페이지에서 요청한 모든 스크립트를 다운로드 → DOM 위에 각 스크립트 코드를 하이드레이션함 → 페이지를 새로 고치지 않고도 아무 문제 없이 사용자와 웹페이지가 상호 작용할 수 있게 만듦

## SSR의 장점

- **더 안전한 웹 애플리케이션**

페이지를 서버에서 렌더링한다 → 쿠키 관리, 주요 API, 데이터 검증 등과 같은 작업을 서버에서 처리한다는 뜻 → 중요한 데이터를 클라이언트에 노출할 필요가 없기 때문에 더 안전

- **더 뛰어난 웹 사이트 호환성**

클라이언트 환경이 js를 사용하지 못하거나 오래된 브라우저를 사용하더라도 웹 페이지를 제공할 수 있음

- **더 뛰어난 SEO**

서버가 렌더링한 HTML 콘텐츠를 받기 때문에 봇이나 웹 크롤러 같은 검색 엔진 웹 문서 수집기가 페이지를 렌더링할 필요가 없다. → 웹 애플리케이션의 SEO점수가 높아짐

## SSR의 단점

- **더 많은 자원 소모, 더 많은 부하, 유지 보수**

클라이언트가 요청할 때마다 페이지를 다시 렌더링할 수 있는 서버 필요하기 때문

- ************************************\*\*************************************페이지 요청 처리 시간 늘어남************************************\*\*************************************

서버에서 렌더링한 페이지 간 이동은 클라이언트에서 렌더링한 페이지의 이동보다 느리지만 Next.js 에서는 네비게이션 성능을 향상시킬 수 있는 기능을 제공

> 항상 염두에 둘 점은 **Next.js가 기본적으로 빌드 시점에 정적으로 페이지를 만듦** → 페이지에서 외부 API를 호출하거나 DB에 접근하는 등 동적 작업을 해야 한다면 해당 함수를 페이지에서 익스포트.

## getServerSideProps 함수 사용

페이지에서 서버 REST API 를 호출하여 특정 사용자 정보를 가져온 다음 클라이언트에 전달해서 사용할 수 있도록 해야 하는 경우

```jsx
export async function getServerSideProps ( ) {
const userRequest = await fetch('https: //example.com/api/user');
const userData = await userRequest.json();

	return {
		props: {
			user: userData,
		},
	};
}

function IndexPage (props) {
	return <div›Welcome, {props.user.name}!</div>;
}

export default IndexPage;
```

1. getServerSideProps라는 비동기 함수를 익스포트 → **빌드 과정에서 Next.js는 이 함수를 익스포트하는 모든 페이지를 찾아서 서버가 페이지 요청을 처리할 때 getServerSideProps 함수를 호출**하도록 만듦 → **해당 함수 내의 코드는 항상 서버에서만 실행**
2. getServerSideProps 함수는 props라는 속성값을 갖는 객체를 반환 → Next.js는 이 props를 컴포넌트로 전달하여 서버와 클라이언트 모두가 props에 접근하고 사용할 수 있음
3. IndexPage 함수를 수정해서 props를 인자로 받음 → 이 props는 getServerSideProps함수에서 반환한 props의 모든 내용을 가지고 있음

> **브라우저 전용 API를 사용해야 하는 컴포넌트가 있다면 해당 컴포넌트를 반드시 브라우저에서 렌더링하도록 명시해야함**

# 2.2 클라이언트 사이트 렌더링(CSR)

CRA(create-react-app)을 사용해봤다면 초기 화면 body 태그 안에 있는 `<div id="root"></div>`만 있었을 것. 빌드 과정 동안 create-react-app은 컴파일한 자바스크립트와 CSS파일을 HTML 페이지에서 불러오도록 만들고 root div 요소에 전체 애플리케이션을 렌더링한다.

## CSR의 장점

- **네이티브 처럼 쉬운 페이지 전환**

전체 자바스크립트 번들을 다운로드한다는 것은 웹 애플리케이션이 렌더링할 모든 페이지가 이미 브라우저에 다운로드되어 있다는 뜻 → 페이지 새로 고침할 필요 없이 페이지 이동 가능 → 페이지 간 전환에 멋진 효과를 쉽게 넣을 수 있음

- **지연된 로딩과 성능**

CSR을 사용하면 웹 앱에서는 최소로 필요한 HTML 마크업만 렌더링, 사용자가 버튼을 클릭하면 보이는 모달의 경우 실제 HTML 페이지에서는 HTML 마크업이 존재하지 않음

- **서버 부하 감소**

전체 렌더링 과정이 브라우저에서 일어나기 때문에 서버가 할 일이라고는 간단한 HTML 페이지를 클라이언트에 전송하는 것 뿐

## CSR의 단점

- **초기 렌더링 시간 증가**

서버는 간단한 HTML페이지만 보내기 때문에 네트워크 속도가 느린 환경에서는 전체 자바스크립트 코드와 CSS 파일을 받는 것에만 수 초가 소요될 수 있다.

- **SEO에도 영향**

검색 엔진 봇들이 웹 앱의 페이지를 수집해도 그 내용은 빈 것으로 보임. 구글 봇의 경우 자바스크립트 번들이 전송될 때까지 기다리겠지만 이 대기시간으로 웹사이트의 성능 점수가 낮아짐

## React.useEffect 훅

Next.js에서는 window, document같은 브라우저 전용 API나 canvas같은 HTML 요소를 제공하지 않음. 이를 해결하기 위해선 useEffect를 리액트 하이드레이션 이후 브라우저에서 실행하도록 만들어야 함.

- Highlight.js 라이브러리가 document라는 전역 변수를 사용하는데, 이 변수는 Node.js 에서 제공하지 않고 오직 브라우저에서만 접근할 수 있다. 이는 hljs 호출을 useEffect훅으로 감싸서 해결할 수 있다.

```jsx
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';

/* ... */
useEffect(() => {
  hljs.registerLanguage('안녕', javascript);
  hljs.initHighlighting();
}, []);
/* ... */
```

이렇게 하면 Next.js는 컴포넌트가 반환하는 HTML 마크업을 렌더링하고 Highlight.js 스크립트를 페이지에 끼워넣는다.

그리고 해당 컴포넌트가 브라우저에 마운트 되면 라이브러리 함수를 클라이언트에서 호출하고 실행하도록 만든다.

useEffect와 useState(flag변수로)를 함께 써서 특정 컴포넌트를 정확히 클라이언트에서만 렌더링하도록 지정할 수도 있다.

## ~~process.browser 변수~~ type of window

서버에서 렌더링할 때 브라우저 전용 API로 인한 문제를 process.browser값에 따라서 스크립트와 컴포넌트를 조건별로 실행하여 해결할 수 있다. 이 변수는 불린값으로, 코드를 클라이언트에서 실행하면 true, 서버에서 실행하면 false 값을 가진다.

~~하지만 process.browser에 대한 vercel팀의 지원은 중단될 예정이다.~~

대신 좀 더 정확한 의미를 갖는 typeof window를 사용할 수 있다.

```jsx
export function IndexPage() {
	const side = type of window === 'undefined' ? 'server' : 'client';
	return <div>{side}</div>;
}
```

typeof window를 서버에서 실행하면 그 값은 문자열 ‘undefined’가 되며, 그렇지 않으면 클라이언트에서 실행하는 것

## 동적 컴포넌트 로딩

Next.js는 리액트가 제공하지 않은 기능을 내장 컴포넌트와 유틸리티 함수 형태로 제공

- **dynamic**

위에서 useEffect사용해서 브라우저에서 코드를 실행하는 경우에만 컴포넌트를 렌더링했는데, dynamic함수로 똑같이 할 수 있다.

```jsx
import dynamic from 'next/dynamic';

const Highlight = dynamic(() => import('../components/Highlight'), {
  ssr: false,
});

import styles from '../styles/Home.module.css';

function DynamicPage() {
  return (
    <div className={styles.main}>
      <Highlight code={`console.log('Hello')`} language='js' />
    </div>
  );
}
```

이 코드를 실행하면 Highlight 컴포넌트를 동적 임포트로 불러온다. 즉, ssr: false 옵션으로 클라이언트에서만 코드를 실행한다고 명시하는 것이다.

이렇게 동적 임포트를 사용하면 Next.js는 해당 컴포넌트를 서버에서 렌더링하지 않는다.

따라서 사용자는 리액트 하이드레이션이 끝날 때까지 기다려야 해당 컴포넌트를 사용할 수 있게 된다.

> 검색 엔진에 노출될 필요가 없는 페이지는 CSR을 사용하여 서버 부하를 줄이고 애플리케이션을 더 쉽게 확장하는 것이 좋은 선택이 될 수 있다.

# 2.3 정적 사이트 생성(SSG)

SSG는 일부 또는 전체 페이지를 빌드 시점에 미리 렌더링한다. **만약 해당 페이지에 대한 요청이 발생하게 되면, 이 페이지들을 재생성하는 것이 아니라 이미 생성이 된 페이지를 반환하는 형태로 동작하게 된다.**

따라서 웹 애플리케이션을 빌드할 때 내용이 거의 변하지 않는 페이지는 정적 페이지 형태로 만들어 제공하는 것이 좋다.

Next.js는 이런 페이지를 빌드 과정에서 정적 페이지로 미리 렌더링해서 HTML 마크업 형태로 제공한다.

또한 리액트 하이드레이션 덕분에 이런 정적 페이지에서도 여전히 사용자와 웹 페이지 간의 상호 작용이 가능하다.

## SSG 장점

- **쉬운 확장**

정적 페이지는 CDN을 통해 파일을 제공하거나 캐시에 저장하기 쉽다. 직접 웹 서버에서 웹 애플리케이션을 제공하는 경우에도 정적 페이지는 별도의 연산 없이 정적 자원 형태로 제공되기 때문에 서버에 부하를 거의 주지 않음.

- **뛰어난 성능**

빌드 시점에 HTML페이지를 미리 렌더하기 때문에 페이지를 요청해도 클라이언트나 서버가 무언가를 처리할 필요가 없음. 서버 쪽에 데이터를 요구하지도 않고, 정적 HTML 마크업 내에 미리 렌더링한 내용만 있으면 된다.

- **더 안전한 API 요청**

페이지 렌더링을 위해 웹 서버에서 데이터를 클라이언트로 보낼 필요가 없다. 외부 API를 호출하거나 DB에 접근할 일이 없다. 필요한 모든 정보가 빌드 시점에 미리 페이지로 렌더링되어 있기 때문이다.

## SSG 단점

- 웹 페이지를 만들고 나면 다음 배포 전까지 내용이 변하지 않음

→ 정적으로 생성한 페이지는 빌드 시점에 미리 렌더링되어 정적 자원처럼 제공되기 때문

## 증분 정적 재생성(ISR)

Next.js 해당 문제를 해결하기 위해 증분 정적 재생성이라는 방법을 제공한다.

ISR을 사용하면 Next.js가 어느 정도의 주기로 정적 페이지를 다시 렌더링하고 해당 내용을 업데이트할지 정할 수 있다.

> **동적 콘텐츠를 제고하지만 해당 콘텐츠 데이터를 가져오는 데 오래 걸리는 페이지 → SSG + ISR사용**
> ex) 엄청나게 데이터가 많은 대시보드를 만드는 경우

- **SSG + ISR → getStaticProps함수 사용**

```jsx
import fetch from 'isomorphic-unfetch';
import Dashboard from './components/Dashboard';

export async function getStaticProps() {
  const userReq = await fetch('/api/user');
  const userData = await userReq.json();
  const dashboardReq = await fetch('/api/dashboard');
  const dashboardData = await dashboardReq.json();

  return {
    props: {
      user: userData,
      data: dashboardData,
    },
    revalidate: 600, // 시간을 초 단위로 나타낸 값(10분)
  };
}

function IndexPage(props) {
  return (
    <div>
      <Dashboard user={props.user} data={props.data} />
    </div>
  );
}

export default IndexPage;
```

Next.js는 빌드 과정에서 페이지를 렌더링할 때 이 함수를 호출해서 필요한 데이터 등을 가져오며 다음 번 빌드 시점까지 더 이상 호출하지 않는다.

전체 웹사이트를 다시 빌드하는 일을 피하기 위해 Next.js는 최근 revalidate라는 옵션을 추가 → getStaticProps함수가 반환하는 객체 내에 지정할 수 있다. 이 값은 페이지에 대한 요청이 발생할 때 어느 정도의 주기로 새로 빌드해야 하는지 나타냄.

### Next.js는 다음과 같이 정적페이지를 다시 빌드, 제공한다.

1. Next.js는 빌드 과정에서 페이지의 내용을 getStaticProps함수가 반환한 객체의 값으로 채움. 그리고 이 페이지는 빌드를 거쳐 정적 페이지로 만들어짐
2. 처음 10분 간 해당 페이지를 요청하는 모든 사용자는 동일한 정적 페이지를 제공받음
3. 10분이 지나고 해당 페이지에 대한 새로운 요청이 들어오면 Next.js는 이 페이지를 서버에서 다시 렌더링하고 getStaticProps함수를 다시 호출한다. 그리고 렌더링한 페이지를 저장해서 새로운 정적 페이지로 만들고 이전에 만든 정적페이지를 새로 만든 페이지로 덮어씀
4. 이후 10분간 동일한 페이지에 대한 모든 요청에 대해 새로 만든 정적 페이지를 제공

![캡처.PNG](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5b662e87-18a9-426e-92ce-5e308f6fed16/%EC%BA%A1%EC%B2%98.png)
