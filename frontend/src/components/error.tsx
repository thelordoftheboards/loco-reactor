import { IconHeartBroken } from '@tabler/icons-react'

export default function Error({ message }: { message: string }) {
  return (
    <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
      <IconHeartBroken size={52} />
      <h1 className='text-3xl font-bold leading-tight'>An Error occurred</h1>
      <p className='text-center text-muted-foreground'>{message}</p>
    </div>
  )
}
