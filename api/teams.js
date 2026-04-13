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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple admin key authentication (you can improve this)
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== 'TAALEEM_ADMIN_2025') {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  try {
    await connectToDatabase();
    
    const registrations = await Registration.find({})
      .sort({ registrationDate: -1 })
      .select('-__v');
    
    const stats = {
      totalRegistrations: registrations.length,
      totalRevenue: registrations.length * 200,
      paidRegistrations: registrations.filter(r => r.status === 'PAID').length,
      recentRegistrations: registrations.slice(0, 10)
    };
    
    res.status(200).json({
      success: true,
      stats,
      registrations
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
}