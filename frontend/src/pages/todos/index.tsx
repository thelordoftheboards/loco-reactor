import { columns } from './components/columns'
import { DataTable } from './components/data-table'
//import { tasks } from './data/tasks'
import { useTodos } from './hooks/useTodos'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { withAuthedUser } from '@/components/with-authed-user'

function Todos() {
  const {
    todos,
    //isLoading, isFetching, error
  } = useTodos()

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className='flex flex-col' fixedHeight>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={todos} columns={columns} />
        </div>
      </LayoutBody>
    </Layout>
  )
}

export default withAuthedUser(Todos)
