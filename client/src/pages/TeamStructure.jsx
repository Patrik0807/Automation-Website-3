import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeamStructure() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            to="/ideas"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Team Structure
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-center"
        >
          <img
            src="/assets/team-structure.png"
            alt="Team Structure"
            className="max-w-full h-auto rounded-2xl shadow-lg border border-gray-200"
          />
        </motion.div>
      </div>
    </div>
  );
}