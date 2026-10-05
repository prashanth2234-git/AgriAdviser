import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  PlusCircle,
  AlertTriangle,
  History,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { advisoryService } from '../services/advisoryService';
import { DashboardSummary, AdvisoryRecord } from '@shared/types';
import { PageContainer } from '../components/layout/AppShell';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentAdvisoryCard } from '../components/dashboard/RecentAdvisoryCard';
import { RiskCard } from '../components/dashboard/RiskCard';
import { CropSummaryCard } from '../components/dashboard/CropSummaryCard';
import { EmptyState } from '../components/dashboard/EmptyState';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      try {
        setIsLoading(true);
        const data = await advisoryService.getDashboardSummary();
        if (isMounted) {
          setSummary(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard metrics');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageContainer className="pt-8 space-y-8">
      {/* Welcome & CTA banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-agri-800 via-agri-700 to-agri-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-agri-100 text-xs font-medium backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-agri-300" />
            <span>AI Agricultural Support System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Farmer'}
          </h1>
          <p className="text-xs sm:text-sm text-agri-100 max-w-xl leading-relaxed">
            {user?.location ? `Field context: ${user.location}` : 'Manage your field advisories and review agronomic risk signals.'}
            {user?.farm_size_acres ? ` • ${user.farm_size_acres} Acres managed` : ''}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Link to="/advisory/new">
            <Button
              className="bg-white text-agri-900 hover:bg-stone-100 shadow-md font-bold"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Request Advisory
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Dashboard Error">
          {error}
        </Alert>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Advisories"
              value={summary?.totalAdvisories ?? 0}
              subtitle="All completed AI assessments"
              icon={<History className="w-6 h-6" />}
              variant="green"
            />
            <StatCard
              title="Crops Monitored"
              value={summary?.cropsAnalyzed.length ?? 0}
              subtitle="Distinct crop varieties tracked"
              icon={<Sprout className="w-6 h-6" />}
              variant="earth"
            />
            <StatCard
              title="High Risk Alerts"
              value={summary?.highRiskAdvisoriesCount ?? 0}
              subtitle="Require immediate intervention"
              icon={<AlertTriangle className="w-6 h-6" />}
              variant={summary?.highRiskAdvisoriesCount ? 'rose' : 'green'}
            />
            <StatCard
              title="Healthy Assessments"
              value={summary?.riskBreakdown ? summary.riskBreakdown.low + summary.riskBreakdown.medium : 0}
              subtitle="Within normal agronomic bounds"
              icon={<ShieldCheck className="w-6 h-6" />}
              variant="green"
            />
          </>
        )}
      </div>

      {/* Middle Grid: Risk spectrum & Crop tags */}
      {summary && summary.totalAdvisories > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RiskCard breakdown={summary.riskBreakdown} />
          </div>
          <div>
            <CropSummaryCard crops={summary.cropsAnalyzed} />
          </div>
        </div>
      )}

      {/* Recent Advisories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Recent Advisories</h2>
            <p className="text-xs text-stone-500">Your latest field recommendations and action plans</p>
          </div>
          {summary && summary.totalAdvisories > 0 && (
            <Link
              to="/history"
              className="text-xs font-semibold text-agri-600 hover:text-agri-700 flex items-center gap-1"
            >
              <span>View All History</span>
              <span>→</span>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>
        ) : summary && summary.recentAdvisories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.recentAdvisories.map((advisory: AdvisoryRecord) => (
              <RecentAdvisoryCard key={advisory.id} advisory={advisory} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </PageContainer>
  );
};
