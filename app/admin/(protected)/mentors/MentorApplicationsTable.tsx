'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Users, Download, Pencil, Loader2, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'
import type { MentorApplication } from '@/app/actions/mentorship/get-applications'
import { updateMentorApplication } from '@/app/actions/mentorship/update-application'

const statusOptions = ['pending', 'reviewed', 'accepted', 'rejected']

interface MentorApplicationsTableProps {
  applications: MentorApplication[]
}

export default function MentorApplicationsTable({ applications: initialApplications }: MentorApplicationsTableProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<MentorApplication>>({})
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleStatusChange = async (id: string, status: string) => {
    setStatusUpdatingId(id)
    const result = await updateMentorApplication(id, { status })
    setStatusUpdatingId(null)
    if (result.success) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      )
      toast.success('Status updated')
    } else {
      toast.error((result as { success: false; error: string }).error)
    }
  }

  const openEdit = (app: MentorApplication) => {
    setEditingId(app.id)
    setEditForm({
      first_name: app.first_name,
      last_name: app.last_name,
      email: app.email,
      phone: app.phone ?? '',
      occupation: app.occupation ?? '',
      why_mentor: app.why_mentor ?? '',
      skills_expertise: app.skills_expertise ?? '',
      availability: app.availability ?? '',
      status: app.status,
    })
  }

  const closeEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    const result = await updateMentorApplication(editingId, {
      first_name: editForm.first_name,
      last_name: editForm.last_name,
      email: editForm.email,
      phone: editForm.phone || null,
      occupation: editForm.occupation || null,
      why_mentor: editForm.why_mentor || null,
      skills_expertise: editForm.skills_expertise || null,
      availability: editForm.availability || null,
      status: editForm.status,
    })
    if (result.success) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, ...editForm } as MentorApplication : a
        )
      )
      toast.success('Application updated')
      closeEdit()
    } else {
      toast.error((result as { success: false; error: string }).error)
    }
  }

  const exportToExcel = () => {
    setIsExporting(true)
    try {
      const rows = applications.map((a) => ({
        'First Name': a.first_name,
        'Last Name': a.last_name,
        Email: a.email,
        Phone: a.phone ?? '',
        Occupation: a.occupation ?? '',
        'Why Mentor': a.why_mentor ?? '',
        'Skills & Expertise': a.skills_expertise ?? '',
        Availability: a.availability ?? '',
        Status: a.status,
        'Applied At': format(new Date(a.created_at), 'yyyy-MM-dd HH:mm:ss'),
        'Updated At': format(new Date(a.updated_at), 'yyyy-MM-dd HH:mm:ss'),
      }))
      const ws = XLSX.utils.json_to_sheet(rows)
      const colWidths = [
        { wch: 12 },
        { wch: 12 },
        { wch: 28 },
        { wch: 18 },
        { wch: 20 },
        { wch: 40 },
        { wch: 40 },
        { wch: 30 },
        { wch: 10 },
        { wch: 20 },
        { wch: 20 },
      ]
      ws['!cols'] = colWidths
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Mentor Applications')
      const filename = `mentor-applications-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      XLSX.writeFile(wb, filename)
      toast.success('Exported to Excel')
    } catch (err) {
      toast.error('Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Mentor Applications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {applications.length} application{applications.length !== 1 ? 's' : ''} received
            </p>
          </div>
        </div>
        <Button onClick={exportToExcel} disabled={isExporting || applications.length === 0} className="shrink-0 w-full sm:w-auto">
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export to Excel
        </Button>
      </div>

      <Card className="flex-1 min-h-0 min-w-0 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto min-h-0 min-w-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Why Mentor</TableHead>
                <TableHead>Skills & Expertise</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No mentor applications yet.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.first_name} {app.last_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <a
                          href={`mailto:${app.email}`}
                          className="flex items-center gap-1.5 text-primary hover:underline text-sm"
                        >
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {app.email}
                        </a>
                        {app.phone && (
                          <span className="flex items-center gap-1.5 text-sm">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            {app.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[140px] truncate" title={app.occupation ?? ''}>
                      {app.occupation ?? '-'}
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <span className="line-clamp-2 text-sm" title={app.why_mentor ?? ''}>
                        {app.why_mentor ?? '-'}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <span className="line-clamp-2 text-sm" title={app.skills_expertise ?? ''}>
                        {app.skills_expertise ?? '-'}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[140px]">
                      <span className="line-clamp-2 text-sm" title={app.availability ?? ''}>
                        {app.availability ?? '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {statusUpdatingId === app.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Select
                          value={app.status}
                          onValueChange={(v) => handleStatusChange(app.id, v)}
                        >
                          <SelectTrigger className="h-8 w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(app)}
                        className="h-8"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={editForm.first_name ?? ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={editForm.last_name ?? ''}
                  onChange={(e) => setEditForm((p) => ({ ...p, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email ?? ''}
                onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={editForm.phone ?? ''}
                onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label>Occupation</Label>
              <Input
                value={editForm.occupation ?? ''}
                onChange={(e) => setEditForm((p) => ({ ...p, occupation: e.target.value }))}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={editForm.status ?? 'pending'}
                onValueChange={(v) => setEditForm((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Why Mentor</Label>
              <Textarea
                value={editForm.why_mentor ?? ''}
                onChange={(e) => setEditForm((p) => ({ ...p, why_mentor: e.target.value }))}
                className="min-h-24"
              />
            </div>
            <div>
              <Label>Skills & Expertise</Label>
              <Textarea
                value={editForm.skills_expertise ?? ''}
                onChange={(e) => setEditForm((p) => ({ ...p, skills_expertise: e.target.value }))}
                className="min-h-24"
              />
            </div>
            <div>
              <Label>Availability</Label>
              <Textarea
                value={editForm.availability ?? ''}
                onChange={(e) => setEditForm((p) => ({ ...p, availability: e.target.value }))}
                className="min-h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
