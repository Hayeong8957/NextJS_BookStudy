> 💡 **CHAPTER 3**
>
> - 클라이언트와 서버에서의 라우팅 시스템 작동 방식
> - 페이지 간 이동 최적화
> - Next.js가 정적 자원을 제공하는 방법
> - 자동 이미지 최적화와 새로운 Image 컴포넌트를 사용한 이미지 제공 최적화 기법
> - 컴포넌트에서 HTML 메타데이터를 처리하는 방법
> - \_app.js와 \_document.js 파일 내용 및 커스터마이징 방

# 3-1. 라우팅 시스템

Next.js 는 파일시스템 기반 페이지와 라우팅을 제공한다. Next.js 프로젝트는 기본적으로 pages/ 디렉터리를 가지고 있다. 이 안의 .js, .jsx, .ts, .tsx파일에서 익스포트한 리액트 컴포넌트라고 볼 수 있다.

해당 디렉터리 안의 jsx코드를 반환하는 파일 이름이 즉 라우팅 주소가 된다.

- 파일 이름 `contacts.js` → `http://localhost:3000/contancts`

> 각 게시글 별 라우팅 규칙을 만들어 /posts페이지를 만들어 웹 사이트의 모든 게시글을 보여주도록 변경

우선 다음과 같이 동적 라우팅 규칙을 만든다.

```
pages/
  - index.js
  - contact-us.js
  - posts/
    - index.js
    - [slug].s
```

- pages/ 디렉터리 내부에 계층 구조로 라우팅 규칙을 만들 수 있다.
  - /posts에 대한 라우팅 규칙을 추가하고 싶다면 pages/posts/ 디렉터리 안에 index.js 파일을 만들어서 JSX 함수를 반환하도록 만든다.

> 모든 블로그 게시글에 대한 동적 라우팅 규칙을 생성해서 웹 사이트에 새로운 글을 쓸 떄마다 수동으로 새 페이지를 만들지 않도록

- 동적 라우팅 규칙을 생성하기 위해 pages/posts/ 디렉터리 안에 [slug].js 파일을 만든다.
  - [slug]는 경로 매개변수로, 사용자가 브라우저 주소창에 입력하는 값은 모두 가질 수 있다. [slug]로 각 블로그 게시글을 구분할 수 있는 것이다. `http://localhost:3000/posts/*` 주소로 접근.

> pages/ 디렉터리 내부에 동적 라우팅 규칙을 중첩할 수도 있다.

- 블로그 게시글에 접근하는 경로를 posts/[date]/[slug] 와 같이 만들 수 있다.
  ```
  pages/
    - index.js
    - contact-us.js
    - posts/
      - index.js
      - [date]/
        - [slug].s
  ```
  - http://localhost:3000/posts/2021-01-01/my-firstpost 주소로 접근하면 이전과 같은 JSX 콘텐츠를 볼 수 있다.
  - [date]나 [slug]변수는 어떤 값이든 가질 수 있기 때문에 브라우저 주소창에 아무 주소나 입력해서 해당 변수값이 어떻게 할당되는지 살펴보는 거 추천

## 페이지에서 경로 매개변수 사용하기

경로 매개변수를 사용해 동적 페이지 콘텐츠를 쉽게 만들 수 있다.

- **`pages/greet/[name].js`**

해당 페이지는 Next.js의 내장 getServerSideProps 함수를 통해 URL에서 동적으로 [name] 변수값을 가져와서 해당 사용자를 환영한다는 문구를 표시

```jsx
export async function getServerSideProps({ params }) {
  const { name } = params;
  return {
    props: {
      name,
    },
  };
}

function Greet(props) {
  return <h1> Hello, {props.name}! </h1>;
}

export default Greet;
```

브라우저에서 http://localhost:3000/greet/Mitch 주소로 가면 ‘Hello, Mitch!’ 라는 문구를 확인할 수 있다.

즉 URL에서 값을 가져와서 사용하는 기능임 → 사용자 프로필 표시하기 위해 DB에서 해당 사용자의 데이터를 불러올 때 [name] 변수를 사용하게 확장 가능

