import { GithubRepoLoader} from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { summariseCode } from "./gemini";
import { generateEmbedding } from "./gemini";
import { db } from "@/server/db";


export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || '',
        branch: 'main',
        ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5
    })
    const docs = await loader.load()
    return docs
}

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken)
    const allEmbeddings = await generateEmbeddings(docs)
    await Promise.all(allEmbeddings.map(async (embedding,index) => {
        console.log(`processing ${index} of ${allEmbeddings.length}`)
        if(!embedding) return

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId,
            }
        })

        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `
    }))
        

}

const generateEmbeddings = async (docs : Document[]) => {
    return await Promise.all(docs.map(async doc => {
        const summary = await summariseCode(doc)
        const embedding = await generateEmbedding(summary)
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
        }
    }))
    
}
// Document {
//     pageContent: "{\n  \"name\": \"server\",\n  \"version\": \"1.0.0\",\n  \"description\": \"\",\n  \"main\": \"index.js\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"start\": \"nodemon server.js\"\n  },\n  \"keywords\": [],\n  \"author\": \"\",\n  \"license\": \"ISC\",\n  \"dependencies\": {\n    \"bcrypt\": \"^5.1.1\",\n    \"cors\": \"^2.8.5\",\n    \"dotenv\": \"^16.4.7\",\n    \"express\": \"^4.18.2\",\n    \"jsonwebtoken\": \"^8.5.1\",\n    \"mailgen\": \"^2.0.28\",\n    \"mongodb\": \"^6.12.0\",\n    \"mongodb-memory-server\": \"^8.10.2\",\n    \"mongoose\": \"^6.8.0\",\n    \"morgan\": \"^1.10.0\",\n    \"multer\": \"^1.4.5-lts.1\",\n    \"nodemailer\": \"^6.9.13\",\n    \"nodemon\": \"^2.0.20\",\n    \"otp-generator\": \"^4.0.1\"\n  }\n}\n",
//     metadata: {
//       source: "server/package.json",
//       repository: "https://github.com/HiMaN108/Authentication_System",
//       branch: "main",
//     },
//     id: undefined,
//   }

// console.log(await loadGithubRepo("https://github.com/HiMaN108/Authentication_System"))