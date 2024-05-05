import { useHorse } from '../hooks/use-horse'
import { PropertiesForm } from './properties-form'
import Error from '@/components/error'
import Loader from '@/components/loader'
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
  const { horse, isLoading, isFetching, error } = useHorse(id)

  console.log({ horse, isLoading, isFetching, error })

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Edit Horse</DialogTitle>
        <DialogDescription>
          Make changes to your horse here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      {error ? (
        <Error message={error} />
      ) : !horse || isLoading || isFetching ? (
        <Loader />
      ) : (
        <>{horse && <PropertiesForm setOpen={setOpen} horse={horse} />}</>
      )}
    </DialogContent>
  )
}
