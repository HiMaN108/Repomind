
import useProject from '@/hooks/use-project'
import React from 'react'
import { api } from '@/trpc/react'

const TeamMembes = () => {
    const { projectId } = useProject()
    const { data : members } = api.project.getTeamMembers.useQuery({projectId})
  return (
        <div className='flex items-center gap-2'>
            {members?.map(member => 
                member.user.imageUrl ? (
                    <img 
                        key={member.id} 
                        src={member.user.imageUrl} 
                        alt={member.user.firstName || ''} 
                        height={30} 
                        width={30} 
                        className='w-8 h-8 rounded-full' 
                    />
                ) : null
            )}
        </div>
  ) 
}

export default TeamMembes