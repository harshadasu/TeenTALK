import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Clock, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { EmptyState } from '../../components/feedback/EmptyState';

export const SafetyModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await apiClient.get('/teen/modules');
        if (res.success) {
          setModules(res.data);
        }
      } catch (err) {
        console.error('Failed to load modules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'cyber_safety', label: 'Cyber Safety' },
    { id: 'safe_touch_boundaries', label: 'Personal Boundaries' },
    { id: 'anti_bullying', label: 'Anti-Bullying' },
    { id: 'emotional_wellbeing', label: 'Mental Health' },
    { id: 'posh_awareness', label: 'POSH Awareness' },
  ];

  const filteredModules = modules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner message="Loading safety curriculum..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Adolescent Safety Curriculum
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Self-paced, verified educational modules designed to keep you safe in physical and digital spaces.
        </p>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === c.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Module Grid */}
      {filteredModules.length === 0 ? (
        <EmptyState
          title="No modules match your query"
          description="Try selecting another category or changing your search keywords."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((m) => {
            const isCompleted = m.progress?.status === 'completed';
            const isInProgress = m.progress?.status === 'in_progress';

            return (
              <Card key={m.id} hoverEffect className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="primary">{m.category.replace(/_/g, ' ')}</Badge>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    ) : isInProgress ? (
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        In Progress
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{m.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{m.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {m.reading_time_mins} mins
                  </span>

                  <Link to={`/dashboard/teen/modules/${m.id}`}>
                    <Button variant={isCompleted ? 'outline' : 'primary'} size="sm" icon={ArrowRight}>
                      {isCompleted ? 'Review' : 'Start Reading'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
