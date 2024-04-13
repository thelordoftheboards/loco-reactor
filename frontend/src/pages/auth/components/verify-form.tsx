import * as userLocalStorage from '../../../auth/authed-user.localstore'
import { QUERY_KEY } from '../../../constants/queryKeys'
import { apiPost } from '../../../data/api'
import { queryClient } from '../../../react-query/client'
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
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

interface VerifyFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  token: z.string().uuid(),
})

export function VerifyForm({ className, ...props }: VerifyFormProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { token: searchParams.get('code') ?? '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const authedUser = userLocalStorage.getAuthedUser()

    try {
      // If the API request succeeds, then the user is verfied on the server
      await apiPost('auth/verify', data)

      if (authedUser) {
        // We have the authed user here, mark it as verified locally
        authedUser.is_verified = true

        // Save the updated authed user to local storage
        userLocalStorage.saveAuthedUser(authedUser)

        // Clear the query result to force re-load from local storage
        queryClient.removeQueries([QUERY_KEY.user])

        // Since we know we have authed, we can go to root
        navigate('/')
      } else {
        // We are not signed in, let's do that next
        navigate('/sign-in')
      }

      // Whether we have
    } catch (err: unknown) {
      const error = err as Error
      form.setError('token', { type: 'manual', message: error.message })
    }

    setIsLoading(false)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='token'
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
