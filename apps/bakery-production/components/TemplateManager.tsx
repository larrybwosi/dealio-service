import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Template } from '@/types';
import { Plus, Edit, Eye, File, Clock } from 'lucide-react';
import { useDeleteConfirmation } from '@/components/delete-modal-provider';
import { CreateEditTemplate } from './CreateEditTemplate';
import { useDeleteTemplate, useTemplates } from '@/hooks/use-bakery';

export default function TemplateManager() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: templates, isLoading: loadingTemplates, error } = useTemplates();
  console.log(templates);
  const { mutateAsync: deleteTemplate, isPending: deletingTemplate } = useDeleteTemplate();
  const { confirmDelete } = useDeleteConfirmation();

  const filteredTemplates = templates?.filter(
    template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTemplate = async (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (!template) return;

    const confirmed = await confirmDelete({
      entityType: 'template',
      entityName: template.name,
      confirmText: '',
      description: '',
    });

    if (confirmed) {
      try {
        await deleteTemplate(templateId);
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const handleEditClick = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  // Helper function to format schedule days
  const formatScheduleDays = (days: number[] | null) => {
    if (!days || days.length === 0) return 'Not scheduled';

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.map(day => dayNames[day]).join(', ');
  };

  // Helper function to format schedule time
  const formatScheduleTime = (time: string | null) => {
    if (!time) return '';

    // Convert "15:20" to "3:20 PM"
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Skeleton loading component
  const TemplateSkeleton = () => (
    <Card className="bg-background shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 mr-1" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Card className="bg-background shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <File className="h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load templates</h3>
          <p className="text-gray-500 text-center mb-4">There was an error loading your templates. Please try again.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Template Management</h2>
          <p className="text-gray-600">Create and manage recipe templates for quick batch generation</p>
        </div>

        {/* Create Template Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Create a new template from an existing recipe</DialogDescription>
            </DialogHeader>
            <CreateEditTemplate isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingTemplates
          ? // Loading state
            Array.from({ length: 6 }).map((_, index) => <TemplateSkeleton key={index} />)
          : // Actual templates
            filteredTemplates?.map(template => (
              <Card key={template.id} className="bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.category.name}</CardDescription>
                    </div>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Base Recipe:</p>
                      <p className="text-sm text-gray-600">{template.recipe.name}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{template.quantity}</span>
                    </div>

                    {template.duration && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {template.duration}
                      </div>
                    )}

                    {/* Schedule Information */}
                    {template.scheduleDays && template.scheduleDays.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">Schedule:</p>
                        <p className="text-gray-600">{formatScheduleDays(template.scheduleDays)}</p>
                        {template.scheduleTime && (
                          <p className="text-gray-600">at {formatScheduleTime(template.scheduleTime)}</p>
                        )}
                      </div>
                    )}

                    {/* Shelf Life */}
                    {template.shelfLifeDays && (
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">Shelf Life:</p>
                        <p className="text-gray-600">{template.shelfLifeDays} days</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-2">
                      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          {selectedTemplate && (
                            <>
                              <DialogHeader>
                                <DialogTitle>{selectedTemplate.name}</DialogTitle>
                                <DialogDescription>Template Details</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Category</Label>
                                    <p className="text-sm">{selectedTemplate.category.name}</p>
                                  </div>
                                  <div>
                                    <Label>Base Recipe</Label>
                                    <p className="text-sm">{selectedTemplate.recipe.name}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Default Quantity</Label>
                                    <p className="text-sm">{selectedTemplate.quantity}</p>
                                  </div>
                                  <div>
                                    <Label>Expected Duration</Label>
                                    <p className="text-sm">{selectedTemplate.duration || 'Not specified'}</p>
                                  </div>
                                </div>

                                {/* Schedule Information in View Dialog */}
                                {selectedTemplate.scheduleDays && selectedTemplate.scheduleDays.length > 0 && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Scheduled Days</Label>
                                      <p className="text-sm">{formatScheduleDays(selectedTemplate.scheduleDays)}</p>
                                    </div>
                                    {selectedTemplate.scheduleTime && (
                                      <div>
                                        <Label>Scheduled Time</Label>
                                        <p className="text-sm">{formatScheduleTime(selectedTemplate.scheduleTime)}</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Shelf Life in View Dialog */}
                                {selectedTemplate.shelfLifeDays && (
                                  <div>
                                    <Label>Shelf Life</Label>
                                    <p className="text-sm">{selectedTemplate.shelfLifeDays} days</p>
                                  </div>
                                )}

                                {selectedTemplate.procedure && (
                                  <div>
                                    <Label>Standard Procedure</Label>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">
                                      {selectedTemplate.procedure}
                                    </p>
                                  </div>
                                )}

                                {selectedTemplate.notes && (
                                  <div>
                                    <Label>Notes</Label>
                                    <p className="text-sm text-gray-600">{selectedTemplate.notes}</p>
                                  </div>
                                )}

                                <div className="flex items-center text-sm">
                                  <Label className="mr-2">Status:</Label>
                                  <Badge variant={selectedTemplate.isActive ? 'default' : 'secondary'}>
                                    {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm" onClick={() => handleEditClick(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Empty state */}
      {!loadingTemplates && filteredTemplates?.length === 0 && (
        <Card className="bg-background shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <File className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No templates found' : 'No templates created yet'}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create templates to streamline your batch production'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Make changes to your template</DialogDescription>
          </DialogHeader>
          <CreateEditTemplate
            template={selectedTemplate}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onDelete={handleDeleteTemplate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
