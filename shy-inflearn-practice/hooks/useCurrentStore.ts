import { useCallback } from 'react';
import { mutate } from 'swr';
import type { Store } from '../types/store';

export const CURRENT_STORE_KEY = '/current-store';

// 하나의 마커를 눌렀을 때 어떤 마커가 선택되어있는지 상태값 전역 관리

const useCurrentStore = () => {
  /** 현재 선택된 store 전역 저장 */
  const setCurrentStore = useCallback((store: Store) => {
    mutate(CURRENT_STORE_KEY, store);
  }, []);

  /** 현재 선택된 store 초기화 */
  const clearCurrentStore = useCallback(() => {
    mutate(CURRENT_STORE_KEY, null);
  }, []);

  return {
    setCurrentStore,
    clearCurrentStore,
  };
};
export default useCurrentStore;
