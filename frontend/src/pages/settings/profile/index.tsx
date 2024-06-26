import ProfileForm from './profile-form'
import { Separator } from '@/components/ui/separator'

export default function SettingsProfile() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Profile</h3>
        <p className='text-sm text-muted-foreground'>
          This is how others will see you on the site.
        </p>
      </div>
      <Separator className='my-4' />
      <ProfileForm />
    </div>
  )
}
