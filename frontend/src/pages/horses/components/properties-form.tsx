import { horseSchema } from '../data/schema'
import { useAddHorseMutation } from '../hooks/use-add-horse-mutation'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

export function PropertiesForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const addHorseMutation = useAddHorseMutation()

  const form = useForm<z.infer<typeof horseSchema>>({
    resolver: zodResolver(horseSchema),
    defaultValues: {
      id: 0,
      given_name: '',
      gender_id: 1,
      color_id: 1,
    },
  })

  async function onSubmit(data: z.infer<typeof horseSchema>) {
    setIsLoading(true)

    try {
      await addHorseMutation.mutateAsync(data)
    } catch (err: unknown) {
      const error = err as Error
      form.setError('given_name', { type: 'manual', message: error.message })
    }

    setIsLoading(false)
  }

  //     <div className={cn('grid gap-6', className)} {...props}>

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-2'>
          <FormField
            control={form.control}
            name='given_name'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel>Given Name</FormLabel>
                <FormControl>
                  <Input placeholder='Seabuiscuit' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='gender_id'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <div className='flex items-center justify-between'>
                  <FormLabel>Gender</FormLabel>
                </div>
                <FormControl>
                  <Input placeholder='mare' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='mt-2' loading={isLoading}>
            Update/Add Horse
          </Button>
        </div>
      </form>
    </Form>
  )
  //     </div>
}
