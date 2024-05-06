import { QUERY_KEY } from '../../../lib/query-keys'
import { apiGet, ResponseError } from '@/lib/api'
import { Horse } from '@/models/horse'
import { useQuery } from '@tanstack/react-query'

const fetchHorses = async (): Promise<Horse[]> => {
  return (await apiGet('horses')) as Array<Horse>
}

interface IUseHorses {
  horses: Horse[]
  isLoading: boolean
  isFetching: boolean
  error?: string
}

function mapError(error: unknown): string {
  if (error instanceof ResponseError) return error.message
  if (error instanceof Error) return 'Unexpected error: ' + error.message
  return ''
}

export const useHorses = (): IUseHorses => {
  const {
    data: horses = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.horses],
    queryFn: fetchHorses,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    horses,
    isLoading,
    isFetching,
    error: mapError(error),
  }
}
