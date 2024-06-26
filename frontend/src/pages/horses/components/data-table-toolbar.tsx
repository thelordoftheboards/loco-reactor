import { DialogContentProperties } from './dialog-content-properties'
import { Button } from '@/components/custom/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'

export function DataTableToolbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'></div>

      <div className='flex gap-x-2'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant='outline' size='sm' className='ml-auto h-8 lg:flex'>
              <IconPlus size={18} />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContentProperties id={0} setOpen={setOpen} />
        </Dialog>
      </div>
    </div>
  )
}
