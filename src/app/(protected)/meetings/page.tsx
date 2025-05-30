'use client'

import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import MeetingCard from '../dashboard/meeting-card'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge' // <-- correct if using ShadCN

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'

const MeetingPage = () => {
    const { projectId } = useProject()
    const {data:meetings, isLoading} = api.project.getMeetings.useQuery({projectId: projectId}, {
        refetchInterval: 4000
    })
    const deleteMeeting = api.project.deleteMeeting.useMutation()
    const refetch = useRefetch()
  return (
    
    <>
        <MeetingCard />
        <div className='h-6'></div>
        <h1 className='text-xl font-semibold'>Meetings</h1>
        {meetings && meetings.length === 0 && <div>No Meetings found</div>}
        {isLoading && <div>Loading...</div>}
        <ul className='divide-y divide-gray-200'>
            {meetings?.map(meeting => (
                <li key={meeting.id} className='flex items-center justify-between py-5 gap-x-6'>
                    <div>
                           <div className='min-w-0'>
                            <div className='flex items-center gap-2'>
                                <Link href={`/meeting/${meeting.id}`} className='text-sm font-semibold'>
                                {meeting.name}
                                </Link>
                                {meeting.status === 'PROCESSING' && (
                                    <Badge className='bg-yellow-500 text-white'>
                                        Processing...
                                    </Badge>
                                )}
                            </div>
                           </div>

                           <div className='flex items-center text-xs text-gray-500 gap-x-2'>
                            <p className='whitespace-nowrap'>
                                {meeting.createdAt.toLocaleDateString()}
                            </p>
                            <p className='truncate'>{meeting.issues.length} issues </p>
                           </div>
                        
                    </div>

                    <div className='flex items-center flex-none gap-x-4'>
                        <Link href={`/meetings/${meeting.id}`}>
                        <Button  size='sm' variant='outline'>
                        View Meeting
                        </Button>
                        </Link>
                        <Button  disabled={deleteMeeting.isPending} size='sm' variant='destructive' onClick={() => deleteMeeting.mutate({meetingId: meeting.id} ,{
                            onSuccess: () => {
                                toast.success('Meeting deleted successfully')
                                refetch()
                            },
                            onError: () => {
                                toast.error('Failed to delete meeting')
                            }
                        })}>Delete Meeting</Button>
                    </div>
                </li>
            ))}
        </ul> 
    
    </>
  )

}

export default MeetingPage