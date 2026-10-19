'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2, Radio } from 'lucide-react'
import { getGoogleListener } from '../../../_actions/workflow-connections'
import { Button } from '@/components/ui/button'

const GoogleDriveFiles = () => {
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const reqGoogle = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/drive-activity')
      toast.success(response.data)
      setIsListening(true)
    } catch (error: any) {
      toast.error(error?.response?.data || 'Could not start the Drive listener')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getGoogleListener().then((listener) => {
      if (listener?.googleResourceId) setIsListening(true)
    })
  }, [])

  return (
    <div className="flex flex-col gap-3 pb-2">
      {isListening ? (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Listening for Google Drive changes
        </div>
      ) : (
        <Button variant="outline" onClick={reqGoogle} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Radio />}
          Start listening to Drive
        </Button>
      )}
    </div>
  )
}

export default GoogleDriveFiles
