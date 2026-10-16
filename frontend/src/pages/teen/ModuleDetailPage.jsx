import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, Award, HelpCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

export const ModuleDetailPage = () => {
  const { id } = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiClient.get(`/teen/modules/${id}`);
        if (res.success) {
          setModuleData(res.data);
        }
      } catch (err) {
        showToast('Failed to load module details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, showToast]);

  const handleMarkComplete = async () => {
    setUpdating(true);
    try {
      const res = await apiClient.post('/teen/progress/update', {
        module_id: moduleData.id,
        status: 'completed',
        score: 100,
        time_spent_seconds: (moduleData.reading_time_mins || 5) * 60,
      });

      if (res.success) {
        showToast('Module marked as completed! You unlocked the test.', 'success');
        setModuleData((prev) => ({
          ...prev,
          progress: { ...prev.progress, status: 'completed', score: 100 },
        }));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update progress', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Opening safety module..." />;
  }

  if (!moduleData) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800">Module not found</h2>
        <Link to="/dashboard/teen/modules" className="text-teal-600 underline text-sm mt-2 inline-block">
          Return to modules
        </Link>
      </div>
    );
  }

  const isCompleted = moduleData.progress?.status === 'completed';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <Link
        to="/dashboard/teen/modules"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to all modules
      </Link>

      {/* Module Title Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50 border-slate-200">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="primary">{moduleData.category.replace(/_/g, ' ')}</Badge>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {moduleData.reading_time_mins} minutes read
          </span>
          {isCompleted && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {moduleData.title}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{moduleData.description}</p>
      </Card>

      {/* Module Content Article */}
      <Card className="p-6 sm:p-10 prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
        <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
          {moduleData.content}
        </div>
      </Card>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Finished reading?</h4>
          <p className="text-xs text-slate-500">
            Confirm your learning or take the module quiz to qualify for your certificate.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isCompleted ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleMarkComplete}
              isLoading={updating}
              icon={CheckCircle2}
              className="flex-1 sm:flex-initial"
            >
              Mark Completed
            </Button>
          ) : (
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Finished
            </div>
          )}

          {moduleData.quiz && (
            <Link to={`/dashboard/teen/quizzes/${moduleData.quiz.id}`}>
              <Button variant="secondary" size="md" icon={HelpCircle}>
                Take Quiz
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
