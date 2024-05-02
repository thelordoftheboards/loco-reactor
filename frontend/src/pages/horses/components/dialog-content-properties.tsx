import { PropertiesForm } from './properties-form'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function DialogContentProperties() {
  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <PropertiesForm />

      {/*
      <div className='grid gap-4 py-4'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='given_name' className='text-right'>
            Name
          </Label>
          <Input
            id='given_name'
            placeholder='Sea Buiscit'
            className='col-span-3'
          />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='gender' className='text-right'>
            Gender
          </Label>
          <Input
            id='gender'
            type='number'
            defaultValue='1'
            className='col-span-3'
          />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='color' className='text-right'>
            Color
          </Label>
          <Input
            id='color'
            type='number'
            defaultValue='1'
            className='col-span-3'
          />
        </div>
      </div>
      <DialogFooter>
        <Button type='submit'>Save changes</Button>
      </DialogFooter>
      */}
    </DialogContent>
  )
}
