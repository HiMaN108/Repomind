"use client"

import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import { ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CommitLog from './commit-log'
import AskQUestionCard from './ask-question-card'
import MeetingCard from './meeting-card'
import ArchiveButton from './archive-button'
// import InviteButton from './invite-button'
const InviteButton = dynamic(() => import('./invite-button'), { ssr: false})
import TeamMembes from './team-member'
import dynamic from 'next/dynamic'

const DashboardPage = () => {
    const { project } = useProject()

    return (
        <div>
            <div className='flex items-center justify-between flex-wrap gap-y-4'>
                {/* githubLINK */}
                <div className='w-fit rounded-md bg-primary px-4 py-4'>
                    <div className='flex items-center'>

                        <Github className='size-5 text-white' />
                        <div className='ml-2'>
                            <p className='text-sm font-medium text-white'>
                                This project is linked to {''}
                                <Link href={project?.githubUrl ?? " "} className='inline-flex items-center text-white/80 hover:underline'>
                                {project?.githubUrl}
                                <ExternalLink className='ml-1 size-4' />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className='h-4'></div>

                <div className='flex items-center gap-4'>
                 <TeamMembes />
                  <InviteButton />
                  <ArchiveButton />
                </div>
            </div>
            
            <div className='mt-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-5'>
                    <AskQUestionCard />
                    <MeetingCard />
                </div>
            </div>

            <div className='mt-8'>
                <CommitLog />
            </div>
        </div>
    )
}

export default DashboardPage 