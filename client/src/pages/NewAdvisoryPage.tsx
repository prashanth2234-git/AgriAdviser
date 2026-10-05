import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { advisoryService } from '../services/advisoryService';
import { AdvisoryRequestInput, AdvisoryRequestInputSchema } from '@shared/schemas/advisory';
import { AdvisoryDomain, CropStage, WaterAvailability, FarmingMethod } from '@shared/constants';
import { PageContainer } from '../components/layout/AppShell';
import { FormProgress } from '../components/advisory/FormProgress';
import { DomainSelector } from '../components/advisory/DomainSelector';
import { FarmInformationForm } from '../components/advisory/FarmInformationForm';
import { CropInformationForm } from '../components/advisory/CropInformationForm';
import { SoilInformationForm } from '../components/advisory/SoilInformationForm';
import { IrrigationForm } from '../components/advisory/IrrigationForm';
import { SymptomsForm } from '../components/advisory/SymptomsForm';
import { QuestionForm } from '../components/advisory/QuestionForm';
import { AIProcessingState } from '../components/advisory/AIProcessingState';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

const STEPS = [
  'Domain Focus',
  'Farm & Season',
  'Crop Phenology',
  'Soil Characteristics',
  'Irrigation & Water',
  'Symptoms & Observations',
  'Specific Question',
];

export const NewAdvisoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form State initialized with user profile presets where available
  const [formData, setFormData] = useState<AdvisoryRequestInput>({
    domain: 'crop_management',
    cropName: user?.primary_crops?.[0] || '',
    cropStage: 'vegetative',
    location: user?.location || '',
    soilType: 'Alluvial Soil',
    soilPH: undefined,
    soilFertility: '',
    season: 'Rabi (Winter Sowing)',
    irrigationMethod: user?.irrigation_type || 'Drip Irrigation',
    waterAvailability: 'moderate',
    farmSize: user?.farm_size_acres ? Number(user.farm_size_acres) : undefined,
    farmingMethod: (user?.farming_method as FarmingMethod) || 'integrated',
    previousCrop: '',
    symptoms: '',
    pestObservations: '',
    diseaseObservations: '',
    weatherObservations: '',
    question: '',
    additionalContext: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev: AdvisoryRequestInput) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev: Record<string, string>) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.location || formData.location.trim().length < 2) {
        errors.location = 'Please specify your farm location/region';
      }
      if (!formData.season) {
        errors.season = 'Season selection is required';
      }
    } else if (currentStep === 2) {
      if (!formData.cropName || formData.cropName.trim().length === 0) {
        errors.cropName = 'Crop name and variety is required';
      }
      if (!formData.cropStage) {
        errors.cropStage = 'Crop stage selection is required';
      }
    } else if (currentStep === 3) {
      if (!formData.soilType) {
        errors.soilType = 'Soil type is required';
      }
      if (formData.soilPH !== undefined && (formData.soilPH < 0 || formData.soilPH > 14)) {
        errors.soilPH = 'Soil pH must be between 0 and 14';
      }
    } else if (currentStep === 4) {
      if (!formData.irrigationMethod) {
        errors.irrigationMethod = 'Irrigation method is required';
      }
      if (!formData.waterAvailability) {
        errors.waterAvailability = 'Water availability level is required';
      }
    } else if (currentStep === 6) {
      if (!formData.question || formData.question.trim().length < 5) {
        errors.question = 'Please provide a specific question of at least 5 characters';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmissionError(null);

    // Validate entire payload with Zod
    const validation = AdvisoryRequestInputSchema.safeParse(formData);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.errors.forEach((err: any) => {
        const fieldName = err.path[0] as string;
        errMap[fieldName] = err.message;
      });
      setFieldErrors(errMap);
      setSubmissionError('Please correct the highlighted validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdAdvisory = await advisoryService.createAdvisory(validation.data);
      success('Agricultural advisory generated and verified successfully!');
      navigate(`/advisory/${createdAdvisory.id}`);
    } catch (err: any) {
      setSubmissionError(
        err.message ||
          'Failed to generate advisory from AI service. No fabricated facts were generated. Please review your entries and try again.'
      );
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <PageContainer maxWidth="md" className="pt-12">
        <AIProcessingState />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="lg" className="pt-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Request Agricultural Advisory
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Complete your farm and crop parameters for structured, AI-guided decision support.
        </p>
      </div>

      {/* Progress */}
      <FormProgress
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step < currentStep) {
            setCurrentStep(step);
          }
        }}
      />

      {submissionError && (
        <Alert variant="error" title="Advisory Submission Alert">
          {submissionError}
        </Alert>
      )}

      {/* Dynamic Step Content Card */}
      <div className="card p-6 sm:p-8 space-y-6">
        {currentStep === 0 && (
          <DomainSelector
            selectedDomain={formData.domain}
            onSelect={(domain) => handleChange('domain', domain)}
          />
        )}

        {currentStep === 1 && (
          <FarmInformationForm
            location={formData.location}
            farmSize={formData.farmSize}
            farmingMethod={formData.farmingMethod}
            season={formData.season}
            errors={fieldErrors}
            onChange={handleChange}
          />
        )}

        {currentStep === 2 && (
          <CropInformationForm
            cropName={formData.cropName}
            cropStage={formData.cropStage}
            previousCrop={formData.previousCrop}
            errors={fieldErrors}
            onChange={handleChange}
          />
        )}

        {currentStep === 3 && (
          <SoilInformationForm
            soilType={formData.soilType}
            soilPH={formData.soilPH}
            soilFertility={formData.soilFertility}
            errors={fieldErrors}
            onChange={handleChange}
          />
        )}

        {currentStep === 4 && (
          <IrrigationForm
            irrigationMethod={formData.irrigationMethod}
            waterAvailability={formData.waterAvailability}
            errors={fieldErrors}
            onChange={handleChange}
          />
        )}

        {currentStep === 5 && (
          <SymptomsForm
            symptoms={formData.symptoms}
            pestObservations={formData.pestObservations}
            diseaseObservations={formData.diseaseObservations}
            weatherObservations={formData.weatherObservations}
            errors={fieldErrors}
            onChange={handleChange}
          />
        )}

        {currentStep === 6 && (
          <QuestionForm
            question={formData.question}
            additionalContext={formData.additionalContext}
            errors={fieldErrors}
            onChange={handleChange}
          />
        )}

        {/* Action Controls */}
        <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={() => handleSubmit()}
              leftIcon={<Sparkles className="w-4 h-4" />}
              rightIcon={<Send className="w-4 h-4" />}
              className="bg-agri-600 hover:bg-agri-700 shadow-md shadow-agri-600/20"
            >
              Generate AI Advisory
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
