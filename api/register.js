import { connectToDatabase } from './db.js';
import Registration from '../models/Registration.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      await connectToDatabase();
      const registrations = await Registration.find({}).sort({ registrationDate: -1 });
      return res.status(200).json({ success: true, data: registrations });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch registrations' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    const registration = new Registration(req.body);
    await registration.save();
    
    res.status(201).json({
      success: true,
      message: 'Registration saved successfully',
      data: registration
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to save registration', details: error.message });
  }
}