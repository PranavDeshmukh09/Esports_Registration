// test-db.js - Fixed MongoDB Connection Test
import 'dotenv/config';
import mongoose from 'mongoose';

async function testConnection() {
  console.log('\n==================================================');
  console.log('🔍 Testing MongoDB Atlas Connection');
  console.log('==================================================\n');
  
  // Get URI from environment
  let uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env file!\n');
    console.log('📝 Please add to .env file:');
    console.log('MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@bgmitournament.7monrto.mongodb.net/bgmi_tournament?retryWrites=true&w=majority\n');
    return;
  }
  
  // Fix common URI issues
  if (uri.includes('/?') && !uri.includes('/bgmi')) {
    console.log('⚠️  Fixing connection string format...');
    uri = uri.replace('/?', '/bgmi_tournament?');
    console.log('✅ Fixed URI format\n');
  }
  
  // Remove trailing slash if present
  if (uri.endsWith('/')) {
    uri = uri.slice(0, -1) + '/bgmi_tournament';
  }
  
  // Ensure database name is present
  if (!uri.includes('/bgmi_tournament') && !uri.includes('/bgmi')) {
    uri = uri.replace('mongodb.net/', 'mongodb.net/bgmi_tournament');
  }
  
  // Mask password for display
  const maskedURI = uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
  console.log('📡 Connection string:', maskedURI);
  console.log('📚 Database: bgmi_tournament\n');
  
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip IPv6
    };
    
    await mongoose.connect(uri, options);
    
    console.log('✅ Successfully connected to MongoDB Atlas!\n');
    
    // Get connection info
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`📚 Connected to database: ${dbName}`);
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    if (collections.length > 0) {
      console.log('📂 Existing collections:', collections.map(c => c.name).join(', '));
    } else {
      console.log('📂 No collections found yet (ready for new registrations)');
    }
    
    // Test database operations
    console.log('\n🧪 Testing database operations...');
    
    // Create a test collection
    const testCollection = db.collection('_connection_test');
    const testDoc = {
      testId: Date.now(),
      message: 'Connection test successful',
      timestamp: new Date(),
      status: 'OK'
    };
    
    await testCollection.insertOne(testDoc);
    console.log('✅ Successfully wrote to database');
    
    // Read back the test data
    const result = await testCollection.findOne({ testId: testDoc.testId });
    console.log('✅ Successfully read from database');
    
    // Clean up
    await testCollection.drop();
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 SUCCESS! Your MongoDB connection is working perfectly!\n');
    console.log('💡 Next steps:');
    console.log('   1. Your database is ready for tournament registration');
    console.log('   2. Add Razorpay keys to .env file');
    console.log('   3. Deploy to Vercel');
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    
    // Helpful error messages
    if (error.message.includes('bad auth')) {
      console.error('\n🔧 FIX: Wrong username or password');
      console.error('   1. Go to MongoDB Atlas → Database Access');
      console.error('   2. Edit user or create new one');
      console.error('   3. Update password in .env file');
    }
    else if (error.message.includes('getaddrinfo') || error.message.includes('ENOTFOUND')) {
      console.error('\n🔧 FIX: Cannot reach MongoDB Atlas');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify cluster name in URI: bgmitournament.7monrto.mongodb.net');
    }
    else if (error.message.includes('Server selection timeout')) {
      console.error('\n🔧 FIX: Network access blocked');
      console.error('   1. Go to MongoDB Atlas → Network Access');
      console.error('   2. Click "Add IP Address"');
      console.error('   3. Add "0.0.0.0/0" (Allow from anywhere)');
      console.error('   4. Wait 1-2 minutes for changes to apply');
    }
    else if (error.message.includes('URI must include hostname')) {
      console.error('\n🔧 FIX: Invalid connection string format');
      console.error('   Your URI should look like:');
      console.error('   mongodb+srv://USERNAME:PASSWORD@bgmitournament.7monrto.mongodb.net/bgmi_tournament?retryWrites=true&w=majority');
    }
    
    console.error('\n📖 Full error:', error);
  } finally {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n🔌 Database connection closed');
    }
  }
  
  console.log('\n==================================================\n');
}

// Run the test
testConnection();