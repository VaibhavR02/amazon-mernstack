import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '90d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); //Bearer XXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

export const payOrderEmailTemplate = (order) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
        line-height: 1.6;
      }

      .container {
        max-width: 800px;
        margin: 20px auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      h1 {
        color: #0056b3;
        font-size: 24px;
        text-align: center;
      }

      h2 {
        color: #007bff;
        font-size: 20px;
        margin-top: 20px;
      }

      p {
        font-size: 16px;
        margin: 10px 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      table,
      th,
      td {
        border: 1px solid #ddd;
      }

      th,
      td {
        padding: 10px;
        text-align: left;
      }

      th {
        background-color: #007bff;
        color: #fff;
      }

      tfoot td {
        font-weight: bold;
        background-color: #e9ecef;
      }

      tfoot td:first-child {
        text-align: left;
      }

      hr {
        border: 0;
        height: 1px;
        background: #ddd;
        margin: 30px 0;
      }

      .footer {
        text-align: center;
        font-size: 14px;
        color: #777;
        margin-top: 20px;
      }

      .footer a {
        color: #0056b3;
        text-decoration: none;
      }

      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Thanks for Shopping with Us</h1>
      <p>Hi ${order.user.name},</p>
      <p>We have finished processing your order,</p>
      <h2>
        [Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})
      </h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th align="right">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems .map( (item) => `
          <tr>
            <td>${item.name}</td>
            <td align="center">${item.quantity}</td>
            <td align="right">$${item.price.toFixed(2)}</td>
          </tr>
          ` ) .join("\n")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">Items Price:</td>
            <td align="right">$${order.itemsPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">Shipping Price:</td>
            <td align="right">$${order.shippingPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">Tax:</td>
            <td align="right">$${order.taxPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Total Price:</strong></td>
            <td align="right">
              <strong>$${order.totalPrice.toFixed(2)}</strong>
            </td>
          </tr>
          <tr>
            <td colspan="2">Payment Method:</td>
            <td align="right">${order.paymentMethod}</td>
          </tr>
        </tfoot>
      </table>
      <h2>Shipping Address</h2>
      <p>
        ${order.shippingAddress.fullName},<br />
        ${order.shippingAddress.address},<br />
        ${order.shippingAddress.city},<br />
        ${order.shippingAddress.country},<br />
        ${order.shippingAddress.postalCode}<br />
      </p>
      <hr />
      <p class="footer">
        Thanks for shopping with us. If you have any issues regarding your
        order, please contact our support team at
        <a href="mailto:vaibhavrandale800@gmail.com"
          >vaibhavrandale800@gmail.com</a
        >.
      </p>
    </div>
  </body>
</html>`;
};
