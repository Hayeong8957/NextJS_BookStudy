> 💡 **CHAPTER 1**
>
> - 리액트 앱과 Next.js 차이점, Next.js와 다른 유명한 프레임워크의 장단점
> - 바벨과 웹팩 설정을 수정하고 커스터마이징하는 방법
> - 자바스크립트 대신 타입스크립트로 애플리케이션을 개발하는 방법

# 1.2 Next.js란?

## 리액트의 단점

- 리액트는 기본적으로 클라이언트 사이드에서만 작동
- 검색 엔진 최적화의 효과를 볼 수 없음
- 첫 화면에 웹 애플리케이션을 제대로 표시하기 위해 애플리케이션 실행 초기에 성능 부담이 생김
  - 웹 앱을 완선히 표시하려면 브라우저가 전체 웹 애플리케이션 번들을 다운로드한 다음 그 내용을 분석하고 코드를 실행하여 결과를 얻어야 하기 떄문 ⇒ 첫 화면 표시까지 수 초가 소요되는 이유

> **⇒ 웹 애플리케이션을 서버에서 미리 렌더링해서 브라우저가 즉각 화면에 표시하게 해보자 ! ⇒ Next.js 탄생**

## Next.js란

리액트를 위해 만든 오픈소스 자바스크립트 웹 프레임워크

리액트에는 없는 서버 사이드 렌더링(server-side rendering, SSR), 정적 사이트 생성(static site generation, SSG), 증분 정적 재생성(incremental static regeneration, ISR)과 같은 다양하고 풍부한 기능을 제공한다.

### Next.js가 제공하는 기능

- 정적 사이트 생성(static site generation, SSG)
- 증분 정적 재생성(incremental static regeneration, ISR)
- 타입스크립트에 대한 기본 지원
- 자동 폴리필 적용
- 이미지 최적화
- 웹 애플리케이션의 국제화 지원
- 성능 분석

# 1.3 Next.js와 비슷한 프레임워크

Next.js가 아닌 다른 프레임워크를 선택한다면 해당 프레임워크가 프로젝트 목적에 얼마나 부합하는지를 고려해야 한다.

## Gatsby

- 정적 웹 사이트를 만들 수 있는 프레임워크 만들 때 선택
- 모든 페이지를 빌드 시점에 미리 렌더링해서 정적 콘텐츠 형태로 만들기 때문에 어떤 콘텐츠 전송 네트워크(CDN)로도 제공할 수 있다.
- 동적 서버 사이드 렌더링을 지원하지 않는다. → 데이터에 따라 동적으로 변하는 복잡한 웹 사이트는 만들 수 없다.

## Razzle

- CRA도구를 쉽게 사용하면서 서버와 클라이언트의 복잡한 애플리케이션 설정들을 추상화하고 단순하게 만들 수 있다
- 사용할 프레임워크에 대한 지시깅 없어도 된다ㅣ.

## Nuxt.js

- Vue의 서버사이드 렌더링 프레임워크

## Angular Universal

- Angular의 서버사이드 렌더링 프레임워크

# 1.5 리액트에서 Next.js로

## “설정보다 관습”

- Next.js의 특정 기능을 사용하고자 한다면 복잡한 설정 없이도 해당 기능을 사용할 수 있는 방법이 있음
  - 별도의 설정 파일을 만들지 않고도 어떤 페이지에 서버 사이드 렌더링을 적용하고 어떤 페이지에 정적 페이지 생성을 적용할지 지정할 수 있다. ⇒ 각 페이지에서 특정 함수를 익스포트하면 Next.js가 나머지 일을 알아서 처리
- 서버사이드 렌더링 페이지, 정적으로 생성된 페이지 모두 Node.js에서 실행
  - fetch, window, document와 같이 웹 브라우저에서 제공하는 전역 객체나 canvas같은 HTML 요소에는 접근X
  - 전역 변수나 HTML요소를 반드시 사용해야 하는 컴포넌트를 다루는 방법도 Next.js에서 제공
- fs, child_process와 같이 Node.js에서만 사용할 수 있는 라이브러리나 API를 사용하려는 경우, Next.js는 **각 요청별 데이터를 클라이언트로 보내기 전에 서버 사이드 코드를 실행** or **페이지 생성 시점에 해당 코드를 처리하는 방식**을 지원 ⇒ 각 페이지의 렌더링 방식에 따라 달라짐

# 1.6 Next.js 시작하기

## 1.6.1 프로젝트 기본 구조

```bash
npx create-next-app <app-name>. # 의존성 패키지 설치, 몇 개의 기본 페이지 생성
npm run dev                     # 개발 서버 시작
npm create-next-app <app-name> --use-npm # 설정 덮어쓰기
npx create-next-app <app-name> --example with-docker # --example 옵션으로 보일러플레이트 코드를 다운로드
npx create-next-app my-first-app --use-npm
```

## 디렉토리 구조

