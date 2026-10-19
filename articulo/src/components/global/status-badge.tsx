import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'SUCCESS')
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="h-3 w-3" /> Success
      </Badge>
    )
  if (status === 'FAILED')
    return (
      <Badge variant="destructive" className="gap-1 bg-destructive/15 text-destructive">
        <XCircle className="h-3 w-3" /> Failed
      </Badge>
    )
  return (
    <Badge variant="muted" className="gap-1">
      <Clock className="h-3 w-3" /> Running
    </Badge>
  )
}

export default StatusBadge

export const timeAgo = (date: Date) => {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 1000))
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return rtf.format(-Math.round(seconds / 60), 'minute')
  if (seconds < 86400) return rtf.format(-Math.round(seconds / 3600), 'hour')
  return rtf.format(-Math.round(seconds / 86400), 'day')
}
