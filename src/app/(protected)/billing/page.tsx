'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

const BillingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 dark:bg-background px-4">
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-10 w-10 text-yellow-500" />
          </div>
          <CardTitle className="text-xl font-semibold">Billing Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            This feature is <span className="font-semibold text-yellow-600">Coming Soon</span>! <br />
            Working hard to bring this to you. 🚀
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default BillingPage
