>💡 **CHAPTER 9**
>
>- 테스트 정의 및 테스트 프레임워크
>- 테스트 환경 구성
>- 널리 사용되는 테스트 러너, 프레임워크, 유틸리티 라이브러리 사용법

# 9.1 테스트란?

- 단위 테스트
    - 코드의 각 함수가 제대로 작동하는지 확인하기 위함
    - 함수에 올바른 입력과 잘못된 입력을 각각  주고 결과가 예상과 일치하는지
    - 작동 과정에서 예측하지 못한 오류가 발생하는지
- 엔드 투 엔드 테스트
    - 사용자 상호작용을 흉내내서 특정 작동 발생할 때 적절한 응답을 하는지 확인
    - 웹 사이트를 웹 브라우저에서 직접 테스트하는 것과 비슷
- 통합 테스트
    - 함수나 모듈과 같이 서로 구분되어 있는 영역이 함께 잘 작동하는지 확인 위한 테스트
    - 두 개 함수 조합이 원하는 결과값을 반환하는지 여부 검사
    - 서로 연관된 함수와 모듈을 한데 묶어 주어진 입력에 적절 출력 확인

# 9.2 Jest를 사용한 단위 테스트와 통합 테스트

[](https://github.com/hanbit/practical-next.js/tree/main/09-testing-nextjs/boilerplate)

- 블로그의 모든 게시글 보여주는 홈페이지와 단일 게시글 페이지를 제공
- 각 게시글에 해당하는 페이지 URL은 <article_slug>-<article_id> 의 형태로 구성
- 페이지의 URL과 해당 URL에서 게시글의 ID를 알아내는 것처럼 다양한 유틸리티 함수 제공
- 모든 게시글을 가져오는 REST API와 주어진 ID에 해당하는 특정 게시글 정보를 가져오는 REST API를 제공

- jest 설치

```jsx
npm install jest
```

Jest는 테스트 프레임워크인 동시에 테스트 러너이므로 테스트에 필요한 패키지는 Jest하나만 설치

- .babelrc

```jsx
{
  "presets": ["next/babel"]
}
```

> **Next.js 페이지 테스트 만들 때 주의**
Next.js는 pages/ 디렉터리 안의 모든 .js, .jsx, .ts, .tsx 파일을 애플리케이션 페이지로 간주한다.
따라서 테스트 파일을 절대 pages/ 디렉터리 안에 두어서는 안된다.
테스트 파일을 pages/ 디렉터리 안에 두면 Next.js가 이를 애플리케이션 페이지라고 생각하고 렌더링할 것이다.
> 

## 간단한 custom utils 함수 테스트 코드

- 문자열과 자를 위치에 해당하는 문자열 길이를 받아 문자열을 자르고 그 끝에 생략 부호를 추가하는 함수 테스트 코드

```jsx
import {
  cutTextToLength,
  slugify,
  composeArticleSlug,
  extractArticleIdFromSlug,
} from '../index';

// const str = 'The quick brown fox jumps over the lazy dog';
// const cut = cutTextToLength(str, 5);
// cut === 'the q...';  ---> 사용자가 전체 게시글 내용을 보기 전 본문을 엿볼 수 있도록

describe('cutTextToLength', () => {
  test('Should cut a string that exceeds 10 characters', () => {
    const initialString = 'This is a 34 character long string';
    const cutResult = cutTextToLength(initialString, 10);
    expect(cutResult).toEqual('This is a...');
  })
})
```

- describe
    - 테스트와 관련된 그룹을 만든다. 예를 들어 동일한 함수에 대한 다른 테스트나 모듈은 해당 함수 내에 포함시킨다.
- test
    - 테스트를 선언하고 실행한다.
- expect
    - 함수의 출력과 예상한 결과를 비교할 때 이 함수를 사용한다.
    
- 문자열 띄어쓰기를 -로 바꾸는 테스트 코드 → url을 safe하게 만들어줌

```jsx
describe('slugify makes a string URL-safe', () => {
  test('Should convert a string to URL-safe format', () => {
    const initialString = 'This is a string to slugify';
    const slugResult = slugify(initialString);
    expect(slugResult).toEqual('this-is-a-string-to-slugify');
  });
  test('Should slugify a string with special characters', () => {
    const initialString = 'This is a string to slugify!@#$%^&*';
    const slugResult = slugify(initialString);
    expect(slugResult).toEqual('this-is-a-string-to-slugify');
  });
});
```

- 테스트 실행
    - package.json
    
    ```jsx
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "test": "jest"
      },
    ```
    
    ![image](https://github.com/Hayeong8957/NextJS_BookStudy/assets/70371342/e36869b6-fe24-4348-8e92-88a1c709c3e2)

## 리액트 컴포넌트 내 함수 테스트

> Jest 만으로는 리액트 컴포넌트를 테스트할 수 없다. 리액트 컴포넌트를 테스트하려면 컴포넌트를 마운트하고 하면에 렌더링해야 그 결과를 볼 수 있다. 
이 경우에는 react-testing-library와 Enzyme을 사용할 수 있는데, 여기서는 react-testing-library를 사용하겠다.
> 

- react-testing-library 패키지 설치

```jsx
npm install @testing-library/react
```

- 리액트 컴포넌트 내에서 사용되는 util 함수 작동 테스트

게시글을 입력으로 제공하면 컴포넌트가 게시글을 화면에 제대로 표시하는지 확인하는 것이 목적

게시글에 관한 모든 정보를 가지고 있는 가짜 정보를 만들어서 컴포넌트에 입력을 전달할 것

```jsx
// components/ArticleCard/tests/mock.js

export const article = {
  id: 'u12w3o0d',
  title: 'Healthy summer melon-carrot soup',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi iaculis, felis quis sagittis molestie, mi sem lobortis dui, a sollicitudin nibh erat id ex. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec lorem ante, blandit sit amet ex quis, venenatis vestibulum enim. Mauris finibus ligula ac eros porttitor gravida. Donec luctus, nibh et lobortis lacinia, diam nulla scelerisque est, sagittis tincidunt massa massa id purus. Maecenas convallis, nisi non bibendum molestie, nibh arcu bibendum leo, vel rutrum arcu magna non odio. Vivamus semper ac nisi eget hendrerit. Quisque consectetur velit sit amet est dignissim, eget ultrices velit auctor. Phasellus et nulla vel tortor semper feugiat. Nulla lacinia in enim a mattis. Quisque vitae erat eu velit faucibus aliquam quis at nisl. Praesent ac odio in arcu eleifend sollicitudin.',
  author: {
    id: '93ksj19s',
    name: 'John Doe',
  },
  image: {
    url: 'https://images.unsplash.com/photo-1629032355262-d751086c475d',
    author: 'Karolin Baitinger',
  },
};
```

```jsx
// components/ArticleCard/tests/index.test.js

import { render, screen } from '@testing-library/react';
import ArticleCard from '../index';
import { cutTextToLength } from '../../../utils';
import { article } from './mock';

// 컴포넌트에 하나의 링크가 있는지와 해당 링크의 href 속성값이 /articles/healthy-summer-meloncarrot-soup-u12w3o0e인지 검사
describe('ArticleCard', () => {
  test('Generated link should be in the correct format', () => {
    const component = render(<ArticleCard {...article} />);
    const link = component.getByRole('link').getAttribute('href');
    expect(link).toBe('/articles/healthy-summer-meloncarrot-soup-u12w3o0e');
  });
});
```
![image](https://github.com/Hayeong8957/NextJS_BookStudy/assets/70371342/a5981ebd-50a4-477b-82c1-60d4fe741385)

-> react-testing-library는 브라우저의 document 전역 변수를 사용하는데 Node.js 가 이를 제공하지 않기 때문에 발생하는 문제이다. 이 테스트에 대한 Jest 환경을 JSDOM으로 바꾸어서 문제를 간단하게 해결할 수 있따. 

- JSDOM
: 테스트 목적으로 브라우저의 다양한 기능을 흉내낼 수 있는 라이브러리
테스트 파일의 최상단 import 구문 바로 앞에 다음과 같은 주석을 추가하면 Jest가 알아서 인지한다.
```
/**
* @jest-environment jsdom
*/
```

- 입력 게시물 화면 UI 테스트
```jsx
/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import ArticleCard from '../index';
import { cutTextToLength } from '../../../utils';
import { article } from './mock';

// 컴포넌트에 하나의 링크가 있는지와 해당 링크의 href 속성값이 /articles/healthy-summer-meloncarrot-soup-u12w3o0e인지 검사
describe('ArticleCard', () => {
  test('Generated link should be in the correct format', () => {
    const component = render(<ArticleCard {...article} />);
    const link = component.getByRole('link').getAttribute('href');
    expect(link).toBe('/articles/healthy-summer-meloncarrot-soup-u12w3o0d');
  });

  // 게시글의 전체 내용을 표시하기 전 게시글 내용 중 첫 100개의 문자만 표시
  // 전체 컴포넌트를 렌더링하고 게시글 요약본을 만든 다음 컴폰너트 안의 글과 요약본이 일치하는지 확인
  test('Generated summary should not exceed 100 characters', async () => {
    render(<ArticleCard {...article} />);
    const summary = screen.getByText(cutTextToLength(article.body, 100));
    expect(summary).toBeDefined();
  });
});
```