import { useContext } from 'react';
import Link from 'next/link';
import ShoppingCartContext from './context/cartContext';

function Navbar() {
  const { items } = useContext(ShoppingCartContext);
  const totalItems = Object.values(items).reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  return <div>{totalItems}</div>;
}
