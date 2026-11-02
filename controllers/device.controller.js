/**
 * ============================================================================
 * Controller: Device Controller (controllers/device.controller.js)
 * Project: DeviceVault — University Lab Equipment & Hardware Loan Tracker
 * 
 * HTTP Status Codes Used:
 * - 200 OK: Successful fetch, update, or deletion
 * - 201 Created: New record successfully stored in MongoDB
 * - 400 Bad Request: Missing required fields or schema validation failure
 * - 404 Not Found: Requested record does not exist in MongoDB
 * - 500 Internal Server Error: Database failure or unexpected error
 * ============================================================================
 */

const mongoose = require('mongoose');
const Device = require('../models/device.model');

// In-memory fallback storage for offline university evaluations & quick demonstrations
let inMemoryStore = [
  {
    _id: '672000000000000000000001',
    deviceName: 'Raspberry Pi 4 Model B (4GB)',
    assetTag: 'RP-LAB-042',
    category: 'Microcontrollers & IoT',
    studentRollNo: '21BCSE104',
    status: 'Issued',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '672000000000000000000002',
    deviceName: 'Rigol DS1054Z Digital Oscilloscope',
    assetTag: 'RIGOL-EE-105',
    category: 'Testing & Instruments',
    studentRollNo: 'None',
    status: 'Available',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '672000000000000000000003',
    deviceName: 'Meta Quest 2 VR Headset',
    assetTag: 'VR-LAB-019',
    category: 'AI & Compute Gear',
    studentRollNo: '21BCSE189',
    status: 'Issued',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '672000000000000000000004',
    deviceName: 'Arduino Uno Rev3 Starter Kit',
    assetTag: 'ARD-KIT-007',
    category: 'Microcontrollers & IoT',
    studentRollNo: 'None',
    status: 'Available',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Normalizes incoming request body:
 * Maps either device fields (deviceName, assetTag, category)
 * or book fields (bookTitle, author, genre) to ensure complete compatibility.
 */
function normalizePayload(body) {
  const data = { ...body };

  if (!data.deviceName && data.bookTitle) {
    data.deviceName = data.bookTitle;
  }
  if (!data.assetTag && data.author) {
    data.assetTag = data.author;
  }
  if (!data.category && data.genre) {
    data.category = data.genre;
  }

  // If status is changed to Available, ensure roll number resets to None if not provided
  if (data.status === 'Available' && !data.studentRollNo) {
    data.studentRollNo = 'None';
  }

  return data;
}

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * 1. CREATE A NEW RECORD
 * Route: POST /api/devices (or /api/books)
 * Creates a new hardware/book document in MongoDB.
 */
const createDevice = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);

    if (!payload.deviceName || !payload.assetTag) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: "deviceName" (or "bookTitle") and "assetTag" (or "author") are required.'
      });
    }

    if (isDbConnected()) {
      const newDevice = await Device.create(payload);
      return res.status(201).json({
        success: true,
        message: 'Record successfully registered in MongoDB Atlas.',
        data: newDevice
      });
    }

    // Fallback in-memory storage mode
    const fakeId = new mongoose.Types.ObjectId().toString();
    const newRecord = {
      _id: fakeId,
      deviceName: payload.deviceName,
      assetTag: payload.assetTag,
      category: payload.category || 'Microcontrollers & IoT',
      studentRollNo: payload.studentRollNo || 'None',
      status: payload.status || 'Available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inMemoryStore.unshift(newRecord);
    return res.status(201).json({
      success: true,
      message: 'Record successfully registered (Local Mode).',
      data: newRecord
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(' ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while creating record.',
      error: error.message
    });
  }
};

/**
 * 2. READ ALL RECORDS
 * Route: GET /api/devices (or /api/books)
 * Fetches all documents sorted by newest first (createdAt: -1).
 */
const getAllDevices = async (req, res) => {
  try {
    if (isDbConnected()) {
      const devices = await Device.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: devices.length,
        source: 'MongoDB Atlas',
        data: devices
      });
    }

    // Return in-memory items
    return res.status(200).json({
      success: true,
      count: inMemoryStore.length,
      source: 'In-Memory Store (Connect Atlas for permanent storage)',
      data: inMemoryStore
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve records.',
      error: error.message
    });
  }
};

/**
 * 3. READ A SINGLE RECORD BY ID
 * Route: GET /api/devices/:id (or /api/books/:id)
 * Fetches one document by its MongoDB ObjectId.
 */
const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid MongoDB ObjectId format: ${id}`
      });
    }

    if (isDbConnected()) {
      const device = await Device.findById(id);
      if (!device) {
        return res.status(404).json({
          success: false,
          message: `Record not found with ID: ${id}`
        });
      }
      return res.status(200).json({
        success: true,
        data: device
      });
    }

    const item = inMemoryStore.find(d => d._id === id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Record not found with ID: ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve record by ID.',
      error: error.message
    });
  }
};

/**
 * 4. UPDATE A RECORD
 * Route: PUT /api/devices/:id (or /api/books/:id)
 * Updates an existing document (e.g., Issue to student roll number or Return to lab).
 */
const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid MongoDB ObjectId format: ${id}`
      });
    }

    const updatePayload = normalizePayload(req.body);

    if (isDbConnected()) {
      const updatedDevice = await Device.findByIdAndUpdate(
        id,
        updatePayload,
        { new: true, runValidators: true }
      );

      if (!updatedDevice) {
        return res.status(404).json({
          success: false,
          message: `Cannot update. Record not found with ID: ${id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Record successfully updated in MongoDB Atlas.',
        data: updatedDevice
      });
    }

    const index = inMemoryStore.findIndex(d => d._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Cannot update. Record not found with ID: ${id}`
      });
    }

    inMemoryStore[index] = {
      ...inMemoryStore[index],
      ...updatePayload,
      updatedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Record successfully updated.',
      data: inMemoryStore[index]
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(' ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update record.',
      error: error.message
    });
  }
};

/**
 * 5. DELETE A RECORD
 * Route: DELETE /api/devices/:id (or /api/books/:id)
 * Permanently removes a document from MongoDB.
 */
const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid MongoDB ObjectId format: ${id}`
      });
    }

    if (isDbConnected()) {
      const deletedDevice = await Device.findByIdAndDelete(id);

      if (!deletedDevice) {
        return res.status(404).json({
          success: false,
          message: `Cannot delete. Record not found with ID: ${id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Record '${deletedDevice.deviceName}' successfully deleted from MongoDB Atlas.`,
        data: deletedDevice
      });
    }

    const index = inMemoryStore.findIndex(d => d._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Cannot delete. Record not found with ID: ${id}`
      });
    }

    const removed = inMemoryStore.splice(index, 1)[0];
    return res.status(200).json({
      success: true,
      message: `Record '${removed.deviceName}' successfully deleted.`,
      data: removed
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete record.',
      error: error.message
    });
  }
};

module.exports = {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice
};
