>💡 **CHAPTER 5**
>
>- 리액트 애플리케이션의 상태 관리에 있어 어려운 점은 데이터의 흐름이 단방향이라는 것. 부모 컴포넌트는 자식 컴포넌트에게 상태 전달할 수 있지만 반대로는 불가능
>- 지역 상태 관리
>- 콘텍스트 API를 사용한 애플리케이션 상태 관리

# 5-1. 지역 상태 관리

애플리케이션의 상태는 컴포넌트 스코프 상태를 의미(지역 상태), 다음과 같은 상황에서는 지역 상태만 관리하는 경우이다.

- **아톰 컴포넌트**

비교적 작은 크기의 지역 상태를 사용할 때 

- **로딩 상태**

http 응답 대기

# 5-2. 전역 상태 관리

여러 컴포넌트들이 공유하는 상태, 어떤 컴포넌트라도 접근 및 수정이 가능한 상태

- 라이브러리: Redux, Recoil, MobX
- 리액트 내부: context API
- Apollo 클라이언트와 메모리 캐시를 이용
    - 애플리케이션의 전역 데이터를 정형화된 질의언어로 다룬다는 새로운 관점

## 장바구니 기능 구현

1. 사용자가 장바구니에 하나 이상의 상품을 담으면 그 수를 내비게이션 바에 보여줌
2. 장바구니에 담은 물건을 구매하기로 결정하면 해당 상품을 결제 페이지에 나열

> 책에서는 context API와 순수 redux 두 가지 버전으로 설명하였으나, redux는 사용해보았고 context API를 한 번도 사용해 본 적이 없기에 context API만 정리함
> 

### context API

명시적으로 다른 컴포넌트에 속성값 형태로 데이터를 전달할 필요 없음, 자식 컴포넌트가 부모 컴포넌트에게 데이터를 공유할 수도 있다.

- data/items.js
    - 선택한 상품을 전역 상태에 저장할 때는 상태를 자바스크립트 객체로 저장하는 방법을 사용.
    - 각 속성은 상품 ID를 의미, 사용자가 담은 상품의 개수

```jsx
// 사용자가 당근 4개와 양파 2개를 담았을 때 상태 객체
export const items = {
  carrot: 4,
  onion: 2,
};
```

- components/context/cartContext.js
    - 장바구니를 위한 콘텍스트
    - 장바구니를 사용하는 모든 컴포넌트를 같은 콘텍스트로 감싼다. → Navbar.js컴포넌트나 ProductCard.js컴포는트는 모두 같은 콘텍스트 내에 마운트 되어야 함

```jsx
import { createContext } from 'react';

const ShoppingCartContext = createContext({
  items: {},
  setItems: () => null,
});

export default ShoppingCartContext;
```

- pages/_app.js
    - 다른 페이지로 이동하는 경우에도 전역 상태를 동일하게 유지할 수 있도록 → 결제 페이지로 이동해서도 사용자가 선택한 물건과 수량 표시

```jsx
import { useState } from 'react';
import Head from 'next/head';
import ShoppingCartContext from '@/components/context/cartContext';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  const [items, setItems] = useState({});

  return (
    **<ShoppingCartContext.Provider value={{ items, setItems }}>
      <Navbar />
      <div className='w-9/12 m-auto pt-10'>
        <Component {...pageProps} />
      </div>
    </ShoppingCartContext.Provider>**
  );
}

export default MyApp;
```

- pages/index.js
    - 상품 목록을 자바스크립트에서 가져옴

```jsx
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';

function Home() {
  return (
    <div className='grid grid-cols-4 gap-4'>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}

export default Home;
```

- ProductCard 컴포넌트에서 콘텍스트 사용하는 방법

```jsx
import React from 'react';
import { useContext } from 'react';
import ShoppingCartContext from './context/cartContext';

function ProductCard({ id, name, price, picture }) {
  const { setItems, items } = useContext(ShoppingCartContext);  // context 연결
  const productAmount = id in items ? items[id].amount : 0;     // 상품 수량 가져오고 싶을 때 

  return <div className='bg-gray-200 p-6 rounded-md'></div>;
}

export default ProductCard;
```

