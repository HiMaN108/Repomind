'use client'

import { api } from '@/trpc/react'
import React from 'react'
import useProject from '@/hooks/use-project'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'

const ArchiveButton = () => {
    const archiveProject = api.project.archiveProject.useMutation()
    const { projectId } = useProject()
    const refetch = useRefetch()
  return (
    <Button  disabled={ archiveProject.isPending} size='sm' variant='destructive' onClick={() => {
        const confirm = window.confirm("are you sure want to archive this project?")
        if(confirm) archiveProject.mutate({ projectId} , {
            onSuccess: () => {
                toast.success("Project archived successfully")
                refetch()
            },
            onError:() => {
                toast.error("failed to archive project")
            }
        })
    }}>
        Archive
    </Button>
  )
}
export default ArchiveButton