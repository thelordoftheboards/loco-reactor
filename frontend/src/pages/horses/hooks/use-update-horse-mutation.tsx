import { QUERY_KEY } from '../../../constants/queryKeys'
import { toast } from '@/components/ui/use-toast'
import { apiCall, ResponseError } from '@/lib/api'
import { Horse } from '@/models/horse'
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

const postHorse = async (horse: Horse): Promise<Horse> => {
  return (await apiCall('POST', `horses/${horse.id}`, horse)) as Horse
}

type IUseUpdateHorseMutation = UseMutationResult<Horse, unknown, Horse, unknown>

function mapError(error: unknown): string {
  if (error instanceof ResponseError) return error.message
  return 'Unknown error'
}

export const useUpdateHorseMutation = (): IUseUpdateHorseMutation => {
  const client = useQueryClient()
  const updateHorseMutation = useMutation({
    mutationFn: postHorse,
    onSuccess: (horse: Horse) => {
      // XXXXX - does this need to be removed? Error handling should happen on form.
      toast({
        title: 'Horse updated',
      })

      client.invalidateQueries({ queryKey: [QUERY_KEY.horses] })
      client.invalidateQueries({ queryKey: [QUERY_KEY.horse, horse.id] })
    },
    onError: (error) => {
      // XXXXX - does this need to be removed? Error handling should happen on form.
      const errorMessage = mapError(error)

      toast({
        title: 'Horse could not be updated',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{errorMessage}</code>
          </pre>
        ),
      })
    },
  })

  return updateHorseMutation
}
