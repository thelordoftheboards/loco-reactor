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
import { Horse } from '@/models/horse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function PropertiesForm({
  horse,
  setOpen,
}: {
  horse: Horse
  setOpen: Dispatch<React.SetStateAction<boolean>>
}) {
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const addHorseMutation = useAddHorseMutation()

  const form = useForm<z.infer<typeof horseSchema>>({
    resolver: zodResolver(horseSchema),
    defaultValues: horse,
  })

  async function onSubmit(data: z.infer<typeof horseSchema>) {
    setIsLoadingForm(true)

    try {
      await addHorseMutation.mutateAsync(data)
    } catch (err: unknown) {
      const error = err as Error
      form.setError('given_name', { type: 'manual', message: error.message })
    }

    setIsLoadingForm(false)

    setOpen(false)
  }

  return (
    <>
      {horse && (
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
              <Button className='mt-2' loading={isLoadingForm}>
                {horse.id ? 'Add New' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  )
}
