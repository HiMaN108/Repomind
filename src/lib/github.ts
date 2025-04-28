import { db } from "@/server/db";
import {Octokit} from "octokit";
import axios from "axios";
import { aisummariseCommit } from "./gemini";


export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const githubUrl = 'https://github.com/HiMaN108/Authentication_System'

type CommitInfo = {
    commitHash: string,
    commitMessage :string,
    commitAuthorName: string,
    commitAuthorAvatar: string,
    commitDate: string
}

export const getCommitHashes = async (githubUrl:string): Promise<CommitInfo[]> => {
    let [owner, repo] = githubUrl.split('/').slice(-2)
    if(!owner || !repo) {
        throw new Error('Invalid github url')
    }

       // Remove .git if it exists at the end
       if (repo.endsWith('.git')) {
        repo = repo.replace('.git', '');
    }

 const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo
 })   
    const sortedCommits = data.sort((a:any , b:any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]

    return sortedCommits.slice(0,10).map((commit:any) => ({
        commitHash: commit.sha,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date ?? ""
    }))
}

// console.log(await getCommitHashes(githubUrl))asd

export const pollCommits = async (projectId: string) => {
    try {
        const {project, githubUrl} = await fetchProjectGithubUrl(projectId)
        const commitHashes = await getCommitHashes(githubUrl)
        const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
        
        console.log(`Found ${unprocessedCommits.length} unprocessed commits`)
        
        if (unprocessedCommits.length === 0) {
            console.log('No new commits to process')
            return { count: 0 }
        }

        const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
            return summariseCommit(githubUrl, commit.commitHash)
        }))

        const commits = await db.commit.createMany({
            data: unprocessedCommits.map((commit, index) => {
                const response = summaryResponses[index];
                const summary = response && response.status === 'fulfilled' 
                    ? response.value 
                    : 'give up to generate summary'

                console.log(`Processing commit ${index + 1}/${unprocessedCommits.length}: ${commit.commitHash}`)
                
                return {
                    projectId: projectId,
                    commitHash: commit.commitHash,
                    commitMessage: commit.commitMessage || 'No message provided',
                    commitAuthorName: commit.commitAuthorName || 'Unknown',
                    commitAuthorAvatar: commit.commitAuthorAvatar || '',
                    commitDate: new Date(commit.commitDate),
                    summary
                }
            })
        })

        console.log(`Successfully saved ${commits.count} commits to database`)
        return commits
    } catch (error) {
        console.error('Error in pollCommits:', error)
        throw error
    }
}

async function summariseCommit(githubUrl: string, commitHash: string) {
    try {
      let [owner, repo] = githubUrl.split('/').slice(-2);
      
      if (!owner || !repo) {
        throw new Error('Invalid github url');
      }
  
      // Remove .git if it exists at the end
      if (repo.endsWith('.git')) {
        repo = repo.replace('.git', '');
      }
  
      const { data } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: commitHash,
      });
  
      // 'data.files' contains the diff
      const diffText = data.files?.map((file) => file.patch).join('\n') ?? '';
  
      // Pass the diffText to your AI summarizer
      const summary = await aisummariseCommit(diffText);
      console.log(`Generated summary for commit ${commitHash}:`, summary);
  
      return summary || 'No summary available';
    } catch (error) {
      console.error(`Error getting summary for commit ${commitHash}:`, error);
      return 'Failed to generate summary';
    }
  }
  

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true
        }
    })
    if(!project?.githubUrl) {
        throw new Error('Project has no github url')
    }
    return { project, githubUrl: project?.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: CommitInfo[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId
        }
    })
    const unprocessedCommit = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommit
}
