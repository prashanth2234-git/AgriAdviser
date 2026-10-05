import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { advisoryService } from '../services/advisoryService';
import { AdvisoryRecord } from '@shared/types';
import { PageContainer } from '../components/layout/AppShell';
import { AdvisoryHeader } from '../components/results/AdvisoryHeader';
import { SummaryCard } from '../components/results/SummaryCard';
import { RiskAssessmentCard } from '../components/results/RiskAssessmentCard';
import { ActionPlanCard } from '../components/results/ActionPlanCard';
import { CropAssessmentCard } from '../components/results/CropAssessmentCard';
import { SoilAssessmentCard } from '../components/results/SoilAssessmentCard';
import { IrrigationCard } from '../components/results/IrrigationCard';
import { NutrientCard } from '../components/results/NutrientCard';
import { PestDiseaseCard } from '../components/results/PestDiseaseCard';
import { AssumptionsCard, FollowUpQuestionsCard } from '../components/results/AssumptionsCard';
import { Skeleton } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

export const AdvisoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [advisory, setAdvisory] = useState<AdvisoryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchAdvisory() {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await advisoryService.getAdvisoryById(id);
        if (isMounted) {
          setAdvisory(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err.message || 'Agricultural advisory record not found or you do not have permission to view it.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAdvisory();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <PageContainer className="pt-8 space-y-6">
        <Skeleton className="h-20 w-3/4" />
        <Skeleton className="h-44 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (error || !advisory) {
    return (
      <PageContainer maxWidth="sm" className="pt-16 text-center space-y-4">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Advisory Record Unavailable</h2>
        <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
          {error || 'The requested advisory record could not be found or has been deleted.'}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/history">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to History
            </Button>
          </Link>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-8 space-y-8">
      {/* Header */}
      <AdvisoryHeader advisory={advisory} />

      {/* Summary Card */}
      <SummaryCard
        summary={advisory.summary}
        question={advisory.request?.question || ''}
        confidence={advisory.confidence as any}
      />

      {/* Risk Matrix & Action Plan */}
      <div className="space-y-6">
        {advisory.risk_assessment && <RiskAssessmentCard riskData={advisory.risk_assessment} />}
        {advisory.action_plan && <ActionPlanCard actionPlan={advisory.action_plan} />}
      </div>

      {/* Detailed Agronomic Assessments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {advisory.crop_assessment && <CropAssessmentCard data={advisory.crop_assessment} />}
        {advisory.soil_assessment && <SoilAssessmentCard data={advisory.soil_assessment} />}
        {advisory.irrigation_recommendation && (
          <IrrigationCard data={advisory.irrigation_recommendation} />
        )}
        {advisory.nutrient_recommendation && <NutrientCard data={advisory.nutrient_recommendation} />}
      </div>

      {/* Pest and Disease Diagnostic Card (Full Width) */}
      {advisory.pest_disease_assessment && (
        <PestDiseaseCard data={advisory.pest_disease_assessment} />
      )}

      {/* Assumptions and Follow-up Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <AssumptionsCard assumptions={advisory.assumptions} />
        <FollowUpQuestionsCard questions={advisory.follow_up_questions} />
      </div>
    </PageContainer>
  );
};
