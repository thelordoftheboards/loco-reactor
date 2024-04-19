import * as branding from '@/data/branding-strings'

export function LegalDocuments() {
  return (
    <>
      {' '}
      {branding.BRANDING_LEGAL_DOCUMENTS.map((document, ix) => (
        <>
          {ix === 0
            ? ' '
            : ix === branding.BRANDING_LEGAL_DOCUMENTS.length - 1
              ? ' and '
              : ', '}
          <a
            href={document[1]}
            target='_BLANK'
            className='underline underline-offset-4 hover:text-primary'
          >
            {document[0]}
          </a>
        </>
      ))}
    </>
  )
}
