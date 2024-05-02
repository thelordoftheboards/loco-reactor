import { QUERY_KEY } from '../../../constants/queryKeys'
import { toast } from '@/components/ui/use-toast'
import { Horse } from '@/models/horse'
import { apiPost, ResponseError } from '@/utils/api'
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

const postHorse = async (horse: Horse): Promise<Horse> => {
  return (await apiPost('horses', horse)) as Horse
}

type IUseAddHorseMutation = UseMutationResult<Horse, unknown, Horse, unknown>

function mapError(error: unknown): string {
  if (error instanceof ResponseError) return error.message
  return 'Unknown error'
}

export const useAddHorseMutation = (): IUseAddHorseMutation => {
  const client = useQueryClient()
  const addHorseMutation = useMutation({
    mutationFn: postHorse,
    onSuccess: () => {
      // XXXXX - does this need to be removed? Error handling should happen on form.
      toast({
        title: 'Horse added',
      })

      client.invalidateQueries({ queryKey: [QUERY_KEY.horses] })
    },
    onError: (error) => {
      // XXXXX - does this need to be removed? Error handling should happen on form.
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

  return addHorseMutation
}
