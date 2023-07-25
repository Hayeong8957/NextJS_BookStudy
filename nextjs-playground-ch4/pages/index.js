import { useQuery } from '@apollo/client';
import GET_LATEST_SIGNS from '@/lib/apollo/queries/getLatestSigns';
import Sign from '@/components/Sign';
import Loading from '@/components/Loading';
import Link from 'next/link';

function HomePage() {
  const { loading, data } = useQuery(GET_LATEST_SIGNS, {
    fetchPolicy: 'no-cache',
  });

  if (loading) return <Loading />;

  return (
    <div className='flex justify-center items-center flex-col mt-20'>
      <h1 className='text-3xl font-bold mb-5'>Hayeong's Next.js signbook</h1>
      <Link href='/new-sign'>
        <button className='mb-8 border-2 border-purple-800 p-2 rounded-lg text-purple-900 m-auto mt-4'>
          Add new sign
        </button>
      </Link>
      <div className='flex flex-wrap justify-center items-center mt-10'>
        {data?.sign.map((sign) => (
          <Sign key={sign.uuid} {...sign} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
