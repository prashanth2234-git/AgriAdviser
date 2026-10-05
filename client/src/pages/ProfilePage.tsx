import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Layers, Droplets, Sliders, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/authService';
import { PageContainer } from '../components/layout/AppShell';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { IRRIGATION_METHODS, FARMING_METHODS } from '@shared/constants';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [experience, setExperience] = useState<string>(
    user?.farming_experience_years !== null && user?.farming_experience_years !== undefined
      ? String(user.farming_experience_years)
      : ''
  );
  const [farmSize, setFarmSize] = useState<string>(
    user?.farm_size_acres !== null && user?.farm_size_acres !== undefined
      ? String(user.farm_size_acres)
      : ''
  );
  const [primaryCrops, setPrimaryCrops] = useState<string>(
    user?.primary_crops ? user.primary_crops.join(', ') : ''
  );
  const [irrigationType, setIrrigationType] = useState(user?.irrigation_type || '');
  const [farmingMethod, setFarmingMethod] = useState(user?.farming_method || '');

  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setExperience(user.farming_experience_years !== null && user.farming_experience_years !== undefined ? String(user.farming_experience_years) : '');
      setFarmSize(user.farm_size_acres !== null && user.farm_size_acres !== undefined ? String(user.farm_size_acres) : '');
      setPrimaryCrops(user.primary_crops ? user.primary_crops.join(', ') : '');
      setIrrigationType(user.irrigation_type || '');
      setFarmingMethod(user.farming_method || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSavedSuccess(false);

    try {
      const cropsArray = primaryCrops
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      await authService.updateProfile({
        full_name: fullName,
        phone: phone || undefined,
        location: location || undefined,
        farming_experience_years: experience ? parseInt(experience, 10) : undefined,
        farm_size_acres: farmSize ? parseFloat(farmSize) : undefined,
        primary_crops: cropsArray,
        irrigation_type: irrigationType || undefined,
        farming_method: farmingMethod || undefined,
      });

      await refreshUser();
      setSavedSuccess(true);
      success('Farmer profile updated successfully.');
    } catch (err: any) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="md" className="pt-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Farmer Profile & Field Baseline
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Keep your default farm dimensions and agronomic background up to date.
        </p>
      </div>

      {savedSuccess && (
        <Alert variant="success" title="Profile Saved">
          Your profile details have been saved and will auto-populate your future advisory requests.
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6 text-left">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Personal & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <div className="sm:col-span-2">
              <Input
                label="Geographical Location / Region"
                placeholder="e.g. Ludhiana, Punjab or Salinas Valley, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
                helperText="Used to infer regional weather patterns and soil horizons."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Agricultural Background
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Farming Experience (in Years)"
              type="number"
              min="0"
              placeholder="e.g. 10"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />

            <Input
              label="Total Farm Size (in Acres)"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 15.5"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
            />

            <div className="sm:col-span-2">
              <Input
                label="Primary Crops Grown (comma separated)"
                placeholder="e.g. Wheat, Basmati Rice, Mustard, Tomato"
                value={primaryCrops}
                onChange={(e) => setPrimaryCrops(e.target.value)}
                helperText="List your principal crops for quick selection during advisories."
              />
            </div>

            <Select
              label="Primary Irrigation Infrastructure"
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              options={['', ...IRRIGATION_METHODS]}
            />

            <Select
              label="Preferred Farming Methodology"
              value={farmingMethod}
              onChange={(e) => setFarmingMethod(e.target.value)}
              options={['', ...FARMING_METHODS]}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};
