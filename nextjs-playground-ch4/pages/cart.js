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
