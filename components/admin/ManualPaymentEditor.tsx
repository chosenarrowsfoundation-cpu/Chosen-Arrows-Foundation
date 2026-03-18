'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { Loader2, Save, Banknote, Building2, Phone } from 'lucide-react'
import { updateSetting } from '@/app/actions/settings/update-settings'

const manualPaymentSchema = z.object({
  bank: z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    accountName: z.string().min(1, 'Account name is required'),
    accountNumber: z.string().min(1, 'Account number is required'),
    swiftCode: z.string().min(1, 'SWIFT code is required'),
    currency: z.string().min(1, 'Currency is required'),
  }),
  mpesa: z.object({
    number: z.string().min(1, 'Paybill/phone number is required'),
    name: z.string().min(1, 'Account name is required'),
    instructions: z.string().min(1, 'Instructions are required'),
  }),
})

type ManualPaymentFormValues = z.infer<typeof manualPaymentSchema>

const defaultValues: ManualPaymentFormValues = {
  bank: {
    bankName: '[BANK NAME]',
    accountName: 'Chosen Arrows Foundation',
    accountNumber: '[ACCOUNT NUMBER]',
    swiftCode: '[SWIFT CODE]',
    currency: 'USD / KES',
  },
  mpesa: {
    number: '[PHONE/PAYBILL NUMBER]',
    name: 'Chosen Arrows Foundation',
    instructions: 'Go to M-Pesa > Lipa na M-Pesa > Paybill/Buy Goods',
  },
}

interface ManualPaymentEditorProps {
  initialData: ManualPaymentFormValues | null
}

export default function ManualPaymentEditor({ initialData }: ManualPaymentEditorProps) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ManualPaymentFormValues>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: initialData ?? defaultValues,
  })

  const onSubmit = async (data: ManualPaymentFormValues) => {
    setIsSaving(true)
    try {
      const result = await updateSetting(
        'manual_payment_details',
        data,
        'Bank transfer and M-Pesa manual payment details'
      )
      if (result.success) {
        toast.success('Manual payment details saved', {
          description: 'These details will appear on the donate page for the Manual payment option.',
        })
      } else {
        toast.error('Failed to save', {
          description: (result as { success: false; error: string }).error,
        })
      }
    } catch {
      toast.error('An error occurred', { description: 'Please try again later.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Banknote className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Manual Payment Details</CardTitle>
        </div>
        <CardDescription>
          Bank transfer and M-Pesa information shown on the donate page when donors choose the Manual payment option. All fields are fully editable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center gap-2 font-medium text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Bank Transfer
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bank.bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Equity Bank" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bank.accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Chosen Arrows Foundation" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bank.accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 0123456789" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bank.swiftCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SWIFT Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. EQBLKENA" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bank.currency"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. USD / KES" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center gap-2 font-medium text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                M-Pesa (Manual)
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="mpesa.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paybill / Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 123456 or 07XX XXX XXX" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mpesa.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Chosen Arrows Foundation" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mpesa.instructions"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Go to M-Pesa > Lipa na M-Pesa > Paybill/Buy Goods" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Manual Payment Details
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