> 💡 getServerSideProps나 getStaticProps 함수는 **반드시 객체를 반환해야 한다**는 점을 명심.
> 그리고 이러한 함수가 **반환한 값을 페이지에서 사용할 때는 함수가 반환한 객체의 props 속성값을 사용해야 한다.**

## 컴포넌트에서 경로 매개변수 사용하기

Next.js 에서는 페이지 밖에서 getServerSideProps와 getStaticProps 함수를 사용하지 못하는데 어떻게 경로 매개변수를 컴포넌트 안에서 사용할 수 있을까?

> useRouter 훅으로 경로 매개변수를 사용할 수 있다.
> `import { useRouter } from ‘next/router’;`

```jsx
import { useRouter } from 'next/router';

function Greet() {
  const { query } = useRouter();
  console.log(query);
  return <h1>Hello {query.name}!</h1>;
}

export default Greet;
```

`http://localhost:3000/greet/Mitch?learning_nextjs=true`라는 주소로 접근하면 다음과 같은 객체 정보가 콘솔 로그로 출력됨 → `{learning_nextjs: “true”, name: “Mitch”}`

## 클라이언트에서의 내비게이션

- **`<Link>`**

리액트에서처럼 Link컴포넌트를 사용하여 서로 다른 라우트 간의 이동을 최적화할 수 있다.

Next.js는 기본적으로 현재 화면에 표시되는 페이지의 모든 Link에 대해 연결된 부분 또는 페이지를 미리 읽어온다.

페이지의 링크를 클릭했을 때 브라우저는 해당 페이지를 화면에 표시하기 위해 필요한 모든 데이터를 이미 불러온 상태라는 뜻이다.

미리 불러오는 기능은 Link 컴포넌트에 preload={false}라는 속성을 전달해서 비활성화할 수 있다.

```jsx
<Link href='/about' preload={false}>
  Home
</Link>
```

- 동적 경로 매개변수

```jsx
<Link
  ref={{
		pathname: '/blog/[date]/[slug]'
		query: {
			date: '2020-01-01',
			slug: 'happy-new-year',
			foo: 'bar'
		}
	}}
>
  Read Post
</Link>
```

⇒ http://localhost:3000/blog/2020-01-01/happy-new-year?foo=bar 라[는](http://localhost:3000/blog/2020-01-01/happy-new-year?foo=bar라는) 주소로 이동

### router.push 메서드

Link대신 useRouter사용해서 다른 페이지로 이동 가능.

사용자가 로그인하지 않았다면 useRouter 훅을 사용해 로그인 페이지로 이동시키기

```jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PrivateComponent from '../components/PrivateComponent';
import { useAuth } from '../hooks/useAuth';

function MyPAge() {
  const router = useRouter();
  const { loggedIn } = useAuth();

  useEffect(() => {
    if (!loggedIn) {
      router.push('/login');
    }
  }, [loggedIn]);

  return loggedIn ? <PrivateComponent /> : null;
}

export default MyPAge;
```

객체 전달해서 더 복잡한 URL로 이동

```jsx
router.push({
  pathname: '/blog/[date]/[slug]',
  query: {
    date: '2021-01-01',
    slug: 'happy-new-year',
    foo: 'bar',
  },
});
```

http://localhost:3000/blog/2020-01-01/happy-new-year?foo=bar로 이동

# 3.2 정적 자원 제공

/public 디렉터리 안에 있는 모든 파일은 Next.js가 정적 자원으로 간주하고 제공한다. 정적 자원 관리 및 제공 → 웹 사이트의 성능과 SEO 점수에 큰 영향을 미친다. like 이미지 파일

Next.js에서는 내장 Image 컴포넌트를 사용해 CLS 문제를 해결한다.

## 자동 이미지 최적화

Image 컴포넌트 사용해 이미지를 자동으로 최적화할 수 있다.

자동 이미지 최적화의 장점은 **클라이언트가 이미지를 요구할 때 최적화한다는 점**이다. 브라우저가 이미지를 요청하면 이미지를 최적화하고, 크기를 조절하고, 렌더링한다.

