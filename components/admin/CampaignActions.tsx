'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react'
import { deleteCampaign } from '@/app/actions/campaigns/delete-campaign'
import { toast } from 'sonner'

interface CampaignActionsProps {
  campaignId: string
  slug: string
}

export default function CampaignActions({ campaignId, slug }: CampaignActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteCampaign(campaignId)

    if (result.success) {
      toast.success('Campaign deleted', {
        description: 'The campaign has been permanently deleted.',
      })
      router.refresh()
    } else {
      toast.error('Failed to delete', {
        description: (result as { success: false; error: string }).error,
      })
    }

    setIsDeleting(false)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div className="flex items-center gap-1 justify-end">
        <Link href={`/admin/campaigns/${campaignId}`}>
          <Button size="sm" className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/campaigns/${slug}`} target="_blank">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Public
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign
              and all associated data including translations, images, and updates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
