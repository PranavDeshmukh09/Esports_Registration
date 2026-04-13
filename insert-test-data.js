// insert-test-data.js - Add sample tournament registration data to MongoDB
import 'dotenv/config';
import mongoose from 'mongoose';
import Registration from './models/Registration.js';

async function insertTestData() {
  console.log('\n==================================================');
  console.log('📝 Inserting Test Data to MongoDB Atlas');
  console.log('==================================================\n');
  
  let uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env file!\n');
    return;
  }
  
  // Fix URI if needed
  if (uri.includes('/?') && !uri.includes('/bgmi')) {
    uri = uri.replace('/?', '/bgmi_tournament?');
  }
  
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    };
    
    await mongoose.connect(uri, options);
    console.log('✅ Connected to MongoDB Atlas!\n');
    
    // Sample test data
    const testRegistrations = [
      {
        teamName: 'Phoenix Squad',
        leaderName: 'Arjun Kumar',
        email: 'arjun@example.com',
        phone: '9876543210',
        instagram: '@arjun_gaming',
        playerIds: '1234567890,1234567891,1234567892,1234567893',
        leaderLevel: 65,
        paymentId: 'pay_test_001_' + Date.now(),
        orderId: 'order_test_001_' + Date.now(),
        amount: 200,
        status: 'PAID',
        whatsappGroupJoined: true,
        matchRoomId: 'ROOM123456',
        matchPassword: 'PASS@123'
      },
      {
        teamName: 'Blue Tigers',
        leaderName: 'Priya Singh',
        email: 'priya@example.com',
        phone: '9876543211',
        instagram: '@priya_bgmi',
        playerIds: '2234567890,2234567891,2234567892,2234567893',
        leaderLevel: 72,
        paymentId: 'pay_test_002_' + Date.now(),
        orderId: 'order_test_002_' + Date.now(),
        amount: 200,
        status: 'PAID',
        whatsappGroupJoined: true,
        matchRoomId: 'ROOM234567',
        matchPassword: 'PASS@456'
      },
      {
        teamName: 'Shadow Hunters',
        leaderName: 'Rahul Patel',
        email: 'rahul@example.com',
        phone: '9876543212',
        instagram: '@rahul_esports',
        playerIds: '3234567890,3234567891,3234567892,3234567893',
        leaderLevel: 58,
        paymentId: 'pay_test_003_' + Date.now(),
        orderId: 'order_test_003_' + Date.now(),
        amount: 200,
        status: 'PENDING'
      }
    ];
    
    console.log('📊 Inserting 3 test registrations...\n');
    
    const insertedDocs = await Registration.insertMany(testRegistrations);
    
    console.log(`✅ Successfully inserted ${insertedDocs.length} test registrations!\n`);
    
    insertedDocs.forEach((doc, index) => {
      console.log(`${index + 1}. Team: ${doc.teamName}`);
      console.log(`   Leader: ${doc.leaderName}`);
      console.log(`   Email: ${doc.email}`);
      console.log(`   Status: ${doc.status}`);
      console.log(`   Registered: ${doc.registrationDate.toLocaleString()}\n`);
    });
    
    // Show statistics
    const totalRegistrations = await Registration.countDocuments();
    const paidRegistrations = await Registration.countDocuments({ status: 'PAID' });
    const pendingRegistrations = await Registration.countDocuments({ status: 'PENDING' });
    
    console.log('📈 Database Statistics:');
    console.log(`   Total Registrations: ${totalRegistrations}`);
    console.log(`   Paid: ${paidRegistrations}`);
    console.log(`   Pending: ${pendingRegistrations}\n`);
    
    console.log('✨ Test data ready! You can now:');
    console.log('   1. Check MongoDB Atlas dashboard to see the data');
    console.log('   2. Test your API endpoints with this data');
    console.log('   3. Verify payment processing with PAID registrations\n');
    
  } catch (error) {
    console.error('❌ Error inserting test data:', error.message);
    console.error('\n📖 Full error:', error);
  } finally {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed\n');
    }
  }
  
  console.log('==================================================\n');
}

// Run the script
insertTestData();
