import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Award, RotateCcw } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

export const QuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await apiClient.get(`/quiz/${id}`);
        if (res.success) {
          setQuiz(res.data);
        }
      } catch (err) {
        showToast('Failed to load quiz', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, showToast]);

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quiz.questions.length) {
      showToast(`Please answer all ${quiz.questions.length} questions before submitting.`, 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.post('/quiz/evaluate', {
        quiz_id: quiz.id,
        answers,
      });

      if (res.success && res.data) {
        setResult(res.data);
        if (res.data.passed) {
          showToast(`Congratulations! You passed with ${res.data.score}%!`, 'success');
        } else {
          showToast(`Score: ${res.data.score}%. Passing score is ${quiz.passing_score}%. Review and try again!`, 'warning');
        }
      }
    } catch (err) {
      showToast(err.message || 'Evaluation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Preparing safety assessment..." />;
  }

  if (!quiz) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800">Quiz not found</h2>
        <Link to="/dashboard/teen/modules" className="text-teal-600 underline text-sm mt-2 inline-block">
          Return to modules
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-teal-50 to-white border-teal-200">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="primary">Knowledge Check</Badge>
          <span className="text-xs text-slate-500">
            Passing Score: {quiz.passing_score}% • {quiz.questions.length} Questions
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">{quiz.title}</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">{quiz.description}</p>
      </Card>

      {/* Result Card if Submitted */}
      {result && (
        <Card
          className={`p-6 sm:p-8 border-2 ${
            result.passed ? 'border-emerald-400 bg-emerald-50/50' : 'border-amber-300 bg-amber-50/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  result.passed ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {result.passed ? <Award className="w-8 h-8" /> : <RotateCcw className="w-7 h-7" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {result.passed ? 'Assessment Passed!' : 'Needs Practice'}
                </h3>
                <p className="text-xs text-slate-600">
                  Your Score: <strong>{result.score}%</strong> ({result.correct_count} of{' '}
                  {result.total_questions} correct)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {result.passed && quiz.module_id && (
                <Link to={`/dashboard/teen/certificates/${quiz.module_id}`}>
                  <Button variant="primary" icon={Award}>
                    Claim Certificate
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                }}
              >
                Retake
              </Button>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Answer Review</h4>
            {result.breakdown.map((item, idx) => (
              <div
                key={item.question_id}
                className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900">Question {idx + 1}</span>
                  {item.is_correct ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1 font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>
                <p className="text-slate-700 font-medium">{item.question_text}</p>
                <p className="text-slate-500 text-[11px] pt-1">
                  <strong>Explanation:</strong> {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Questions Form */}
      {!result && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {quiz.questions.map((q, idx) => (
            <Card key={q.id} className="p-6 border-slate-200">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-2">
                Question {idx + 1} of {quiz.questions.length}
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-4">{q.question_text}</h3>

              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-1 ring-teal-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={submitting}>
            Submit Answers for Grading
          </Button>
        </form>
      )}
    </div>
  );
};
