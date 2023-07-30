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
