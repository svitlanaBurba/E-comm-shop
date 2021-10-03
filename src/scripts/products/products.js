
const products = [
  {
    id: 1,
    name: 'White Long Dress With Train',
    price: 2285,
    image: './assets/products/white-dress.jpg',
    categories: ['Wedding Dresses', 'Jewelry'],
    popular: true
  },
  {
    id: 2,
    name: 'Black Classic Suit',
    price: 1855,
    image: './assets/products/black-wedding-suit.jpg',
    categories: ['Wedding Suits'],
    popular: true
  },
  {
    id: 3,
    name: 'Beautiful Glasses For Newlyweds',
    price: 168,
    image: './assets/products/wedding-glasses.jpg',
    categories: ['Accessories'],
    popular: true
  },
  {
    id: 4,
    name: 'Candles For The Ceremony',
    price: 69,
    image: './assets/products/wedding-candles.jpg',
    categories: ['Decorations'],
    popular: true
  },
  {
    id: 5,
    name: 'White Long Dress With Train',
    price: 2795,
    image: './assets/products/white-dress-train.jpg',
    categories: ['Wedding Dresses'],
    popular: true
  },
  {
    id: 6,
    name: 'Navy Classic Suit',
    price: 1318,
    image: './assets/products/navy-suit.jfif',
    categories: ['Wedding Suits', 'Wedding Shoes'],
    popular: true
  }
];

/* this is a hack to make webpack to load product images into a dist/asset folder
   in prod this would not be required as images would be sourced from external API
*/

import img1 from '../../assets/products/white-dress.jpg';
import img2 from '../../assets/products/black-wedding-suit.jpg';
import img3 from '../../assets/products/wedding-glasses.jpg';
import img4 from '../../assets/products/wedding-candles.jpg';
import img5 from '../../assets/products/white-dress-train.jpg';
import img6 from '../../assets/products/navy-suit.jfif';

export default products;
