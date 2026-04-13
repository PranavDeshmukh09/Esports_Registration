# 🎮 BGMI Tournament Registration Backend

A full-stack tournament registration platform for BGMI (Battlegrounds Mobile India) with payment integration using Razorpay and database management with MongoDB Atlas.

## ✨ Features

- **Team Registration** - Register teams with player details and leader information
- **Payment Processing** - Integrated Razorpay payment gateway for tournament fee collection
- **Admin Dashboard** - View all registrations and tournament statistics
- **Database Management** - MongoDB Atlas integration for scalable data storage
- **API-First Architecture** - RESTful API endpoints for all operations
- **Production Ready** - Deployed on Vercel with secure environment variables

## 🛠 Tech Stack

- **Backend**: Node.js with Express (Vercel Serverless Functions)
- **Database**: MongoDB Atlas
- **Payment Gateway**: Razorpay
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: Vercel
- **ODM**: Mongoose

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account
- Razorpay account

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/PranavDeshmukh09/Esports_Registration.git
cd bgmi-tournament
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=BgmiTournament
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Note**: If your password contains special characters, URL-encode them:
- `@` → `%40`
- `#` → `%23`
- etc.

### 4. Test Database Connection

```bash
node test-db.js
```

### 5. Insert Sample Data (Optional)

```bash
node insert-test-data.js
```

## 📁 Project Structure

```
bgmi-tournament/
├── api/                      # Vercel serverless functions
│   ├── register.js          # Team registration endpoint
│   ├── create-order.js      # Create Razorpay payment order
│   ├── verify-payment.js    # Verify payment and save registration
│   ├── teams.js             # Get all teams (admin only)
│   └── db.js                # MongoDB connection helper
├── models/
│   └── Registration.js       # Mongoose schema for registrations
├── index.html               # Frontend UI
├── package.json             # Dependencies
├── vercel.json              # Vercel configuration
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🔌 API Endpoints

### 1. Register Team
**POST** `/api/register`

Register a new team for the tournament.

```javascript
{
  "teamName": "Phoenix Squad",
  "leaderName": "Arjun Kumar",
  "email": "arjun@example.com",
  "phone": "9876543210",
  "instagram": "@arjun_gaming",
  "playerIds": "1234567890,1234567891,1234567892,1234567893",
  "leaderLevel": 65,
  "paymentId": "pay_xxxxx",
  "orderId": "order_xxxxx"
}
```

### 2. Create Payment Order
**POST** `/api/create-order`

Create a Razorpay payment order for tournament registration.

```javascript
// Response:
{
  "success": true,
  "orderId": "order_xxxxx",
  "amount": 20000,
  "currency": "INR",
  "key": "razorpay_key_id"
}
```

### 3. Verify Payment
**POST** `/api/verify-payment`

Verify Razorpay payment signature and save registration.

```javascript
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "teamData": { /* team details */ }
}
```

### 4. Get All Teams (Admin)
**GET** `/api/teams`

Get all registered teams (requires admin key in header).

```bash
curl -H "x-admin-key: TAALEEM_ADMIN_2025" https://your-domain.vercel.app/api/teams
```

**Response:**
```javascript
{
  "success": true,
  "stats": {
    "totalRegistrations": 3,
    "totalRevenue": 600,
    "paidRegistrations": 2
  },
  "registrations": [ /* array of registrations */ ]
}
```

## 📊 Database Schema

### Registration Model

```javascript
{
  teamName: String,           // Team name
  leaderName: String,         // Team leader contact name
  email: String,              // Leader email
  phone: String,              // Leader phone
  instagram: String,          // Team Instagram handle
  playerIds: String,          // Comma-separated BGMI player IDs
  leaderLevel: Number,        // BGMI account level (min: 40)
  paymentId: String,          // Razorpay payment ID
  orderId: String,            // Razorpay order ID
  amount: Number,             // Registration fee (₹200)
  status: String,             // PENDING | PAID | FAILED | REFUNDED | DISQUALIFIED
  registrationDate: Date,     // Auto-generated
  whatsappGroupJoined: Boolean, // Default: false
  matchRoomId: String,        // Match room ID
  matchPassword: String,      // Match password
  paymentDetails: {
    paymentMethod: String,
    bankReference: String,
    timestamp: Date
  },
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

## 🔐 Security Features

- ✅ Environment variables secured with `.gitignore`
- ✅ Sensitive credentials in `.env.local` (not committed)
- ✅ Admin key authentication for sensitive endpoints
- ✅ Razorpay signature verification for payments
- ✅ CORS enabled for cross-origin requests
- ✅ Input validation on all endpoints

## 💻 Development

### Local Development with Vercel

```bash
npm run dev
```

This runs `vercel dev` which emulates the Vercel environment locally.

### Database Testing

```bash
# Test connection
node test-db.js

# Insert test data
node insert-test-data.js
```

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub:
```bash
git add .
git commit -m "Your message"
git push origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Create new project from GitHub repository

4. Add environment variables:
   - `MONGODB_URI`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`

5. Deploy!

Your app will be live at: `https://your-project.vercel.app`

## 🧪 Testing

### Test Database Connection
```bash
node test-db.js
```

### Insert Test Data
```bash
node insert-test-data.js
```

### Check Git Status
```bash
git status
```

## 📝 Environment Variables

Create `.env` file with the following:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=BgmiTournament

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues or questions, please open a GitHub issue or contact the development team.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🎯 Roadmap

- [ ] User authentication & authorization
- [ ] Team profile pages
- [ ] Tournament schedule display
- [ ] Live match updates
- [ ] Leaderboard functionality
- [ ] Prize distribution tracking
- [ ] Email notifications
- [ ] SMS notifications

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Razorpay for payment processing
- Vercel for serverless deployment
- Node.js and Mongoose communities

---

**Made with ❤️ for the BGMI gaming community**