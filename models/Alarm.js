// Simple model for Alarm data

/**
 * Alarm model structure:
 * @typedef {Object} Alarm
 * @property {string} id - Unique identifier
 * @property {string} time - Time in HH:MM format
 * @property {string} label - Alarm label
 * @property {Object} days - Days of the week
 * @property {boolean} days.monday - Monday status
 * @property {boolean} days.tuesday - Tuesday status
 * @property {boolean} days.wednesday - Wednesday status
 * @property {boolean} days.thursday - Thursday status
 * @property {boolean} days.friday - Friday status
 * @property {boolean} days.saturday - Saturday status
 * @property {boolean} days.sunday - Sunday status
 * @property {boolean} isActive - Alarm active status
 */

/**
 * Create an empty alarm with default values
 * @returns {Alarm} A new alarm with default values
 */
export const createEmptyAlarm = () => ({
  id: Date.now().toString(),
  time: '08:00',
  label: 'Alarm',
  days: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
  isActive: true,
}); 