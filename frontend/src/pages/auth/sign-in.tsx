import { LegalDocuments } from './components/legal-documents'
import { SignInForm } from './components/sign-in-form'
import LogoSvg from '@/assets/logo.svg'
import * as branding from '@/data/branding-strings'

export default function SignIn() {
  return (
    <>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            {branding.BRANDING_APPLICATION_TITLE}
          </div>

          <img
            src={LogoSvg}
            className='relative m-auto'
            width={300}
            alt='Logo'
          />

          {branding.BRANDING_SIGN_IN_QUOTE_CONTENT.length > 0 && (
            <div className='relative z-20 mt-auto'>
              <blockquote className='space-y-2'>
                <p className='text-lg'>
                  &ldquo; {branding.BRANDING_SIGN_IN_QUOTE_CONTENT} &ldquo;
                </p>
                <footer className='text-sm'>
                  {branding.BRANDING_SIGN_IN_QUOTE_AUTHOR}
                </footer>
              </blockquote>
            </div>
          )}
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Sign In</h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email and password below <br />
                to sign into your account
              </p>
            </div>
            <SignInForm />
            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking <strong>Sign In</strong>, you agree to our
              <LegalDocuments />.
            </p>
            <p className='px-8 text-center text-sm text-muted-foreground'>
              Dont't have an account?{' '}
              <a
                href='/auth/sign-up'
                className='underline underline-offset-4 hover:text-primary'
              >
                Sign up
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
