import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Badge } from '@workspace/ui/components/badge';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { BakeryBaker, BatchStatus } from '@/types';
import { Plus, Edit, Mail, User, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useBakerySettingsManagement } from '@/hooks/use-bakery';
import AddBakerDialog from './BakerForm';
import { Skeleton } from '@workspace/ui/components/skeleton';

export default function BakerManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    bakers,
    isLoading: settingsLoading,
    error: settingsError,
    updateSettings,
    removeBaker,
    isUpdating,
    isRemovingBaker,
  } = useBakerySettingsManagement();

  const filteredBakers = bakers?.filter(
    baker =>
      baker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      baker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      baker.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRemoveBaker = (memberId: string) => {
    if (bakers && bakers.length > 1) {
      removeBaker(
        { memberId },
        {
          onError: error => {
            console.error('Failed to remove baker:', error);
          },
        }
      );
    }
  };

  const getBakerStats = (baker: BakeryBaker) => {
    const bakerBatches = baker.batches || [];
    const totalBatches = bakerBatches.length;
    const completedBatches = bakerBatches.filter(b => b.status === BatchStatus.COMPLETED).length;
    const activeBatches = bakerBatches.filter(b => b.status === BatchStatus.IN_PROGRESS).length;
    const plannedBatches = bakerBatches.filter(b => b.status === BatchStatus.PLANNED).length;

    return { totalBatches, completedBatches, activeBatches, plannedBatches };
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Loading skeleton component
  const BakerCardSkeleton = () => (
    <Card className="bg-background shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Specialties skeleton */}
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>

        {/* Statistics skeleton */}
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 rounded" />
            <Skeleton className="h-16 rounded" />
          </div>
        </div>

        {/* Current status skeleton */}
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-18" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        {/* Completion rate skeleton */}
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </CardContent>
    </Card>
  );

  if (settingsLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Search skeleton */}
        <Skeleton className="h-10 w-80" />

        {/* Bakers grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <BakerCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (settingsError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Baker Management</h2>
            <p className="text-gray-600">Manage your bakery team and their assignments</p>
          </div>
        </div>
        <Card className="bg-background shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">
              <User className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bakers</h3>
            <p className="text-gray-500 text-center mb-4">{settingsError.message || 'Failed to load baker data'}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Baker Management</h2>
          <p className="text-gray-600">Manage your bakery team and their assignments</p>
        </div>
        <AddBakerDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search bakers..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Bakers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBakers?.map(baker => {
          const stats = getBakerStats(baker);
          return (
            <Card key={baker.id} className="bg-background shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                        {getInitials(baker.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{baker.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {baker.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Specialties */}
                  <div>
                    <Label className="text-sm text-gray-500">Specialties</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {baker?.specialties?.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <Label className="text-sm text-gray-500">Performance</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="flex items-center justify-center mb-1">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-lg font-bold text-blue-600">{stats.totalBatches}</div>
                        <div className="text-xs text-gray-500">Total Batches</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="flex items-center justify-center mb-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-lg font-bold text-green-600">{stats.completedBatches}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div>
                    <Label className="text-sm text-gray-500">Current Status</Label>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-yellow-600 mr-1" />
                          <span className="text-sm">{stats.activeBatches} Active</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                          <span className="text-sm">{stats.plannedBatches} Planned</span>
                        </div>
                      </div>
                      <Badge variant={baker.isActive ? 'default' : 'secondary'}>
                        {baker.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  {stats.totalBatches > 0 && (
                    <div>
                      <Label className="text-sm text-gray-500">Completion Rate</Label>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Success Rate</span>
                          <span>{Math.round((stats.completedBatches / stats.totalBatches) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(stats.completedBatches / stats.totalBatches) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBakers?.length === 0 && (
        <Card className="bg-background shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bakers found</h3>
            <p className="text-gray-500 text-center">
              {searchTerm ? 'Try adjusting your search terms' : 'Add bakers to your team to get started'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
