import { QUERY_KEY } from '../../../constants/queryKeys'
import { toast } from '@/components/ui/use-toast'
import { Horse } from '@/models/horse'
import { apiPost, ResponseError } from '@/utils/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const postHorse = async (given_name: Horse['given_name']): Promise<Horse> => {
  return (await apiPost('horses', { given_name })) as Horse
}

interface IUseAddHorse {
  addHorse: (given_name: Horse['given_name']) => void
}

function mapError(error: unknown): string {
  if (error instanceof ResponseError) return error.message
  return 'Unknown error'
}

export const useAddHorse = (): IUseAddHorse => {
  const client = useQueryClient()
  const { mutate: addHorse } = useMutation(postHorse, {
    onSuccess: () => {
      toast({
        title: 'Horse added',
      })

      client.invalidateQueries([QUERY_KEY.horses])
    },
    onError: (error) => {
      const errorMessage = mapError(error)

      toast({
        title: 'Horse could not be added',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{errorMessage}</code>
          </pre>
        ),
      })
    },
  })

  return {
    addHorse,
  }
}
