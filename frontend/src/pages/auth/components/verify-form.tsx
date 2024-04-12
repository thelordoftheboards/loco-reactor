import { apiPost } from '../../../data/api'
import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

interface VerifyFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  code: z.string().uuid(),
})

export function VerifyForm({ className, ...props }: VerifyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: searchParams.get('code') ?? '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const verifyResult = await apiPost('auth/verify', data)
      console.log({ verifyResult })
    } catch (err) {}

    setIsLoading(false)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
