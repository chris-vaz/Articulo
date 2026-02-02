import React from 'react'
import { getDashboardStats } from './_actions/dashboard-stats'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Activity, CheckCircle, XCircle, Zap, Layers, CreditCard } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const DashboardPage = async () => {
  const stats = await getDashboardStats()

  if (!stats) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Dashboard
      </h1>
      <div className="flex flex-col gap-4 p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Workflows
              </CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.workflows}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedWorkflows} published
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Executions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExecutions}</div>
              <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs text-green-500">
                      <CheckCircle className="h-3 w-3" /> {stats.successfulExecutions}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-red-500">
                      <XCircle className="h-3 w-3" /> {stats.failedExecutions}
                  </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Credits
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.credits}</div>
              <p className="text-xs text-muted-foreground">
                Plan: {stats.tier}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
