import { notFound } from 'next/navigation'
import { getToolById } from '@/lib/tools-data'
import ToolPage from '@/components/tools/ToolPage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tool = getToolById(id)
  if (!tool) notFound()
  return <ToolPage toolId={id} />
}
