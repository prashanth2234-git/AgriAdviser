import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Trash2, Calendar, MapPin, ChevronRight, AlertCircle, PlusCircle } from 'lucide-react';
import { advisoryService } from '../services/advisoryService';
import { AdvisoryRecord } from '@shared/types';
import { ADVISORY_DOMAINS, ADVISORY_DOMAIN_METADATA, AdvisoryDomain } from '@shared/constants';
import { useToast } from '../contexts/ToastContext';
import { PageContainer } from '../components/layout/AppShell';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Spinner';
import { EmptyState } from '../components/dashboard/EmptyState';

export const HistoryPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [advisories, setAdvisories] = useState<AdvisoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Deletion modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await advisoryService.getAdvisories({
        search: searchTerm || undefined,
        crop: selectedCrop || undefined,
        domain: selectedDomain || undefined,
        sort: sortOrder,
      });
      setAdvisories(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to fetch advisory records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedCrop, selectedDomain, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await advisoryService.deleteAdvisory(deleteTargetId);
      setAdvisories((prev) => prev.filter((a) => a.id !== deleteTargetId));
      success('Advisory record removed successfully.');
      setDeleteTargetId(null);
    } catch (err: any) {
      toastError(err.message || 'Failed to delete advisory');
    } finally {
      setIsDeleting(false);
    }
  };

  // Extract unique crops from current advisories for filter dropdown
  const uniqueCrops = Array.from(
    new Set(advisories.map((a) => a.request?.crop_name).filter(Boolean))
  );

  return (
    <PageContainer className="pt-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Advisory History & Records
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Search, filter, compare, and manage past crop recommendations.
          </p>
        </div>

        <Link to="/advisory/new">
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Advisory
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by crop, keyword, or farmer question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
          <Select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            options={[
              { value: '', label: 'All Advisory Domains' },
              ...ADVISORY_DOMAINS.map((d: AdvisoryDomain) => ({
                value: d,
                label: ADVISORY_DOMAIN_METADATA[d].label,
              })),
            ]}
          />

          <Select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            options={[
              { value: '', label: 'All Crops' },
              ...uniqueCrops.map((c) => ({ value: c as string, label: c as string })),
            ]}
          />

          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            options={[
              { value: 'newest', label: 'Sort: Newest First' },
              { value: 'oldest', label: 'Sort: Oldest First' },
            ]}
          />
        </div>
      </div>

      {/* Advisories List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : advisories.length === 0 ? (
        <EmptyState
          title="No Matching Advisories"
          description="No advisory records matched your search filters. Try clearing your filters or create a new advisory."
        />
      ) : (
        <div className="space-y-4">
          {advisories.map((advisory) => {
            const domainKey = advisory.request?.domain as AdvisoryDomain;
            const domainMeta = ADVISORY_DOMAIN_METADATA[domainKey];
            const risk = advisory.risk_assessment?.overall || 'unknown';

            const riskVariants: Record<string, 'green' | 'amber' | 'rose' | 'stone'> = {
              low: 'green',
              medium: 'amber',
              high: 'rose',
              unknown: 'stone',
            };

            const formattedDate = new Date(advisory.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={advisory.id}
                className="card p-5 hover:border-agri-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900">
                      {advisory.request?.crop_name}
                    </h3>
                    <Badge variant="stone" size="sm">
                      {advisory.request?.crop_stage?.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="blue" size="sm">
                      {domainMeta?.label || advisory.request?.domain}
                    </Badge>
                    <Badge variant={riskVariants[risk] || 'stone'} size="sm" dot>
                      {risk.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {advisory.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                    {advisory.request?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {advisory.request.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setDeleteTargetId(advisory.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Record"
                    aria-label="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link to={`/advisory/${advisory.id}`}>
                    <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                      View Report
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this agricultural advisory?"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            This action cannot be undone. This advisory record and associated crop request will be permanently removed from your account.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={isDeleting}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Advisory
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
