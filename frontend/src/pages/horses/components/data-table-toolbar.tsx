import { DialogContentProperties } from './dialog-content-properties'
import { Button } from '@/components/custom/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { IconPlus } from '@tabler/icons-react'

export function DataTableToolbar() {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'></div>

      <div className='flex gap-x-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='ml-auto hidden h-8 lg:flex'
            >
              <IconPlus size={18} />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContentProperties />
        </Dialog>
      </div>
    </div>
  )
}
