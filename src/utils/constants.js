// ABES Hall Booking System Constants

export const HALLS = [
  { id: 1, name: 'Auditorium', capacity: 500, features: ['Projector', 'Sound System', 'AC', 'Stage'] },
  { id: 2, name: 'Seminar Hall 1', capacity: 100, features: ['Projector', 'AC', 'Whiteboard'] },
  { id: 3, name: 'Seminar Hall 2', capacity: 80, features: ['Projector', 'AC'] },
  { id: 4, name: 'Seminar Hall 3', capacity: 60, features: ['Whiteboard', 'AC'] },
  { id: 5, name: 'Seminar Hall 4', capacity: 50, features: ['Projector'] },
];

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Information Technology',
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const COLLEGE_INFO = {
  name: 'ABES Engineering College',
  address: 'Campus 1, 19th KM Stone, NH-24, Ghaziabad',
  email: 'info@abes.ac.in',
  phone: '+91-120-4003000',
};
