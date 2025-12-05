import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Building2, Clock, ArrowRight } from 'lucide-react';

export default function HallBookingNew() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            ABES Hall Booking System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Book auditoriums and seminar halls with ease
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link
              to="/booking"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg inline-flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all inline-flex items-center gap-2"
            >
              View My Bookings
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Calendar, title: 'Easy Booking', desc: 'Book halls in just a few clicks' },
            { icon: Users, title: 'Real-time Availability', desc: 'Check hall availability instantly' },
            { icon: Clock, title: 'Quick Approval', desc: 'Get fast approval for your bookings' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Halls */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Available Halls</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Auditorium', capacity: 500 },
            { name: 'Seminar Hall 1', capacity: 100 },
            { name: 'Seminar Hall 2', capacity: 80 },
            { name: 'Seminar Hall 3', capacity: 60 },
            { name: 'Seminar Hall 4', capacity: 50 }
          ].map((hall, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl"
            >
              <Building2 className="w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-2">{hall.name}</h3>
              <p className="text-indigo-100">
                <Users className="inline w-5 h-5 mr-2" />
                Capacity: {hall.capacity} people
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
