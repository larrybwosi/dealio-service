import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Plus, Loader2 } from 'lucide-react';
import { useBakerySettingsManagement } from '@/lib/hooks/use-bakery';
import { useListMembers } from '@/lib/api/members';
import { Member } from '@/types/member';

interface AddBakerDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function AddBakerDialog({ open, onOpenChange, trigger }: AddBakerDialogProps) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [specialtiesInput, setSpecialtiesInput] = useState('');
  const { data: members, isLoading: membersLoading } = useListMembers();
  const { bakers, addBaker, isAddingBaker } = useBakerySettingsManagement();

  // Filter out members who are already bakers
  const availableMembers =
    members?.filter((member: Member) => !bakers?.some(baker => baker.memberId === member.id)) || [];

  const handleAddBaker = () => {
    if (selectedMemberId) {
      // Convert comma-separated specialties to array and trim each item
      const specialtiesArray = specialtiesInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      addBaker(
        {
          memberId: selectedMemberId,
          specialties: specialtiesArray,
        },
        {
          onSuccess: () => {
            setSelectedMemberId('');
            setSpecialtiesInput('');
            onOpenChange?.(false);
          },
          onError: error => {
            console.error('Failed to add baker:', error);
          },
        }
      );
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when dialog closes
      setSelectedMemberId('');
      setSpecialtiesInput('');
    }
    onOpenChange?.(isOpen);
  };

  const defaultTrigger = (
    <Button className="bg-orange-600 hover:bg-orange-700">
      <Plus className="h-4 w-4 mr-2" />
      New Baker
    </Button>
  );

  // Get selected member details for preview
  const selectedMember = availableMembers.find(member => member.id === selectedMemberId);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Baker</DialogTitle>
          <DialogDescription>Select a member to add as a baker and specify their specialties</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Member Selection */}
          <div className="space-y-2">
            <Label htmlFor="member-select">Select Member</Label>
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger id="member-select">
                <SelectValue placeholder="Choose a member to add as baker" />
              </SelectTrigger>
              <SelectContent>
                {membersLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading members...
                  </SelectItem>
                ) : availableMembers.length === 0 ? (
                  <SelectItem value="no-members" disabled>
                    No available members to add
                  </SelectItem>
                ) : (
                  availableMembers.map((member: Member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Specialties Input */}
          <div className="space-y-2">
            <Label htmlFor="specialties">Specialties</Label>
            <Input
              id="specialties"
              placeholder="e.g., Bread, Pastries, Cakes, Cookies"
              value={specialtiesInput}
              onChange={e => setSpecialtiesInput(e.target.value)}
              disabled={!selectedMemberId}
            />
            <p className="text-xs text-gray-500">
              Enter specialties separated by commas. Leave empty if no specialties.
            </p>

            {/* Preview of specialties */}
            {specialtiesInput && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <div className="flex flex-wrap gap-1">
                  {specialtiesInput
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0)
                    .map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected Member Preview */}
          {selectedMember && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-900 mb-1">Selected Member</h4>
              <p className="text-sm text-gray-600">{selectedMember.name}</p>
              <p className="text-xs text-gray-500">{selectedMember.email}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isAddingBaker}>
              Cancel
            </Button>
            <Button
              onClick={handleAddBaker}
              disabled={!selectedMemberId || isAddingBaker}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isAddingBaker ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                'Add Baker'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