- next.config.js

```jsx
module.exports = {
  images: {
    domains: ['images.unsplash.com'],
  },
};
```

위의 설정 추가시 Image 컴포넌트 안에서 해당 도메인 이미지 불러올 때마다 자동으로 최적화

- Image 태그 속성값
  - width : 가로, height : 세로 ⇒ 필수로 지정해줘야함
  - layout속성 값 지정해서 이미지를 원하는대로 자를 수 있음
    - fixed : 이미지 크기 지정한대로 유지
    - reponsive : 화면 크기 조절 시 그에 따라 이미지 최적화해서 제공
    - intrinsic : 크기가 작은 화면에서는 이미지 크기를 조절하지만 이미지보다 큰 화면에서는 이미지 크기를 조절하지 않음
    - fill : 부모 요소 가로 세로 따라 이미지 늘림 → fill을 지정한 경우 width와 height속성을 함께 지정할 수 없음. fill을 사용하던가 width/height을 지정하던가 하나만 가능
  - objectFit 속성
    - cover : 부모 요소의 크기에 따라 잘라냄

## 외부 서비스를 통한 자동 이미지 최적화

웹 애플리케이션이 아주 많은 이미지를 사용한다면 서버 성능에 영향 → 이미지 최적화를 서버가 아닌 외부 서비스에서 처리하는 방법도 있음

Next.js 는 기본으로 실행되고 있는 서버에서 자동 이미지 최적화 작업을 처리한다. 웹 사이트가 컴퓨팅 자원이 충분하지 않은 작은 서버에서 실행된다면 이미지 최적화로 인해 성능에 영향을 미칠 수 있다.

> Next.js에서는 next.config.js 파일 내에 loader 속성을 지정하여 외부 서비스를 통해 자동 이미지 최적화 작업을 처리한다.

- `next.config.js`

```jsx
module.exports = {
  images: {
    loader: 'akamai',
    domains: ['images.unsplash.com'],
  },
};
```

→ vercel, Akamain, Imgix, Cloudinary로 배포하는 경우 loader속성을 지정할 필요가 없다.

하지만 별도의 이미지 최적화 서버를 사용하고 싶다면 해당 정보를 컴포넌트 내에서 loader 속성으로 전달하면 된다.

```jsx
import Image from 'next/image';

const loader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75} `;
};

function CustomImage() {
  return (
    <Image loader={loader} src='test.png' alt='test' width={500} height={500} />
  );
}
```

이렇게 별도로 만든 이미지 최적화 서버나 Imgproxy, Thumbor 같이 오픈소스 프로젝트를 이용한 이미지 최적화 서버를 외부 서비스로 연결해서 사용할 수 있다.

# 3.3 메타 데이터

Next.js는 내장 Head 컴포넌트를 제공하여 이러한 데이터를 쉽게 다룰 수 있게 도와줌.

어떤 컴포넌트에서든 HTML 페이지의 <head> 내부 데이터를 변경할 수 있도록 해줌.

즉, 동적으로 메타데이터, 링크, 스크립트 등의 정보를 변경하고 , 추가하고, 삭제할 수 있음

- title 태그

```jsx
import Head from 'next/head';

/*...*/

<Head>
  <title>WELCOME</title>
</Head>;
```

## 공통 메타 태그 그룹

서로 다른 컴포넌트에서 같은 메타 태그를 사용하는 경우가 종종 생긴다. 이 경우 각 컴포넌트마다 모든 메타데이터와 관리 코드를 일일이 만들기에는 작업의 양이 너무 많고 불편함.

⇒ 메타데이터를 그룹화하여 특정 HTML 태그를 다루는 컴포넌트를 만들고 사용하는 것이 좋다.

- **메타데이터 그룹화한 컴포넌트**

```jsx
import Head from 'next/head';

