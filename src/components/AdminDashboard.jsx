import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, CheckCircle, XCircle, Clock, TrendingUp, 
  Building2, Download, Filter, Search, BarChart3, PieChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';
import { notificationService } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    const allBookings = bookingService.getAllBookings();
    setBookings(allBookings);
    
    const allUsers = authService.getAllUsers();
    setUsers(allUsers);
    
    const statistics = bookingService.getBookingStats();
    setStats(statistics);
  };

  const handleApprove = async (bookingId) => {
    const result = await bookingService.updateBookingStatus(bookingId, 'approved', null, user.id);
    if (result.success) {
      // Create notification for user
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        notificationService.notifyBookingApproved(booking.userId, booking);
      }
      loadData();
    }
  };

  const handleReject = async (bookingId, reason) => {
    const result = await bookingService.updateBookingStatus(bookingId, 'rejected', reason, user.id);
    if (result.success) {
      // Create notification for user
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        notificationService.notifyBookingRejected(booking.userId, booking, reason);
      }
      loadData();
    }
  };

  const handleExport = () => {
    const result = bookingService.exportBookings({}, 'csv');
    if (result.success) {
      const blob = new Blob([result.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.hall.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-indigo-200">Manage bookings, users, and analytics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-6 shadow-xl"
          >
            <Calendar className="w-8 h-8 mb-3" />
            <p className="text-sm opacity-90 mb-1">Total Bookings</p>
            <p className="text-4xl font-bold">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-6 shadow-xl"
          >
            <Clock className="w-8 h-8 mb-3" />
            <p className="text-sm opacity-90 mb-1">Pending Approval</p>
            <p className="text-4xl font-bold">{stats.pending}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-xl"
          >
            <CheckCircle className="w-8 h-8 mb-3" />
            <p className="text-sm opacity-90 mb-1">Approved</p>
            <p className="text-4xl font-bold">{stats.approved}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-xl"
          >
            <Users className="w-8 h-8 mb-3" />
            <p className="text-sm opacity-90 mb-1">Total Users</p>
            <p className="text-4xl font-bold">{users.length}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            {['overview', 'bookings', 'users', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-3 font-semibold capitalize transition-all ${
                  selectedTab === tab
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Bookings by Hall */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Bookings by Hall
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.byHall).map(([hall, count]) => (
                      <div key={hall} className="flex items-center justify-between">
                        <span className="text-gray-700">{hall}</span>
                        <span className="font-bold text-indigo-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bookings by Department */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Bookings by Department
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.byDepartment).slice(0, 5).map(([dept, count]) => (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-gray-700">{dept}</span>
                        <span className="font-bold text-blue-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {selectedTab === 'bookings' && (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              {/* Bookings Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hall</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{booking.hall}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{booking.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{booking.timeFrom} - {booking.timeTo}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{booking.department}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(booking.id)}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(booking.id, 'Not approved')}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {selectedTab === 'users' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <div key={user.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">Role:</span>{' '}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'faculty' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </p>
                      {user.department && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Department:</span> {user.department}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Monthly Bookings
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.byMonth).slice(0, 6).map(([month, count]) => (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-gray-700">{month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{ width: `${(count / stats.total) * 100}%` }}
                            />
                          </div>
                          <span className="font-bold text-indigo-600 w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Status Distribution
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Approved', count: stats.approved, color: 'bg-green-500' },
                      { label: 'Pending', count: stats.pending, color: 'bg-yellow-500' },
                      { label: 'Rejected', count: stats.rejected, color: 'bg-red-500' },
                      { label: 'Cancelled', count: stats.cancelled, color: 'bg-gray-500' }
                    ].map(({ label, count, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-gray-700">{label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`${color} h-2 rounded-full`}
                              style={{ width: `${(count / stats.total) * 100}%` }}
                            />
                          </div>
                          <span className="font-bold text-blue-600 w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