사용자가 + 버튼 클릭할 때마다 전역 items상태 객체의 값이 바뀌고 ProductCard 컴포넌트가 재렌더링되며 ProductAmount상수값이 새로운 값으로 바뀌게 됨

- + 또는 -버튼 클릭 시 처리 방법 코드
1. increment를 전달해서 호출하면 우선 전역 상태에 해당 상품이 있는지 확인, 초기 전역 상태가 값이 없는 빈 객체일 수도 있기 때문 → 해당 상품이 이미 있다면 상품 수량 하나 늘림
2. 상품이 없다면 items 객체에 해당 상품의 ID를 키 값으로 가지는 새로운 속성을 추가 → 그리고 그 값을 1로 지정
3. 인자가 decrement라면 똑같이 전역 상태 객체에 해당 상품이 있는지 확인 → 상품이 있고 수량이 0보다 크다면 값에서 1을 뺌 → 그 외의 경우는 상품 수량이 -가 될 수 없으므로 그냥 함수를 종료

```jsx
import React from 'react';
import { useContext } from 'react';
import ShoppingCartContext from './context/cartContext';

function ProductCard({ id, name, price, picture }) {
  const { setItems, items } = useContext(ShoppingCartContext); // context 연결
  const productAmount = items?.[id] ?? 0; // 상품 수량 가져오고 싶을 때 ?? 연산자

  const handleAmount = (action) => {
    if (action === 'increase') {
      const newItemAmount = id in items ? items[id] + 1 : 1;
      setItems({ ...items, [id]: newItemAmount });
    }
    if (action === 'decrease') {
      if (items?.[id] > 0) {
        setItems({ ...items, [id]: items[id] - 1 });
      }
    }
  };

  return (
    <div className='bg-gray-200 p-6 rounded-md'>
      <button onClick={() => handleAmount('decrease')}>-</button>
      <div>{productAmount}</div>
      <button onClick={() => handleAmount('increase')}>+</button>
    </div>
  );
}

export default ProductCard;
```

- Navbar에 상품 개수 구현
    - 전역 items 상태 객체를 수정할 일이 없기 때문에 setItems 함수를 사용하지 않음

```jsx
import { useContext } from 'react';
import Link from 'next/link';
import ShoppingCartContext from './context/cartContext';

function Navbar() {
  const { items } = useContext(ShoppingCartContext);
  const totalItems = Object.values(items).reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  return (
    <div>{totalItems}</div>
  )
}
```

- /pages/cart.js 페이지
    - 결제할 상품 목록을 표시하는 페이지 구현

```jsx
import React from 'react';
import { useContext } from 'react';
import ShoppingCartContext from '@/components/context/cartContext';
import products from '@/data/items';

/**
 *
 * @param {string} id 상품 id
 * @returns 상품 id로 해당 상품의 전체 정보를 담은 객체 반환
 */
function getFullItem(id) {
  const idx = products.findIndex((item) => item.id === id);
  return products[idx];
}

function cart(props) {
  const { items } = useContext(ShoppingCartContext);
  const total = Object.keys(items)
    .map((id) => getFullItem(id).price * items[id])
    .reduce((acc, cur) => acc + cur, 0); // 장바구니에 담긴 상품의 전체 가격 계산

  const amounts = Object.keys(items).map((id) => {
    const item = getFullItem(id);
    return { item, amount: items[id] }; // amounts라는 배열에 장바구니에 담은 상품들의 정보와 상품별 수량을 넣음
  });

  return (
    <div>
      <h1>Total: ${total}</h1>
      {amounts.map((item, amount) => {
        <div key={item.id}>
          x{amount} {item.name} (${amount * item.price})
        </div>;
      })}
    </div>
  );
}

export default cart;
```