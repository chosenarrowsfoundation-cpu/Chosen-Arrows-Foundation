'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import {
  getCampaignUpdates,
  createCampaignUpdate,
  updateCampaignUpdate,
  deleteCampaignUpdate,
  type CampaignUpdate,
} from '@/app/actions/campaigns/manage-campaign-updates'
import { format } from 'date-fns'

interface CampaignUpdatesManagerProps {
  campaignId: string
}

export default function CampaignUpdatesManager({ campaignId }: CampaignUpdatesManagerProps) {
  const [updates, setUpdates] = useState<CampaignUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUpdate, setEditingUpdate] = useState<CampaignUpdate | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    update_date: format(new Date(), 'yyyy-MM-dd'),
    content: '',
  })

  useEffect(() => {
    loadUpdates()
  }, [campaignId])

  const loadUpdates = async () => {
    setIsLoading(true)
    const data = await getCampaignUpdates(campaignId)
    setUpdates(data)
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    if (!formData.update_date || !formData.content.trim()) {
      toast.error('Please fill in the date and content')
      return
    }
    setIsSaving(true)

    try {
      if (editingUpdate) {
        const result = await updateCampaignUpdate(
          editingUpdate.id,
          campaignId,
          formData.update_date,
          formData.content
        )
        if (result.success) {
          toast.success('Update saved')
          setEditingUpdate(null)
          resetForm()
          loadUpdates()
        } else {
          toast.error('Failed to save', { description: (result as { success: false; error: string }).error })
        }
      } else {
        const result = await createCampaignUpdate(
          campaignId,
          formData.update_date,
          formData.content
        )
        if (result.success) {
          toast.success('Update created')
          resetForm()
          loadUpdates()
        } else {
          toast.error('Failed to create', { description: (result as { success: false; error: string }).error })
        }
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (update: CampaignUpdate) => {
    setEditingUpdate(update)
    setFormData({
      update_date: update.update_date,
      content: update.content,
    })
  }

  const handleDelete = async (updateId: string) => {
    const result = await deleteCampaignUpdate(updateId, campaignId)
    if (result.success) {
      toast.success('Update deleted')
      setShowDeleteDialog(null)
      loadUpdates()
    } else {
      toast.error('Failed to delete', { description: (result as { success: false; error: string }).error })
    }
  }

  const resetForm = () => {
    setFormData({
      update_date: format(new Date(), 'yyyy-MM-dd'),
      content: '',
    })
    setEditingUpdate(null)
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingUpdate ? 'Edit Update' : 'Add Campaign Update'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="update_date">Update Date</Label>
              <Input
                id="update_date"
                type="date"
                value={formData.update_date}
                onChange={(e) => setFormData({ ...formData, update_date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Update Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-32"
                placeholder="Share progress, milestones, or news about this campaign..."
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? 'Saving...' : editingUpdate ? 'Update' : 'Add Update'}
              </Button>
              {editingUpdate && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updates List */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading updates...
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No updates yet</p>
              <p className="text-sm mt-2">Add an update to share campaign progress</p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="border-l-2 border-primary pl-4 py-2 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(update.update_date), 'MMMM d, yyyy')}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(update)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteDialog(update.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{update.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog !== null} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Update?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this campaign update. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (showDeleteDialog) {
                  handleDelete(showDeleteDialog)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
