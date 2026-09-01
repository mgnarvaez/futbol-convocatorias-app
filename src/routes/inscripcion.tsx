import { createFileRoute } from '@tanstack/react-router'
import { InscripcionForm } from '../components/Convocatorias/InscripcionForm'

export const Route = createFileRoute('/inscripcion')({
  component: () => <InscripcionForm />,
})