function PostMeta(props) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name='description' content={props.subtitle} />
      {/* 오픈 그래프 메타데이터 */}
      <meta property='og:title' content={props.title} />
      <meta property='og:description' content={props.subtitle} />
      <meta property='og:image' content={props.image} />

      {/* 트위터 카드 메타데이터 */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={props.title} />
      <meta name='twitter:description' content={props.description} />
      <meta name='twitter:image' content={props.image} />
    </Head>
  );
}

export default PostMeta;
```

- **메타 데이터 표시할 페이지**

```jsx
import PostHead from '../../components/PostHead';
import Posts from '../../data/posts';

export function getServerSideProps({ params }) {
  const { slug } = params;
  const post = Posts.find((post) => post.slug === slug);

  return {
    props: {
      post,
    },
  };
}

function Post({ post }) {
  return (
    <div>
      <PostHead {...post} />
      <h1>{post.title}</h1>
      <p>{post.subtitle}</p>
    </div>
  );
}

export default Post;
```

이런식으로 작성하면 된다.

만약 모든 페이지에서 동일한 메타 태그나 데이터를 처리해야 한다면 각 페이지별로 태그를 처리하는 코드를 작성하거나 모든 페이지에서 해당 데이터를 관리하는 컴포넌트를 불러올 필요 없이 \_app.js 파일을 커스터마이징해서 구현하면 된다.

# 3.4 \_app.js와 \_documents.js 페이지 커스터마이징

웹 애플리케이션에 따라 페이지 초기화 과정을 조절해야 하는 경우가 있다. 이 경우 페이지를 렌더링할 때마다 렌더링한 HTML을 클라이언트에 보내기 전에 특정 작업을 처리해야 한다.

Next.js에서는 pages/ 디렉터리 안의 \_app.js와 \_document.js로 이런 작업을 지정하고 처리한다.

## \_app.js 페이지

Next.js는 프로젝트를 생성하면 기본으로 다음과 같은 pages/\_app.js 파일을 만든다.

```jsx
import '../styles/globals.css';

function MyApp({ component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

MyApp함수는 Component라는 Next.js 페이지 컴포넌트와 그 속성(pageProps)을 반환한다.

### 전역 네비게이션 바

이 함수는 각 페이지마다 별도의 컴포넌트를 불러오지 않고도 모든 페이지에서 같은 내비게이션 바를 사용할 수 있다.

우선 다음과 같이 components/Navbar.js 파일에서 내비게이션 바 컴포넌트를 정의한다.

```jsx
import Link from 'next/link';

function Navbar() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
      }}
    >
      <div>My Website</div>
      <div>
        <Link href='/'>Home</Link>
        <Link href='/about'>About</Link>
        <Link href='/contacts'>Contacts</Link>
      </div>
    </div>
  );
}

export default Navbar;
```

페이지 이동을 위해 세 개의 링크를 갖는 간단한 내비게이션 바이다. 해당 컴포넌트를 다음과 같이 \_app.js 파일에서 불러온다.

```jsx
import '../styles/globals.css';
import Navbar from '../components/Navbar';

function MyApp({ component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

이제 about.js와 contacts.js 같은 두 개의 페이지를 더 만들어보면 해당 페이지에도 똑같이 내비게이션 바가 표시되는 것을 알 수 있다.

### 전역 테마 적용

리액트 컨텍스트를 활용하여 어두운 테마와 밝은 테마를 지원할 수 있는 기능을 구현.

- `components/themeContext.js`

```jsx
import { createContext } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => null,
});

export default ThemeContext;
```

- `_app.js`

테마 상태값과 인라인 CSS 스타일을 만들고 컨텍스트 provider로 페이지의 컴포넌트를 감싼다.

```jsx
import { useState } from 'react';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import ThemeContext from '../components/themeContext';

const themes = {
  dark: {
    background: 'black',
    color: 'white',
  },
  light: {
    background: 'white',
    color: 'black',
  },
};

function MyApp({ component, pageProps }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          ...themes[theme],
        }}
      >
        <Navbar />
        <Component {...pageProps} />
      </div>
    </ThemeContext.Provider>
  );
}

