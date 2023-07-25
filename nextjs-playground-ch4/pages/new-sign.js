import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import ADD_SIGN from '@/lib/apollo/queries/addSign';
import HomePage from './index';

// 방명록 저장할 폼 내용 관리
// useRouter사용해 새 글 등록 시 홈페이지 이동 -> Apollo useMutaione을 시용해 GraphCMS에 새 글 등록
function NewSign() {
  const router = useRouter();
  const [formState, setFormState] = useState({});

  // 사용자가 폼에 입력한 값은 useState 훅으로 가져온 formState 변수에 저장되어 있다.
  // formState 변수는 addSign 함수에 variables 속성값으로 넘겨준다.
  const [addSign] = useMutation(ADD_SIGN, {
    // 새 글 등록 -> useMutation
    onCompleted: () => {
      // 등록되면 onCompleted콜백 -> 홈으로
      router.push('/');
    },
  });

  const handleInput = ({ e, name }) => {
    setFormState({
      ...formState,
      [name]: e.target.value,
    });
  };

  // 사용자 이름, 글, 국가 정보 입력 폼란 구현
  return (
    <div className='flex justify-center items-center flex-col mt-20'>
      <h1 className='text-3xl mb-10 font-bold'>Sign the Hayeong-World</h1>
      <div className='max-w-7xl shadow-xl bg-purple-50 p-7 mb-10 grid grid-rows-1 gap-4 rounded-md border-purple-800'>
        <div>
          <label className='text-purple-900 mb-2' htmlFor='nickname'>
            Nickname
          </label>
          <input
            id='nickname'
            type='text'
            onChange={(e) => handleInput({ e, name: 'nickname' })}
            placeholder='Your name'
            className='p-2 rounded-lg w-full'
          ></input>
        </div>
        <div>
          <label className='text-purple-900 mb-2' htmlFor='content'>
            Leave a message!
          </label>
          <textarea
            id='content'
            type='text'
            onChange={(e) => handleInput({ e, name: 'content' })}
            placeholder='Leave a message here!'
            className='p-2 rounded-lg w-full'
          ></textarea>
        </div>
        <div>
          <label className='text-purple-900 mb-2' htmlFor='country'>
            If you want, write your country name and its emoji flag
          </label>
          <input
            id='country'
            type='text'
            onChange={(e) => handleInput({ e, name: 'country' })}
            placeholder='Your Country'
            className='p-2 rounded-lg w-full'
          ></input>
          <button
            className='bg-purple-600 p-4 rounded-lg text-gray-50 m-auto mt-4'
            onClick={() => addSign({ variables: formState })}
          >
            Submit
          </button>
        </div>
      </div>
      <Link href='/' passHref className='mt-5 underline'>
        Back to the HomePage
      </Link>
    </div>
  );
}

export default NewSign;
