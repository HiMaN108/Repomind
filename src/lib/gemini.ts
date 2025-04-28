import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
});


export const aisummariseCommit = async (diff: string) => {
  try {
    const response = await model.generateContent([
      `You are an expert programmer, and you are trying to summarize a git diff.
      Reminders about the git diff format:
      For every file, there are a few metadata lines, like (for example):
      \`\`\`
      diff --git a/lib/index.js b/lib/index.js
      index aadf691..bfef603 100644
      --- a/lib/index.js
      +++ b/lib/index.js
      \`\`\`
      This means that \`lib/index.js\` was modified in this commit. Note that this is just an example.
     Then there is a specifier of the lines that were modified.     
     A line starting with \`+\` means it was added.
      A line starting with \`-\` means it was deleted.
      A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
       It is not part of the diff.
       [...]
      EXAMPLE SUMMARY COMMENTS:
      \`\`\`
      * Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
      * Fixed a typo in the GitHub action name [.github/workflows/gpt-commit-summarizer.yml]
      * Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
      * Added an OpenAI API for completions [packages/utils/apis/openai.ts]
      * Lowered numeric tolerance for test files
      \`\`\`
      Most commits will have less comments than this examples list.
        The last comment does not include the file names.
        because there were more than two relevant files in the  hypothetical commit.
        Do not include parts of the example in your summary.
        It is given only as an example of appropriate Comment.`,
        `Please summarise the following diff file: \n\n${diff}`,
      
    ]);

    return response.response.text();
  } catch (error) {
    console.error("Gemini summarization error:", error);
    return " ";
  }
}

console.log(await aisummariseCommit(`diff --git a/client/src/helper/helper.js b/client/src/helper/helper.js
index be3e13d..2867823 100644
--- a/client/src/helper/helper.js
+++ b/client/src/helper/helper.js
@@ -1,7 +1,9 @@
 import axios from "axios";
 import { jwtDecode } from "jwt-decode";
 
-axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
+axios.defaults.baseURL =
+  process.env.REACT_APP_SERVER_DOMAIN ||
+  "https://authentication-system-bxzd.onrender.com";
 
 /** Make API Requests */
 
    `))


// // console.log(await aisummariseCommit(
// //     `diff --git a/server/controllers/mailer.js b/server/controllers/mailer.js
// // index 512c35a..af4f36e 100644
// // --- a/server/controllers/mailer.js
// // +++ b/server/controllers/mailer.js
// // @@ -4,7 +4,6 @@ import dotenv from 'dotenv';
 
// //  dotenv.config();
 
// // -<<<<<<< HEAD
 
// //  // https://ethereal.email/create
// //  let nodeConfig = {
// // @@ -64,71 +63,3 @@ export const registerMail = async (req, res) => {
// //          .catch(error => res.status(500).send({ error }))
 
// //  }
// // -=======
// // -// Email transporter configuration
// // -const nodeConfig = {
// // -  host: "smtp.ethereal.email",
// // -  port: 587,
// // -  secure: false, // false for TLS - as ethereal uses STARTTLS
// // -  auth: {
// // -    user: process.env.EMAIL,
// // -    pass: process.env.PASSWORD,
// // -  }
// // -};
// // -
// // -const transporter = nodemailer.createTransport(nodeConfig);
// // -
// // -const mailGenerator = new Mailgen({
// // -  theme: "default",
// // -  product: {
// // -    name: "Mailgen",
// // -    link: "https://mailgen.js/"
// // -  }
// // -});
// // -
// // -/**
// // - * POST: http://localhost:8080/api/registerMail
// // - * @param: {
// // - *  "username": "example123",
// // - *  "userEmail": "admin123@example.com",
// // - *  "text": "Welcome to our platform!",
// // - *  "subject": "Signup Successful"
// // - * }
// // - */
// // -export const registerMail = async (req, res) => {
// // -  try {
// // -    const { username, userEmail, text, subject } = req.body;
// // -
// // -    if (!username || !userEmail) {
// // -      return res.status(400).json({ error: "Username and userEmail are required." });
// // -    }
// // -
// // -    // Email content
// // -    const email = {
// // -      body: {
// // -        name: username,
// // -        intro: text || "Welcome to mylogin page system! We're excited to have you onboard.",
// // -        outro: "Need help or have questions? Just reply to this email — we'd love to help."
// // -      }
// // -    };
// // -
// // -    const emailBody = mailGenerator.generate(email);
// // -
// // -    // Email message details
// // -    const message = {
// // -      from: process.env.EMAIL,
// // -      to: userEmail,
// // -      subject: subject || "Signup Successful",
// // -      html: emailBody
// // -    };
// // -
// // -    // Send email
// // -    await transporter.sendMail(message);
// // -    return res.status(200).json({ msg: "You should receive an email from us." });
// // -
// // -  } catch (error) {
// // -    console.error("Email sending error:", error);
// // -    return res.status(500).json({ error: error.message || "Internal Server Error" });
// // -  }
// // -};
// // ->>>>>>> 532b58b33b4f7b0a0caa0ea6c5035b1ac5da9183

// // `
// // ));
