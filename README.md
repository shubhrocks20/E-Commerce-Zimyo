# E-Commerce-Zimyo

An e-commerce platform built with a modern stack, offering user registration, product management, and order functionalities. The platform ensures a secure and interactive shopping experience through email verification, protected routes, and state management using Redux Toolkit.

## Features

### 1. User Registration and Authentication
- **Email Verification:**
  - Users must register with a valid email address.
  - A verification code is sent to the user's email for account activation using **Nodemailer**.
  - Only verified users can access the platform's features.
- **Validation:**
  - **Joi** is used to validate user input during registration and login, ensuring data integrity.
- **Login:**
  - Registered users can log in using their credentials.
  - Authentication is managed with JSON Web Tokens (JWT).

### 2. Product Management
- **Dashboard Access:**
  - Verified users can access the dashboard to view available products.
- **Product Creation:**
  - Authenticated users with the proper role can create new products.
  - **Multer** is used for handling file uploads.
  - Uploaded product images are stored in **Cloudinary** for efficient media management.
  - Product creation is secured through middleware that checks for valid JWTs.

### 3. Shopping Cart
- **Add to Cart:**
  - Users can add products to their cart.
- **Remove from Cart:**
  - Users can remove products from their cart.
- **State Management:**
  - Cart functionality is managed on the frontend using React and Redux Toolkit.

### 4. Order Management
- **Place Orders:**
  - Users can place orders for the products in their cart.
- **Order History:**
  - Users can view their order history, showing all previous orders.

---

## 🌟 Screenshots

![Home Page](https://github.com/user-attachments/assets/661eccd6-966e-46f2-a28b-9a2692ea0b50)
*Home page is only accessible to logged in user

![Login Page](https://github.com/user-attachments/assets/e3b84848-e5c9-4ef7-af16-1dfc4da4a41d)
*Login Page with validation

![Register Page](https://github.com/user-attachments/assets/bd6a6534-1ffe-4ef0-9efb-b965ec202069)
*Register Page with validation

![Cart and Order History](https://github.com/user-attachments/assets/bfbfecf1-2356-46e4-90da-0d3f0b4225d7)
*Cart page with order history record

![Shipping Details dialog](https://github.com/user-attachments/assets/b5356e8e-2adc-4e37-b5ca-4269c70fe9dd)
*Placing order dialog.


---

## Technologies Used

### Frontend
- **ReactJS** for building user interfaces.
- **Redux Toolkit** for state management.
- **Tailwind CSS** for styling the components.

### Backend
- **Node.js** and **Express.js** for server-side logic.
- **MongoDB** for data persistence.
- **JSON Web Token (JWT)** for secure authentication.
- **Multer** for handling file uploads.
- **Cloudinary** for image storage.
- **Nodemailer** for email verification.
- **Joi** for input validation.

### API Endpoints

#### User APIs
- **Register:** `POST /api/user/register`
- **Login:** `POST /api/user/login`
- **Get User Details:** `GET /api/user/me`
- **Place Order:** `POST /api/user/order`
- **Order History:** `GET /api/user/order-history`

#### Product APIs
- **Create Product:** `POST /api/product/create`
- **List Products:** `GET /api/product/list-product`

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shubhrocks20/E-Commerce-Zimyo.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd E-Commerce-Zimyo
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Setup environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=your_port_number
     BACKEND_DOMAIN=your_backend_domain
     JWT_SECRET=your_jwt_secret_key
     EMAIL_USER=your_email_address
     EMAIL_PASS=your_email_password
     MONGO_URI=your_mongodb_connection_string
     CLOUD_NAME=your_cloudinary_name
     CLOUD_API_KEY=your_cloudinary_api_key
     CLOUD_API_SECRET=your_cloudinary_api_secret
     ```

5. **Run the backend server:**
   ```bash
   npm run server
   ```

6. **Run the frontend:**
   ```bash
   npm start
   ```

## Usage

- **Register a new account** to start using the platform.
- **Verify your email** by entering the code sent to your registered email address.
- **Login** to access the dashboard and manage your shopping cart.
- **Add and remove products** from your cart, then place orders.
- **View your order history** to see previous purchases.

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

This project is licensed under the MIT License.
