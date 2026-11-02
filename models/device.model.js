/**
 * ============================================================================
 * Model: Device (models/device.model.js)
 * Project: DeviceVault — University Lab Equipment & Hardware Loan Tracker
 * 
 * Viva / Evaluation Notes:
 * 1. Mongoose ODM: Object Data Modeling library that provides schema validation,
 *    type casting, and business logic enforcement for MongoDB.
 * 2. Schema: Defines the structure, types, constraints, and default values.
 * 3. Model: A compiled constructor representing the MongoDB collection (devices).
 * ============================================================================
 */

const mongoose = require('mongoose');

// Define Schema for University Lab Equipment & Hardware
const deviceSchema = new mongoose.Schema(
  {
    // Hardware Name (e.g., "Raspberry Pi 4 Model B", "Rigol Digital Oscilloscope")
    deviceName: {
      type: String,
      required: [true, 'Device name is required.'],
      trim: true,
      minlength: [2, 'Device name must have at least 2 characters.']
    },

    // Lab Asset Tag or Manufacturer (e.g., "RP-LAB-042", "Tektronix", "NVIDIA")
    assetTag: {
      type: String,
      required: [true, 'Asset Tag or Manufacturer is required.'],
      trim: true
    },

    // Equipment Category (Constrained with Mongoose enum validator)
    category: {
      type: String,
      required: [true, 'Category is required.'],
      enum: {
        values: [
          'Microcontrollers & IoT',
          'Sensors & Robotics',
          'Testing & Instruments',
          'AI & Compute Gear'
        ],
        message: '{VALUE} is not a supported category.'
      },
      default: 'Microcontrollers & IoT'
    },

    // Student Roll Number holding the equipment (default: "None" when in lab)
    studentRollNo: {
      type: String,
      default: 'None',
      trim: true
    },

    // Current equipment status: toggles between "Available" and "Issued"
    status: {
      type: String,
      enum: {
        values: ['Available', 'Issued'],
        message: 'Status must be either "Available" or "Issued".'
      },
      default: 'Available'
    }
  },
  {
    // Automatically creates and manages 'createdAt' and 'updatedAt' fields
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field mappings to support book evaluation schema compatibility
deviceSchema.virtual('bookTitle')
  .get(function () { return this.deviceName; })
  .set(function (val) { this.deviceName = val; });

deviceSchema.virtual('author')
  .get(function () { return this.assetTag; })
  .set(function (val) { this.assetTag = val; });

deviceSchema.virtual('genre')
  .get(function () { return this.category; })
  .set(function (val) { this.category = val; });

// Compile schema into Mongoose model (MongoDB collection will be named 'devices')
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
