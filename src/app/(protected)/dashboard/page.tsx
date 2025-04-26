"use client"

import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import React from 'react'

const DashboardPage = () => {
    const { project } = useProject()

    return (
        <div>
            <h1>{project?.name}</h1>
        </div>
    )
}

export default DashboardPage 