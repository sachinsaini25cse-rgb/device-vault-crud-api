/**
 * Compatibility Controller: Book Controller (controllers/book.controller.js)
 * Maps university book evaluation handler names to Device Controller methods.
 */

const {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice
} = require('./device.controller');

module.exports = {
  createBook: createDevice,
  getAllBooks: getAllDevices,
  getBookById: getDeviceById,
  updateBook: updateDevice,
  deleteBook: deleteDevice,
  // Also expose device names
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice
};
