import { LegalDocuments } from './components/legal-documents'
import { SignInForm } from './components/sign-in-form'
import LogoDiscreteSvg from '@/assets/logo-discrete.svg'
import { Card } from '@/components/ui/card'
import { BRANDING_APPLICATION_TITLE } from '@/data/branding-strings'

export default function SignIn2() {
  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <img src={LogoDiscreteSvg} alt='Logo' className='mr-2' />
            <h1 className='text-xl font-medium'>
              {BRANDING_APPLICATION_TITLE}
            </h1>
          </div>
          <Card className='p-6'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Sign In</h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email and password below <br />
                to log into your account
              </p>
            </div>
            <SignInForm />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              By clicking login, you agree to our
              <LegalDocuments />.
            </p>
            <p className='px-8 text-center text-sm text-muted-foreground'>
              Dont&apos;t have an account?{' '}
              <a
                href='/auth/sign-up'
                className='underline underline-offset-4 hover:text-primary'
              >
                Sign up
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
