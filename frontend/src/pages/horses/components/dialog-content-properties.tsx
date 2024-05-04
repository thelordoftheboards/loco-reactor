import { useHorse } from '../hooks/useHorse'
import { PropertiesForm } from './properties-form'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Dispatch } from 'react'

export function DialogContentProperties({
  id,
  setOpen,
}: {
  id: number
  setOpen: Dispatch<React.SetStateAction<boolean>>
}) {
  const {
    horse,
    // isLoading: isLoadingHorse,
    // isFetching: isFetchingHorse,
    // error: errorHorse,
  } = useHorse(id)

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Edit Horse</DialogTitle>
        <DialogDescription>
          Make changes to your horse here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      {horse && <PropertiesForm setOpen={setOpen} horse={horse} />}
    </DialogContent>
  )
}
