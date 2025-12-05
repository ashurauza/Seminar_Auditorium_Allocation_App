import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Filter, Search } from 'lucide-react';

export default function Dashboard() {
  const [filter, setFilter] = useState('all');
  const [bookings] = useState([
    {
      id: 1,
      hall: 'Auditorium',
      date: '2025-12-10',
      timeFrom: '09:00',
      timeTo: '12:00',
      status: 'approved',
      department: 'Computer Science',
      reason: 'Technical Workshop on AI'
    },
    {
      id: 2,
      hall: 'Seminar Hall 1',
      date: '2025-12-15',
      timeFrom: '14:00',
      timeTo: '17:00',
      status: 'pending',
      department: 'Electronics',
      reason: 'Project Presentation'
    },
    {
      id: 3,
      hall: 'Seminar Hall 2',
      date: '2025-12-08',
      timeFrom: '10:00',
      timeTo: '13:00',
      status: 'rejected',
      department: 'Mechanical',
      reason: 'Industry Expert Talk'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter((booking) => 
    filter === 'all' || booking.status === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">My Bookings Dashboard</h1>
          <p className="text-indigo-200">Track and manage your hall reservations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', count: bookings.length, color: 'from-blue-500 to-indigo-500' },
            { label: 'Approved', count: bookings.filter(b => b.status === 'approved').length, color: 'from-green-500 to-emerald-500' },
            { label: 'Pending', count: bookings.filter(b => b.status === 'pending').length, color: 'from-yellow-500 to-orange-500' },
            { label: 'Rejected', count: bookings.filter(b => b.status === 'rejected').length, color: 'from-red-500 to-pink-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${stat.color} text-white rounded-2xl p-6 shadow-xl`}
            >
              <p className="text-sm opacity-90 mb-1">{stat.label} Bookings</p>
              <p className="text-4xl font-bold">{stat.count}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="text-gray-600" />
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-900">{booking.hall}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{booking.timeFrom} - {booking.timeTo}</span>
                    </div>
                    <div className="col-span-2">
                      <strong>Department:</strong> {booking.department}
                    </div>
                    <div className="col-span-2">
                      <strong>Reason:</strong> {booking.reason}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No bookings found</p>
            <Link
              to="/booking"
              className="inline-block mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
            >
              Create New Booking
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
