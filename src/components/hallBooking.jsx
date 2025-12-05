import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Calendar,
  Info,
  LogIn,
  UserPlus,
  ChevronRight,
  Heart,
  Menu,
  X,
  Home,
  BookOpen,
  Settings,
  HelpCircle,
  Users,
  Building2,
  CheckCircle,
  Star,
  Quote,
  ChevronDown,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return (
    <span ref={ref} className="font-bold text-4xl md:text-5xl">
      {count}{suffix}
    </span>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div
      className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
      initial={false}
    >
      <button
        className="w-full p-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <span className="font-semibold text-gray-800 pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-indigo-600 flex-shrink-0" size={24} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Sidebar Link Component
const SidebarLink = ({ icon, text, href }) => (
  <li>
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all group"
    >
      <span className="text-indigo-300 group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="group-hover:translate-x-1 transition-transform">
        {text}
      </span>
    </a>
  </li>
);

const HallBooking = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "HOD, Computer Science",
      image: "👨‍🏫",
      text: "The hall booking system has streamlined our event management process. It is now much easier to coordinate department seminars and workshops.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Student Council President",
      image: "👩‍🎓",
      text: "As a student organizer, this platform has been a game-changer. No more confusion about hall availability or booking conflicts!",
      rating: 5,
    },
    {
      name: "Prof. Amit Verma",
      role: "Faculty Coordinator",
      image: "👨‍💼",
      text: "Excellent system! The approval process is transparent, and I can track all bookings in real-time. Highly recommended!",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How do I book a hall for my event?",
      answer:
        "Simply register or login to your account, navigate to the booking page, select your preferred hall, date, and time slot, then fill in the event details. Your booking will be sent for approval to the admin.",
    },
    {
      question: "What is the approval process for hall bookings?",
      answer:
        "Once you submit a booking request, it goes to the admin/faculty coordinator for review. They will verify the details and either approve or reject the booking. You will receive a notification about the status.",
    },
    {
      question: "Can I cancel or modify my booking?",
      answer:
        "Yes, you can cancel your booking from your dashboard before the event date. For modifications, please cancel the existing booking and create a new one, or contact the admin directly.",
    },
    {
      question: "How far in advance can I book a hall?",
      answer:
        "You can book a hall up to 3 months in advance. This ensures that all departments and students have fair access to the facilities for their events.",
    },
    {
      question: "What happens if there is a booking conflict?",
      answer:
        "The system automatically checks for conflicts when you select a date and time. If a slot is already booked, it will be shown as unavailable. This prevents double bookings.",
    },
  ];

  // Testimonial auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");
      if (
        isNavOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        menuButton &&
        !menuButton.contains(event.target)
      ) {
        setIsNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNavOpen]);

  // Lock body scroll when nav is open
  useEffect(() => {
    document.body.style.overflow = isNavOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isNavOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <motion.div
        id="main-header"
        className={\`sticky top-0 z-40 \${
          isScrolled ? "shadow-lg" : ""
        } transition-shadow duration-300\`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-3 md:p-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                id="menu-button"
                className="p-1 rounded-md hover:bg-white/20 transition-colors"
                onClick={() => setIsNavOpen(!isNavOpen)}
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
              <motion.img
                src="./abes.png"
                alt="College Logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div>
                <motion.h1
                  className="text-lg md:text-2xl font-bold tracking-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  ABES Engineering College
                </motion.h1>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                to="/login"
                className="text-white hover:text-indigo-200 transition-colors flex items-center gap-1 text-sm md:text-base bg-indigo-800/50 px-2 py-1 md:px-3 md:py-2 rounded-md hover:bg-indigo-800/70"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-indigo-200 transition-colors flex items-center gap-1 text-sm md:text-base bg-indigo-700 px-2 py-1 md:px-3 md:py-2 rounded-md hover:bg-indigo-600"
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsNavOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        id="sidebar"
        className="fixed left-0 top-0 bottom-0 w-64 md:w-72 bg-gradient-to-b from-indigo-900 to-purple-900 text-white z-50 shadow-xl overflow-y-auto"
        variants={sidebarVariants}
        initial="closed"
        animate={isNavOpen ? "open" : "closed"}
      >
        <div className="p-4 flex justify-between items-center border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <img src="./abes.png" alt="Logo" className="w-10 h-10 rounded-full" />
            <h2 className="font-bold text-lg">Hall Booking</h2>
          </div>
          <button
            onClick={() => setIsNavOpen(false)}
            className="p-1 rounded-md hover:bg-white/20 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5">
          <nav className="space-y-6">
            <div>
              <h3 className="text-xs uppercase text-indigo-300 font-semibold mb-2 tracking-wider">
                Main
              </h3>
              <ul className="space-y-2">
                <SidebarLink icon={<Home size={18} />} text="Home" href="#" />
                <SidebarLink icon={<Calendar size={18} />} text="Calendar" href="#" />
                <SidebarLink icon={<BookOpen size={18} />} text="Hall Details" href="#" />
                <SidebarLink icon={<Info size={18} />} text="About" href="#" />
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase text-indigo-300 font-semibold mb-2 tracking-wider">
                Support
              </h3>
              <ul className="space-y-2">
                <SidebarLink icon={<HelpCircle size={18} />} text="Help" href="#" />
                <SidebarLink icon={<Settings size={18} />} text="Settings" href="#" />
              </ul>
            </div>
          </nav>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="relative py-20 md:py-32 px-4 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              Welcome to ABES Hall Booking System
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Book Your Perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Event Space
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Seamlessly reserve seminar halls and auditoriums for your events, workshops,
            and conferences with our smart booking platform.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/booking"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <Calendar size={20} />
              Book Now
              <ChevronRight size={20} />
            </Link>
            <a
              href="#halls"
              className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <Info size={20} />
              Explore Halls
            </a>
          </motion.div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </motion.section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <Building2 className="text-indigo-600" size={40} />
              </div>
              <div className="text-indigo-600 mb-2">
                <AnimatedCounter end={12} suffix="+" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Total Halls</h3>
              <p className="text-gray-600 mt-2">Premium venues for all events</p>
            </motion.div>

            <motion.div
              className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                <CheckCircle className="text-purple-600" size={40} />
              </div>
              <div className="text-purple-600 mb-2">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Active Bookings</h3>
              <p className="text-gray-600 mt-2">Successfully hosted events</p>
            </motion.div>

            <motion.div
              className="text-center p-8 bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Users className="text-pink-600" size={40} />
              </div>
              <div className="text-pink-600 mb-2">
                <AnimatedCounter end={1200} suffix="+" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Happy Users</h3>
              <p className="text-gray-600 mt-2">Satisfied students & faculty</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-600 text-lg">
              Experience hassle-free hall booking with powerful features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock size={32} />,
                title: "Instant Booking",
                description: "Quick and easy reservation process with real-time availability",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: <Shield size={32} />,
                title: "Secure System",
                description: "Your data is protected with advanced security measures",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: <Zap size={32} />,
                title: "Smart Management",
                description: "Automated approvals and conflict detection for smooth operations",
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div
                  className={\`inline-block p-4 bg-gradient-to-r \${feature.color} text-white rounded-xl mb-4 group-hover:scale-110 transition-transform\`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-indigo-200 text-lg">
              Trusted by students, faculty, and administrators
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-2xl"
              >
                <Quote className="text-indigo-300 mb-6" size={48} />
                <p className="text-lg md:text-xl mb-6 leading-relaxed">
                  {testimonials[currentTestimonial].text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonials[currentTestimonial].image}</div>
                  <div>
                    <h4 className="font-bold text-lg">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-indigo-200">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={\`w-3 h-3 rounded-full transition-all \${
                    currentTestimonial === index
                      ? "bg-white w-8"
                      : "bg-white/30 hover:bg-white/50"
                  }\`}
                  aria-label={\`Go to testimonial \${index + 1}\`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Find answers to common questions about hall booking
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="./abes.png" alt="Logo" className="w-12 h-12 rounded-full" />
            <h3 className="text-2xl font-bold">ABES Engineering College</h3>
          </div>
          <p className="text-indigo-200 mb-6">
            Simplifying hall bookings for a better campus experience
          </p>
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="hover:text-indigo-300 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-indigo-300 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-indigo-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-indigo-300 transition-colors">
              Terms of Service
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 text-indigo-300">
            <span>Made with</span>
            <Heart className="fill-red-500 text-red-500" size={16} />
            <span>for ABES Community</span>
          </div>
          <p className="text-indigo-300 text-sm mt-4">
            © 2025 ABES Engineering College. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HallBooking;
