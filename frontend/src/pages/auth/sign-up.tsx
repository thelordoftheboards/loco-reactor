import { LegalDocuments } from './components/legal-documents'
import { SignUpForm } from './components/sign-up-form'
import LogoDiscreteSvg from '@/assets/logo-discrete.svg'
import ThemeSwitch from '@/components/theme-switch'
import { Card } from '@/components/ui/card'
import { BRANDING_APPLICATION_TITLE } from '@/data/branding-strings'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <>
      <div className='absolute right-3 top-3 ml-auto flex items-center space-x-4'>
        <ThemeSwitch />
      </div>

      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <img src={LogoDiscreteSvg} alt='Logo' className='mr-2' />
            <h1 className='text-xl font-medium'>
              {BRANDING_APPLICATION_TITLE}
            </h1>
          </div>
          <Card className='p-6'>
            <div className='mb-2 flex flex-col space-y-2 text-left'>
              <h1 className='text-lg font-semibold tracking-tight'>
                Create an account
              </h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email and password to create an account. <br />
                Already have an account?{' '}
                <Link
                  to='/auth/sign-in'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Sign In
                </Link>
              </p>
            </div>
            <SignUpForm />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              By creating an account, you agree to our
              <LegalDocuments />.
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
