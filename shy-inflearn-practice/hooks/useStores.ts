import { useCallback } from 'react';
import { Store } from '../types/store';
import { mutate } from 'swr';

export const STORE_KEY = '/stores';

/**
 * initializeStores을 반환
 */
const useStores = () => {
  // mutate는 swr의 함수 -> STORE_KEY라는 문자열을 key로 하는 공간에 매장 데이터를 전역으로 저장해놓겠다.
  /**
   * 새로운 매장 데이터를 인자로 받아 그 데이터를 전역 상태로 저장
   */
  const initializeStores = useCallback((stores: Store[]) => {
    mutate(STORE_KEY, stores);
    // STORE_KEY에 json에 들어있는 데이터가 전역 상태로 관리될 것
  }, []);

  return {
    initializeStores,
  };
};

export default useStores;