- pages/ => 내비게이션,
  - 이 안의 모든 js파일은 public 페이지가 됨
  - 해당 디렉토리 안의 about.js파일은 [http://localhost:3000/about주소로](http://localhost:3000/about주소로) 접근 가능
- public/ ⇒ 웹 사이트의 모든 퍼블릭 페이지와 정적 콘텐츠가 있다.
  - 이미지, svg, css스타일 시트, 컴파일된 자바스크립트 파일, 폰트 등
- styles/ ⇒ 있어도 되고 없어도 됨
- 나머지는 추가적으로 필요하면 추가해도 됨 딱히 Next.js빌드 및 개발 프로세스에 아무 영향을 주지 않음
  - 만약 보일러플레이트 코드 생성 방식을 사용하지 않으면 모든 의존성 패키지를 따로 추가한 다음 기본적인 디렉터리 구조를 추가하는 것만으로도 새로운 Next.js 애플리케이션을 만들 수 있음

## 1.6.2 타입스크립트 지원

### tsconfig.json 타입스크립트 설정파일

> Next.js에서 기본 언어로 타입스크립트 지정하려면 프젝 최상위 디렉터리 안에서 tsconfig만들고 npm run dev 실행 → 의존성 패키지 설치하라는 메시지 나옴 → 메시지에 따라 설치 → 완료

- 초반 tsconfig.json파일은 빈 파일이지만 패키지 설치하고 나면 자동으로 채워질 것
- 필요한 경우 수정할 수 있지만 Next.js가 바벨의 `@babal/plugin-transform-typescript`를 사용해서 설정파일을 관리하기 때문에 다음 주의사항 숙지
  - 해당 플러그인은 const enum을 지원하지 않음 ⇒ babel-plugin-const-enum을 추가해야 함
  - export =와 import = 구문은 사용할 수 없음 ⇒ babel-plugin-replacets-export-assignment를 설치하거나 import x, {y} from ‘same-package’ 또는 export default x와 같은 올바른 ECMAScript구문으로 바꿔야함

## 1.6.3 바벨과 웹팩 설정 커스터마이징

### 바벨

- 자바스크립트 트랜스컴파일러이며, 최신 자바스크립트 코드를 하위 호환성을 보장하는 스크립트 코드로 변환
- 브라우저느 Node.js등에서 지원하지 않는 새로운 기능을 현재 환경에서도 실행할 수 있다.

Next.js의 바벨 설정을 커스터마이징하고 싶다면 프로젝트 최상위 디렉터리에 .babelrc파일을 새로 만들면 된다.

해당 파일이 비어있으면 Next.js의 빌드 또는 개발 과정에서 에러가 발생하기 때문에 최소한 아래의 내용은 작성해야함

```bash
{
	"presets": ["next/babel"]
}
```

해당 내용은 default 바벨 설정값임

### 파이프라인 연산자

```jsx
console.log(Math.random() * 10);
// 파이프라인 연산자를 사용하면 위 코드를 아래와 같이 바꿀 수 있다.
Math.random() |> (x) => x * 10 |> console.log;
```

Next.js앱에서 파이프라인 연산자를 사용하고 싶으면 바벨 플러그인을 설치해야 함

```jsx
npm install --save-dev @babel/plugin-proposal-pipeline-operator @babel/core
```

그리고 .babelrc파일을 다음과 같이 수정한다.

```jsx
{
	"presets" : ["next/babel"],
  "plugins" : [
		[
			"@bable/plugin-proposal-pipeline-operator",
			{"proposal": "fsharp"}
		]
	]
}
```

### 웹팩

개발하다보면 바벨과 마찬가지로 기본 웹팩 설정을 커스터마이징 해야 하는 경우도 생김

웹팩은 자바스크립트 파일, css, svg등 웹에서 사용하는 모든 자원에 대한 각기 다른 컴파일, 번들, 최소화 작업을 조율하고 처리해주는 일종의 인프라임

애플리케이션 빌드 과정을 꼭 수정해야 한다면 대부분 next.config.js파일의 기본값을 변경하는 것으로도 충분함

```jsx
// next.config.js
module.exports = {
  // 변경할 설정값을 여기에 저장
};
```

- 예시 : my-custom-loader라는 가상의 로더를 추가하고 싶을 때

```jsx
// next.config.js
module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.js/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: 'my-custom-loader', // 사용할 로더 지정
          options: loaderOptions, // 로더의 옵션 지정
        },
      ],
    });
  },
};
```

기본 설정을 지우거나 직접 바꾸는 것 X ⇒ 기본 설정은 그대로 두고 추가로 설정값을 확장하거나 덮어쓰는 것이 좋다.

---

- Next.js 프로젝트 생성하기 에러

![Untitled](https://github.com/Hayeong8957/NextJS_BookStudy/assets/70371342/246033b0-5770-405f-a6ce-7bce00c44b07)


명령어가 먹히지 않는 문제가 발생했다..

`npm install -g npm@latest`명령어 치고 다시 npx로 프로젝트 생성하니 잘 됨
