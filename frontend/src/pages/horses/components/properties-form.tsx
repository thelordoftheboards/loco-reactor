import { HorseGeners } from '../data/horse-genders'
import { horseSchema } from '../data/schema'
import { useAddHorseMutation } from '../hooks/use-add-horse-mutation'
import { useUpdateHorseMutation } from '../hooks/use-update-horse-mutation'
import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const updateHorseMutation = useUpdateHorseMutation()

  const form = useForm<z.infer<typeof horseSchema>>({
    resolver: zodResolver(horseSchema),
    defaultValues: horse,
  })

  async function onSubmit(data: z.infer<typeof horseSchema>) {
    setIsLoadingForm(true)

    try {
      if (data.id === 0) {
        await addHorseMutation.mutateAsync(data)
      } else {
        updateHorseMutation.mutateAsync(data)
      }
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
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={'' + field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a verified email to display' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HorseGeners.map((horse_gender) => (
                          <SelectItem
                            key={horse_gender.id}
                            value={'' + horse_gender.id}
                          >
                            {horse_gender.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='color_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={'' + field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a verified email to display' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='1'>1</SelectItem>
                        <SelectItem value='2'>2</SelectItem>
                        <SelectItem value='3'>3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the closest appropriate color.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='mt-2' loading={isLoadingForm}>
                {horse.id === 0 ? 'Add New' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  )
}
