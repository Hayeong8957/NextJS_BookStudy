// graphQL + Apollo 사용
import '@/styles/globals.css';
import { useApollo } from '@/lib/apollo';
import { ApolloProvider } from '@apollo/client';

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState || {});

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

// context api예제
// import { useState } from 'react';
// import Head from 'next/head';
// import ShoppingCartContext from '@/components/context/cartContext';
// import Navbar from '../components/Navbar';

// function MyApp({ Component, pageProps }) {
//   const [items, setItems] = useState({});

//   return (
//     <ShoppingCartContext.Provider value={{ items, setItems }}>
//       <Navbar />
//       <div className='w-9/12 m-auto pt-10'>
//         <Component {...pageProps} />
//       </div>
//     </ShoppingCartContext.Provider>
//   );
// }

// export default MyApp;
