// models/User.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const User = new mongoose.Schema({
  // Core Identity
  email: {
    type: String,
    required: function() { return !this.socialAuth?.googleId && !this.socialAuth?.facebookId }, // Required only for credential login
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email format']
  },

  // Credential Auth
  password: {
    type: String,
    minlength: 8,
    select: false,
    required: function() { return !this.socialAuth } // Only required for local auth
  },
  passwordChangedAt: Date,

  // Social Auth (OAuth)
  socialAuth: {
    googleId: { type: String, select: false },
  },

  // Two-Factor Authentication (2FA)
  twoFactorAuth: {
    enabled: { type: Boolean, default: false },
    method: { 
      type: String, 
      enum: [ 'email', null],
      default: null 
    },
    secret: { type: String, select: false }, // For TOTP apps
    phone: { // For SMS 2FA
      type: String,
      validate: [validator.isMobilePhone, 'Invalid phone number']
    },
    backupCodes: { // For recovery
      type: [String],
      select: false
    }
  },

  // Verification & Security
  isEmailVerified: { type: Boolean, default: false },
  verificationTokens: {
    email: String,
    emailExpires: Date,
    phone: String,
    phoneExpires: Date
  },
  lastLogin: {
    ip: String,
    device: String,
    timestamp: Date
  },
  loginHistory: [{
    ip: String,
    device: String,
    timestamp: Date,
    location: {
      country: String,
      city: String
    }
  }],

  // Account Protection
  failedLoginAttempts: { type: Number, default: 0, select: false },
  lockUntil: { type: Date, select: false },
  accountRecovery: {
    question: { type: String, select: false },
    answer: { type: String, select: false }
  }

}, { timestamps: true });

const userSchema=mongoose.model("crm-auth-be-user",User);
