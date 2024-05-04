import { PropertiesForm } from './properties-form'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Dispatch } from 'react'

export function DialogContentProperties({
  setOpen,
}: {
  setOpen: Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <PropertiesForm setOpen={setOpen} />
    </DialogContent>
  )
}
