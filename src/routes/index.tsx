import { createFileRoute } from '@tanstack/react-router'
import { AdminPanel } from '../components/Dashboard/AdminPanel'

export const Route = createFileRoute('/')({
  component: () => <AdminPanel />,
})
