import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard'; // 클립보드
import styles from '../../styles/header.module.scss';
import Header from '../common/Header';
import useMap from '../../hooks/useMap';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { VscFeedback } from 'react-icons/vsc';

const HomeHeader = () => {
  const { resetMapOptions, getMapOptions } = useMap();

  const router = useRouter(); // url 변경 위함

  /** 공유하기 버튼 누를 시 url을 변경하고 url 복사하는 함수 */
  const replaceAndCopyUrl = useCallback(() => {
    const mapOptions = getMapOptions();
    const query = `/?zoom=${mapOptions.zoom}&lat=${mapOptions.center[0]}&lng=${mapOptions.center[1]}`;

    router.replace(query);
    copy(location.origin + query);
  }, [router, getMapOptions]);

  return (
    <Header
      onClickLogo={resetMapOptions}
      rightElements={[
        <button
          onClick={replaceAndCopyUrl}
          className={styles.box}
          style={{ marginRight: 8 }}
          aria-label='현재 위치 클립보드 복사'
          key='button'
        >
          <AiOutlineShareAlt size={20} color='#444444' />
        </button>,
        <Link
          href='/feedback'
          className={styles.box}
          aria-label='피드백 페이지로 이동'
          key='link'
        >
          <VscFeedback size={20} color='#444444' />
        </Link>,
      ]}
    />
  );
};
export default HomeHeader;
