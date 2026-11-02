/**
 * ============================================================================
 * Routes: Device Router (routes/device.route.js)
 * Project: DeviceVault — University Lab Equipment & Hardware Loan Tracker
 * 
 * Maps HTTP Request Methods (Verbs) to Controller Functions:
 * - POST   /api/devices      -> Create a new device
 * - GET    /api/devices      -> Retrieve all devices
 * - GET    /api/devices/:id  -> Retrieve single device by ID
 * - PUT    /api/devices/:id  -> Update device / Issue or Return
 * - DELETE /api/devices/:id  -> Remove device record
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice
} = require('../controllers/device.controller');

// CRUD Route Definitions
router.post('/', createDevice);
router.get('/', getAllDevices);
router.get('/:id', getDeviceById);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

module.exports = router;
