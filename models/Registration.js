import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  playerId: String,
  playerName: String
});

const registrationSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    unique: false,
    index: true
  },
  leaderName: {
    type: String,
    required: [true, 'Leader name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  instagram: {
    type: String,
    required: [true, 'Instagram handle is required'],
    trim: true
  },
  playerIds: {
    type: String,
    required: true
  },
  leaderLevel: {
    type: Number,
    required: true,
    min: [40, 'Minimum level 40 required'],
    max: [100, 'Invalid level']
  },
  paymentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    default: 200
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'DISQUALIFIED'],
    default: 'PENDING',
    index: true
  },
  registrationDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  whatsappGroupJoined: {
    type: Boolean,
    default: false
  },
  matchRoomId: String,
  matchPassword: String,
  paymentDetails: {
    paymentMethod: String,
    bankReference: String,
    timestamp: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Create indexes for better query performance
registrationSchema.index({ email: 1 });
registrationSchema.index({ phone: 1 });
registrationSchema.index({ status: 1, registrationDate: -1 });

// Virtual for team display name
registrationSchema.virtual('displayName').get(function() {
  return `${this.teamName} (${this.leaderName})`;
});

// Method to mark as disqualified
registrationSchema.methods.disqualify = async function(reason) {
  this.status = 'DISQUALIFIED';
  this.disqualificationReason = reason;
  return await this.save();
};

export default mongoose.model('Registration', registrationSchema);