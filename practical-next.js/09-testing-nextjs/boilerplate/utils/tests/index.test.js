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
    const initialString = 'This is a 35 character long string';
    const cutResult = cutTextToLength(initialString, 10);
    expect(cutResult).toEqual('This is a ...');
  });

  test("Should not cut a string if it's shorter than 10 characters", () => {
    const initialString = '7 chars';
    const cutResult = cutTextToLength(initialString, 10);
    expect(cutResult).toEqual('7 chars');
  });
});

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
