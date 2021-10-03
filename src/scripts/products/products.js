
const products = [
  {
    id: 1,
    name: 'White Long Dress With Train',
    price: 2285,
    image: img1,
    categories: ['Wedding Dresses', 'Jewelry'],
    popular: true
  },
  {
    id: 2,
    name: 'Black Classic Suit',
    price: 1855,
    image: img2,
    categories: ['Wedding Suits'],
    popular: true
  },
  {
    id: 3,
    name: 'Beautiful Glasses For Newlyweds',
    price: 168,
    image: img3,
    categories: ['Accessories'],
    popular: true
  },
  {
    id: 4,
    name: 'Candles For The Ceremony',
    price: 69,
    image: img4,
    categories: ['Decorations'],
    popular: true
  },
  {
    id: 5,
    name: 'White Long Dress With Train',
    price: 2795,
    image: img5,
    categories: ['Wedding Dresses'],
    popular: true
  },
  {
    id: 6,
    name: 'Navy Classic Suit',
    price: 1318,
    image: img6,
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
