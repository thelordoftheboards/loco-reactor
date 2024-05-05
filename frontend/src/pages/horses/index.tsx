import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { useHorses } from './hooks/use-horses'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import Error from '@/components/error'
import Loader from '@/components/loader'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { withAuthedUser } from '@/components/with-authed-user'

function Horses() {
  const { horses, isLoading, isFetching, error } = useHorses()

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {error ? (
            <Error message={error} />
          ) : isLoading || isFetching ? (
            <Loader />
          ) : (
            <DataTable data={horses} columns={columns} />
          )}
        </div>
      </LayoutBody>
    </Layout>
  )
}

export default withAuthedUser(Horses)
