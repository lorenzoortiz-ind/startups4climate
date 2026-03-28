import { notFound } from 'next/navigation'
import { getToolById } from '@/lib/tools-data'
import ToolPage from '@/components/tools/ToolPage'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ stage?: string }>
}) {
  const { id } = await params
  const { stage } = await searchParams
  const tool = getToolById(id)
  if (!tool) notFound()
  const stageNum = stage ? parseInt(stage, 10) : undefined
  const validStage = stageNum && [1, 2, 3, 4].includes(stageNum) ? (stageNum as 1 | 2 | 3 | 4) : undefined
  return <ToolPage toolId={id} transversalStage={validStage} />
}