export default MyApp;
```

- components/Navbar.js

마지막으로 테마 간 전환을 위한 버튼을 추가

```jsx
import Link from 'next/link';
import { useContext } from 'react';
import themeContext from '../components/themeContext';

function Navbar() {
  const { toggleTheme, theme } = useContext(themeContext);
  const newThemeName = theme === 'dark' ? 'light' : 'dark';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
      }}
    >
      <div>My Website</div>
      <div>
        <Link href='/'>Home</Link>
        <Link href='/about'>About</Link>
        <Link href='/contacts'>Contacts</Link>
        <button onClick={toggleTheme}>
          Change Theme to {newThemeName}
          <span role='img' aria-label='sun'>
            ☀：
          </span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
```

> 💡 **\_app.js 파일을 커스터마이징할 때는 이 페이지를 다른 페이지처럼 getServer SideProps 또는 getStaticProps와 같은 함수를 사용해서 데이터를 불러오는 용도로 사용할 수 없다는 점을 기억해야 함**

\_app.js파일의 주된 사용 목적은 페이지 이동 시 서로 다른 페이지 간 상태 유지(테마나 장바구니 등), 전역 스타일 추가, 페이지 레이아웃 관리, 페이지 속성에 데이터를 추가하는 것 등이다.

모든 페이지를 렌더링할 떄마다 서버에서 특정 데이터를 불러와야 한다면 getInitialProps함수를 사용할 수 있다. 하지만 그러면 동적 페이지에 대한 정적 최적화를 하지 않는다.

\_app.js 파일을 커스터마이징해서 페이지 컴포넌트 렌더링을 수정할 수 있지만 HTML태그는 커스터마이징할 수 없다. **이 경우에 \_document.js 페이지를 대신 사용한다.**

## \_document.js 페이지

Next.js 페이지 컴포넌트에서는 <head>, <html>, <body> 와 같은 기본적인 HTML 태그를 정의할 필요가 없다. <html>과 <body> 태그를 수정하려면 Next.js 내장 클래스인 Document를 사용한다.

그리고 \_app.js 파일과 비슷하게 pages/ 디렉터리 안의 \_document.js 파일로 기능을 확장할 수 있다.

```jsx
import Document, { Html, Head, Main, NextScript } from 'next/document';
// 커스텀 스크립트를 추가할 Document 클래스,
// Next.js 애플리케이션이 작동하기 위해 필요한 네 개의 컴포넌트를 순서대로 불러온다.

Class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return(
			<HTML>
				<Head/>
				<body>
					<Main/>
					<NextScript/>
				</body>
			</HTML>
		)
	}
}

export default MyDocument;
```

- HTML : html 태그에 해당, lang과 같은 표준 HTML 속성 전달
- Head : 애플리케이션 모든 페이지에 대한 공통 태그 정의할 때 해당 컴포넌트 사용, 반드시 웹 사이트의 모든 페이지에서 공통으로 사용되는 코드가 있을 때만 사용
- Main : Next.js가 페이지 컴포넌트를 렌더링하는 곳. <Main> 외부의 컴포넌트는 브라우저에서 초기화되지 않기 때문에 페이지 간에 공통으로 사용되는 컴포넌트가 있다면 반드시 \_app.js 파일에서 해당 컴포넌트를 사용
- NextScript : Next.js 는 클라이언트에서 실행할 코드나 리액트 하이드레이션과 같은 작업을 처리할 수 있는 커스텀 스크립트를 끼워넣음. NextScript는 이런 커스텀 자바스크립트가 위치하는 곳.

\_document.js 페이지를 수정할 때 해당 네 가지를 반드시 불러와야 한다. 이 중에서 하나라도 빠지면 Next.js 애플리케이션은 제대로 작동하지 않음.

\_document.js 페이지에서도 getServerSideProps 나 getStaticProps 같이 서버에서 데이터를 불러오는 함수를 사용할 수 없다. getInitialProps 메서드를 사용할 수는 있지만 이 함수를 쓰면 사이트 최적화 기능을 사용할 수 없으며 무조건 서버에서 모든 페이지를 렌더링하게 된다.
