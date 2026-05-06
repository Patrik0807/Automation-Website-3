import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, PieChart as PieIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/ideas';

const COLORS = ['#EB0A1E', '#1F2937', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export default function Insights() {
  const [stats, setStats] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ideasRes] = await Promise.all([
          API.getStats(),
          API.getIdeas()
        ]);
        setStats(statsRes.data);
        setIdeas(ideasRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  const statusData = stats?.byStatus?.map(s => ({ name: s._id, value: s.count })) || [];
  const categoryData = stats?.byCategory?.map(c => ({ name: c._id, count: c.count })) || [];

  // Prepare per-project impact data
  const idCounts = {};
  const projectImpactData = ideas.map(idea => {
    let id = idea.customId || `WS-${String(idea._id).toUpperCase().slice(-6)}`;
    if (idCounts[id]) {
      idCounts[id]++;
      id = `${id} (${idCounts[id]})`;
    } else {
      idCounts[id] = 1;
    }
    return {
      name: id,
      hoursSaved: Number(idea.hoursSaved) || 0,
      costSaved: Number(idea.costSaved) || 0,
      title: idea.title
    };
  }).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  // Filtered data for specific charts (only show > 0)
  const hoursSavedData = projectImpactData.filter(d => d.hoursSaved > 0);
  const costSavedData = projectImpactData.filter(d => d.costSaved > 0);

  const BAR_SIZE = 48;
  const COLUMN_WIDTH = 80; 
  const categoryChartWidth = Math.max(100, categoryData.length * COLUMN_WIDTH);
  const hoursChartWidth = Math.max(100, hoursSavedData.length * COLUMN_WIDTH);
  const costChartWidth = Math.max(100, costSavedData.length * COLUMN_WIDTH);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            Idea Insights
          </h1>
          <p className="text-slate-500 mt-2 font-bold text-base">
            Key trends and performance metrics across submitted ideas.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Top Row: Status & Total Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-500" />
              Status Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={125}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Impact Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-2">Total Impact Summary</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Quantitative tracking of value delivered across the ecosystem.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
                <p className="text-primary-600 text-xs font-bold uppercase tracking-widest mb-1">Total Hours Saved</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats?.impact?.totalHours || 0}</span>
                  <span className="text-slate-500 font-bold text-sm">Hrs</span>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-1">Total Cost Savings</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">€{stats?.impact?.totalCost || 0}</span>
                  <span className="text-slate-500 font-bold text-sm">EUR</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full Width Panels */}
        <div className="space-y-8">
          {/* Category Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              Category Overview
            </h3>
            <div className="h-[350px] w-full overflow-x-auto">
               <div style={{ width: `${categoryChartWidth}px`, minWidth: '100%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} barCategoryGap={24}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={BAR_SIZE}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </motion.div>

          {/* Hours Saved Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              📊 Hours Saved per Project
            </h3>
            {hoursSavedData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400 font-medium">
                No projects with hours saved data yet.
              </div>
            ) : (
              <div className="h-[400px] w-full overflow-x-auto">
                <div style={{ width: `${hoursChartWidth}px`, minWidth: '100%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hoursSavedData} margin={{ bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [value, 'Hours Saved']}
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.title || label}
                      />
                      <Bar dataKey="hoursSaved" fill="#EB0A1E" radius={[6, 6, 0, 0]} barSize={BAR_SIZE} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </motion.div>

          {/* Cost Saved Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              💰 Cost Saved (EUR) per Project
            </h3>
            {costSavedData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400 font-medium">
                No projects with cost savings data yet.
              </div>
            ) : (
              <div className="h-[400px] w-full overflow-x-auto">
                <div style={{ width: `${costChartWidth}px`, minWidth: '100%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costSavedData} margin={{ bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `€${v}`} />
                      <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`€${value}`, 'Cost Saved']}
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.title || label}
                      />
                      <Bar dataKey="costSaved" fill="#10B981" radius={[6, 6, 0, 0]} barSize={BAR_SIZE} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
