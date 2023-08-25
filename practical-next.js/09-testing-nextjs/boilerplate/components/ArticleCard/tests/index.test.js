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
