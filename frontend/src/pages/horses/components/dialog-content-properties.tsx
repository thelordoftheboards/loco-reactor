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
        <DialogTitle>{id === 0 ? 'New' : 'Edit' + ' Horse'}</DialogTitle>
        <DialogDescription>
          {id === 0 ? 'Add a new horse' : 'Make changes to horse.'}
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
