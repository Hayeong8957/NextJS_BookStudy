import { Fragment } from 'react';
import HeaderComponent from '@/components/common/Header';
import styles from '@/styles/header.module.scss';
import Link from 'next/link';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { VscFeedback } from 'react-icons/vsc';

export default function Home() {
  return (
    <Fragment>
      <HeaderComponent
        rightElements={[
          <button
            key='button'
            onClick={() => {
              alert('복사');
            }}
            className={styles.box}
            style={{ marginRight: 8 }}
          >
            <AiOutlineShareAlt size={20} />
          </button>,
          <Link href='/feedback' key='link' className={styles.box}>
            <VscFeedback size={20} />
          </Link>,
        ]}
      />
      <main></main>
    </Fragment>
  );
}
