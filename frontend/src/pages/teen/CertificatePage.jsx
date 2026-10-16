import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, ShieldCheck, Printer, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';

export const CertificatePage = () => {
  const { courseId } = useParams();
  const targetId = courseId || 'b0000001-0000-0000-0000-000000000001';
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await apiClient.get(`/certificate/generate/${targetId}`);
        if (res.success && res.data) {
          setCert(res.data);
        }
      } catch (err) {
        setError(err.message || 'Certificate Ineligible');
      } finally {
        setLoading(false);
      }
    };

    fetchCert();
  }, [targetId]);

  if (loading) {
    return <LoadingSpinner message="Validating cryptographic certificate..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        <AlertBanner
          type="warning"
          title="Certificate Ineligible"
          message={error}
          action={
            <Link to="/dashboard/teen/modules">
              <Button variant="primary" size="sm">
                Complete Modules
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-fade-in">
      <div className="flex items-center justify-between print:hidden">
        <Link
          to="/dashboard/teen"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
          Print / Save PDF
        </Button>
      </div>

      {/* Printable Certificate Frame */}
      <div className="bg-white border-8 border-double border-teal-800/80 rounded-3xl p-8 sm:p-14 text-center shadow-xl relative overflow-hidden print:border-teal-800 print:shadow-none">
        {/* Background watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
          <ShieldCheck className="w-96 h-96 text-teal-900" />
        </div>

        {/* Top Insignia */}
        <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-500/20">
          <Award className="w-9 h-9" />
        </div>

        <h3 className="text-xs font-extrabold uppercase tracking-widest text-teal-700 mb-1">
          TeenTalk National Safety Initiative
        </h3>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-6">
          Certificate of Competence & Safety Mastery
        </h1>

        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">This is formally awarded to</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-800 underline decoration-teal-300 underline-offset-8 mb-6 font-sans">
          {cert.student_name}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
          for successfully completing the rigorous curriculum and demonstrating mastery in{' '}
          <strong className="text-slate-900 font-bold">{cert.module_title}</strong> with an evaluated passing score of{' '}
          <strong className="text-teal-700 font-bold">{cert.score}%</strong>.
        </p>

        {/* Signatures & Code */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs">
          <div className="text-left">
            <p className="font-bold text-slate-800">Tejas Kulkarni & Team</p>
            <p className="text-slate-400 text-[11px]">Academic System Director</p>
            <p className="text-[10px] text-slate-400 mt-1">TeenTalk Global Network</p>
          </div>

          <div>
            <div className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-200 inline-block mb-1">
              {cert.certificate_code}
            </div>
            <p className="text-[10px] text-slate-400">
              Issued: {new Date(cert.issue_date).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-slate-800">Dr. Meera Joshi</p>
            <p className="text-slate-400 text-[11px]">Head of Adolescent Wellness</p>
            <p className="text-[10px] text-slate-400 mt-1">Accredited Counselor Board</p>
          </div>
        </div>

        {/* Cryptographic hash */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
          <Lock className="w-3 h-3 text-teal-600" />
          <span>SHA-256 Verification Digest: {cert.verification_hash.substring(0, 32)}...</span>
        </div>
      </div>
    </div>
  );
};
