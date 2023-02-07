import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'vaibhav',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'rani',
      email: 'rani@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'IPhone 14 Pro Max',
      slug: 'iphone-pro-max',
      category: 'Mobiles',
      image: '/images/Iphone1.jpg',
      price: 500,
      countInStock: 25,
      brand: 'Apple',
      rating: 5,
      numReviews: 3,
      description:
        'Cinematic mode adds shallow depth of field and shifts focus automatically in your videos Advanced dual-camera system with 12MP Wide and Ultra Wide cameras; Photographic Styles, Smart HDR 4, Night mode, 4K Dolby Vision HDR recording 12MP TrueDepth front camera with Night mode, 4K Dolby Vision HDR recording A15 Bionic chip for lightning-fast performance',
    },
    {
      name: 'Pearl Jhumka',
      slug: 'peral-jhumki-jhumki-earing',
      category: 'Jwellery',
      image: '/images/j1.jpg',
      price: 1500,
      countInStock: 25,
      brand: 'Pearl',
      rating: 5,
      numReviews: 3,
      description: 'High class Earings ',
    },
    {
      name: 'Redbull 4×250ml pack',
      slug: 'redbull-energy-drink',
      category: 'Drinks',
      image: '/images/b1.jpg',
      price: 500,
      countInStock: 25,
      brand: 'Redbull',
      rating: 5,
      numReviews: 3,
      description: 'RED BULL GIVES YOU WINGS ',
    },

    {
      name: 'Firebolt smart watch',
      slug: 'firebolt-smart-watch',
      category: 'watches',
      image: '/images/watch1.jpg',
      price: 1000,
      countInStock: 25,
      brand: 'Firebolt',
      rating: 5,
      numReviews: 34,
      description: 'high quality watch ',
    },
    {
      name: 'Nike Slim Shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      name: 'Adidas Slim Shirt',
      slug: 'adidas-slim-shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 220,
      countInStock: 0,
      brand: 'Adidas',
      rating: 4.0,
      numReviews: 10,
      description: 'high quality peoduct',
    },
    {
      name: 'Adidas Slim Pant',
      slug: 'adidas-slim-pant',
      category: 'Pants',
      image: '/images/p3.jpg',
      price: 2220,
      countInStock: 10,
      brand: 'Adidas',
      rating: 3.5,
      numReviews: 14,
      description: 'high quality pant ',
    },
    {
      name: 'Nike Slim Pant',
      slug: 'nike-slim-pant',
      category: 'Pants',
      image: '/images/p4.jpg',
      price: 2220,
      countInStock: 15,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 34,
      description: 'high quality pant ',
    },
  ],
};

export default data;
