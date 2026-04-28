import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VoiceIdeas() {
  return (
    // <div className="min-h-screen bg-gray-50 pb-12">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-20">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-1 bg-primary-600 rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-600">Warehousing Domain</span>
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            VOICE Ideas
          </h1>
          
        </div>
        </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex justify-center"
        >
          <img 
            src="/assets/voice-ideas.jpg" 
            alt="VOICE Ideas" 
            className="max-w-full h-auto rounded-2xl shadow-lg border border-gray-200"
          />
        </motion.div>
      </div>
    </div>
  );
}
