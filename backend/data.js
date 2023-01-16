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
