import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Award,
  BookOpen,
  User,
  Heart,
  ChevronRight,
} from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const StoryPlayerPage = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [safetyScore, setSafetyScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(new Set());
  const [isFinished, setIsFinished] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const res = await apiClient.get('/teen/scenarios');
        if (res.success && res.data && res.data.length > 0) {
          setScenarios(res.data);
        } else {
          // Fallback if empty
          setScenarios([
            {
              id: 'scenario-01',
              title: 'The Mystery Gamer & The Secret Photo',
              target_age_group: '10-13',
              character: 'Maya, age 12',
              setup: 'Maya is playing her favorite multiplayer craft game. A player with a high-level badge named "GamerSam" offers her rare game gems if she joins a private Discord chat and sends a selfie showing her school uniform.',
              choices: [
                {
                  id: 'A',
                  text: 'Send the selfie because rare gems are hard to get and it is just a photo.',
                  feedback: 'Unsafe Choice! Never send personal photos or reveal your school uniform. People online can be impostors who misuse personal images.',
                  is_safe: false,
                },
                {
                  id: 'B',
                  text: 'Refuse firmly, take a screenshot, block GamerSam, and immediately show Mom or Dad.',
                  feedback: 'Hero Choice! You protected your personal privacy and alerted your trusted adult circle immediately.',
                  is_safe: true,
                },
                {
                  id: 'C',
                  text: 'Ask the gamer to send their photo first to see if they are real.',
                  feedback: 'Risky Choice! Online predators frequently use fake photos from the internet to trick people. Never negotiate personal information.',
                  is_safe: false,
                },
              ],
            },
          ]);
        }
      } catch (err) {
        console.warn('Scenarios fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const currentScenario = scenarios[currentIndex];

  const handleSelectChoice = (choice) => {
    if (selectedChoice) return; // Prevent changing after decision
    setSelectedChoice(choice);

    if (choice.is_safe) {
      setSafetyScore((prev) => prev + 100);
      showToast('Excellent decision! Safe boundary maintained.', 'success');
    } else {
      showToast('Learning moment! Read the safety guidance below.', 'warning');
    }

    setCompletedScenarios((prev) => new Set(prev).add(currentIndex));
  };

  const handleNext = () => {
    setSelectedChoice(null);
    if (currentIndex + 1 < scenarios.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setSafetyScore(0);
    setCompletedScenarios(new Set());
    setIsFinished(false);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <Card className="p-8 text-center space-y-6 border-slate-200 shadow-lg">
          <div className="w-20 h-20 rounded-3xl bg-mint-100 text-mint-700 mx-auto flex items-center justify-center">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="mint">Scenario Training Complete</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Outstanding Safety Awareness!
            </h2>
            <p className="text-sm text-slate-600">
              You navigated real-world digital dilemmas, protected personal boundaries, and demonstrated how to support peers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-lavender-50 border border-lavender-200 flex justify-around items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Safety Score</p>
              <p className="text-3xl font-black text-lavender-800">{safetyScore} PTS</p>
            </div>
            <div className="h-10 w-px bg-lavender-200" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scenarios Solved</p>
              <p className="text-3xl font-black text-mint-700">{scenarios.length} / {scenarios.length}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" /> Replay Stories
            </Button>
            <Link to="/modules">
              <Button variant="primary">
                Explore Core Safety Modules <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">Interactive Safety Stories</Badge>
            <span className="text-xs font-mono text-slate-500">
              Scenario {currentIndex + 1} of {scenarios.length}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Real-Life Decision Simulator
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-lavender-50 px-3 py-1.5 rounded-xl border border-lavender-200 text-lavender-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-lavender-600" />
          <span>{safetyScore} Safety Pts</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-lavender-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }}
        />
      </div>

      {/* Scenario Card */}
      {currentScenario && (
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200 shadow-md">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-lavender-100 text-lavender-700 flex items-center justify-center font-bold text-sm">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{currentScenario.title}</h3>
                <p className="text-xs text-slate-500">Character: {currentScenario.character}</p>
              </div>
            </div>
            <Badge variant="neutral">Ages {currentScenario.target_age_group}</Badge>
          </div>

          {/* Setup Narrative */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-normal">
            <p className="font-semibold text-slate-900 mb-1">The Situation:</p>
            {currentScenario.setup}
          </div>

          {/* Decision Prompt */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              What should {currentScenario.character.split(',')[0]} do?
            </h4>

            <div className="space-y-3">
              {currentScenario.choices.map((choice) => {
                const isSelected = selectedChoice?.id === choice.id;
                let choiceStyle = 'border-slate-200 hover:border-slate-300 bg-white';

                if (selectedChoice) {
                  if (isSelected) {
                    choiceStyle = choice.is_safe
                      ? 'border-mint-500 bg-mint-50 text-mint-900 ring-2 ring-mint-400'
                      : 'border-warmrose-500 bg-warmrose-50 text-warmrose-900 ring-2 ring-warmrose-400';
                  } else if (choice.is_safe) {
                    // Show correct choice softly if user picked wrong
                    choiceStyle = 'border-mint-300 bg-mint-50/40 text-slate-600';
                  } else {
                    choiceStyle = 'border-slate-200 opacity-50 bg-white';
                  }
                }

                return (
                  <div
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${choiceStyle}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? choice.is_safe
                            ? 'bg-mint-600 text-white'
                            : 'bg-warmrose-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {choice.id}
                    </div>
                    <div className="flex-1 text-xs sm:text-sm font-medium">
                      {choice.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Section */}
          {selectedChoice && (
            <div
              className={`p-5 rounded-2xl border flex items-start gap-3 animate-fadeIn ${
                selectedChoice.is_safe
                  ? 'bg-mint-50 border-mint-200 text-mint-900'
                  : 'bg-warmrose-50 border-warmrose-200 text-warmrose-900'
              }`}
            >
              {selectedChoice.is_safe ? (
                <ShieldCheck className="w-6 h-6 text-mint-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-warmrose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-bold">
                  {selectedChoice.is_safe ? 'Safe & Empowered Decision!' : 'Safety Guidance Alert'}
                </p>
                <p className="leading-relaxed">{selectedChoice.feedback}</p>
              </div>
            </div>
          )}

          {/* Next Button */}
          {selectedChoice && (
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="lg" onClick={handleNext}>
                {currentIndex + 1 < scenarios.length ? 'Next Story Scenario' : 'View Results'}
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
