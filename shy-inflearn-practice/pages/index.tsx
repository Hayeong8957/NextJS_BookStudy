import { Fragment, useEffect } from 'react';
import MapSection from '@/components/home/MapSection';
import { Store } from '@/types/store';
import { NextPage } from 'next';
import useStores from '@/hooks/useStores';
import HomeHeader from '@/components/home/Header';

interface Props {
  stores: Store[];
}

const Home: NextPage<Props> = ({ stores }) => {
  const { initializeStores } = useStores();

  useEffect(() => {
    initializeStores(stores); // stores를 인자로 넣음
  }, [initializeStores, stores]);

  return (
    <Fragment>
      <HomeHeader />
      <main style={{ width: '100%', height: '100%' }}>
        <MapSection />
      </main>
    </Fragment>
  );
};

export default Home;

export async function getStaticProps() {
  // const stores = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/stores`,
  // ).then((response) => response.json());
  const stores = (await import('@/public/stores.json')).default;

  return {
    props: { stores },
    revalidate: 60 * 60,
  };
}
