import { createFileRoute } from '@tanstack/react-router'
import { EquiposView } from '../components/Equipos/EquiposView'

export const Route = createFileRoute('/equipos')({
  component: () => <EquiposView />,
})
