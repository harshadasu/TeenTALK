import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FilePlus, History, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Card, CardHeader } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';

export const EmployeeDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await apiClient.get('/complaints/my');
        if (res.success) {
          setComplaints(res.data);
        }
      } catch (err) {
        console.error('Failed to load complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading workplace safety portal..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <Badge variant="primary" className="bg-teal-500/20 text-teal-300 border-teal-500/30 mb-3">
            ⚖️ POSH Workplace Protection
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Employee & Intern Redressal Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
            You have the fundamental right to a safe, respectful, and harassment-free workplace. You can submit
            confidential POSH complaints or track existing inquiries with total privacy.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/file-complaint">
              <Button variant="primary" size="sm" icon={FilePlus}>
                File Confidential Report
              </Button>
            </Link>
            <Link to="/track-complaint">
              <Button variant="outline" size="sm" icon={History} className="text-white border-slate-600 hover:bg-slate-800">
                Track by Case Code
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* POSH Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-2">Confidential & Impartial</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All complaints are investigated strictly by an Internal Committee (IC) adhering to statutory POSH
            guidelines and timelines.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-2">Protected Evidence Storage</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Uploaded screenshots, emails, and call logs are securely encrypted and never exposed to unauthorized
            parties or public URLs.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-2">Non-Retaliation Policy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict institutional safeguards protect complainants and witnesses against any form of employment or
            grade retaliation.
          </p>
        </Card>
      </div>

      {/* My Submitted Complaints */}
      <Card className="p-6">
        <CardHeader
          title="My Filed Inquiries"
          subtitle="Non-anonymous complaints submitted from your verified account"
          action={
            <Link to="/file-complaint">
              <Button variant="outline" size="sm" icon={FilePlus}>
                New Incident
              </Button>
            </Link>
          }
        />

        {complaints.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            You have not submitted any non-anonymous complaints from this account.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <div key={c.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                      {c.tracking_code}
                    </span>
                    <Badge variant={c.severity === 'critical' || c.severity === 'high' ? 'danger' : 'neutral'}>
                      {c.category.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Reported on {new Date(c.created_at).toLocaleDateString()} • {c.evidence_count} evidence attached
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="primary">{c.status.replace(/_/g, ' ')}</Badge>
                  <Link to={`/track-complaint?code=${c.tracking_code}`}>
                    <Button variant="ghost" size="sm" icon={ArrowRight}>
                      View Status
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
