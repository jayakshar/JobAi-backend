const { db } = require("../models");
const JobLoop = db.jobLoop;
const moment = require("moment");
const User = db.user;
const LoopSetting = db.loopSettings;
const EmailTemplate = db.emailTemplate;
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const pdfParse = require('pdf-parse');
const path = require('path');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 

// exports.addJobLoop = async (req, res) => {
//     try {
//         const userId = req.user?.id || '';
//         console.log("user id", userId);
//         const { title, location, is_remote,experience, job_type, updated_cv, status, total_applied_jobs } = req.body
//         console.log("Body", req.body);

//         if (!userId) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "User ID is required."
//             });
//         }
//         if (!title || !location || typeof is_remote === 'undefined'|| !experience || !job_type || !updated_cv || !status ||  typeof total_applied_jobs === 'undefined') {
//             return res.status(400).json({
//                 status: 400,
//                 message: "All field are required."
//             });
//         }

//         const createJobLoop = await JobLoop.create({
//             user_id: userId,
//             title,
//             location,
//             experience,
//             is_remote,
//             job_type,
//             updated_cv,
//             status,
//             total_applied_jobs,
//             created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
//         });


//         if (!createJobLoop) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Job loop not created."
//             });
//         }

//         return res.status(200).json({
//             status: 201,
//             message: "Job loop created successfully.",
//             data: createJobLoop
//         });

//     } catch (error) {
//         console.error("Add job loop error:", error);
//         return res.status(500).json({ status: 500 ,message: "Internal server error" , data : {}});
//     }
// };


exports.createJobLoopWithSettingsAndTemplate = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        if (!userId) {
            return res.status(400).json({ status: 400, message: "User ID is required.", data: {} });
        }

        // Destructure fields from body
        const {
            title, location, is_remote, experience, job_type, updated_cv,
            status, total_applied_jobs,
            auto_send_emails, auto_fill_application, cover_letter, excluded_company,
            email_template // { title, subject, body, status }
        } = req.body;

        // Validate job loop required fields
        if (!title || !location || typeof is_remote === 'undefined' || !experience || !job_type || !updated_cv || !status || typeof total_applied_jobs === 'undefined') {
            return res.status(400).json({ status: 400, message: "All Job Loop fields are required." });
        }

        // Validate loop setting required fields
        if (!cover_letter || !excluded_company || (!auto_send_emails && !auto_fill_application)) {
            return res.status(400).json({ status: 400, message: "Loop settings are incomplete." });
        }

        // Step 1: Create Job Loop
        const jobLoop = await JobLoop.create({
            user_id: userId,
            title,
            location,
            experience,
            is_remote,
            job_type,
            updated_cv,
            status,
            total_applied_jobs,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss")
        });

        // Step 2: Create Loop Setting
        const loopSettings = await LoopSetting.create({
            loop_id: jobLoop.id,
            auto_send_emails: auto_send_emails ?? 0,
            auto_fill_application: auto_fill_application ?? 0,
            cover_letter,
            excluded_company
        });

        // Step 3 (optional): Create Email Template if provided
        let createdTemplate = null;
        if (email_template?.title && email_template?.subject && email_template?.body) {
            const validStatus = ['draft', 'active', 'inactive'];
            const templateStatus = validStatus.includes(email_template.status) ? email_template.status : 'draft';

            createdTemplate = await EmailTemplate.create({
                title: email_template.title,
                subject: email_template.subject,
                body: email_template.body,
                status: templateStatus,
                user_id: userId
            });
        }

        // Success Response
        return res.status(201).json({
            status: 201,
            message: "Job loop, settings, and email template (if any) created successfully.",
            data: {
                jobLoop,
                loopSettings,
                emailTemplate: createdTemplate
            }
        });

    } catch (error) {
        console.error("Create full job loop error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
    }
};

exports.jobLoopList = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        console.log("user id", userId);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            })
        }
        const jobLoops = await JobLoop.findAll({
            where: {
                user_id: userId
            },
            order: [['created_at', 'DESC']]
        });
        if (!jobLoops) {
            return res.status(404).json({
                status: 404,
                message: "No Job Loops found"
            })
        }
        return res.status(200).json({
            status: 200,
            message: "Job loop list retrieved successfully.",
            data: jobLoops
        });
    } catch (error) {
        console.error("Job loop list error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: {} });
    }
};

exports.jobLoopDetail = async (req, res) => {
    try {
        const userId = req.user?.id || '';
        const jobLoopId = req.params.id || '';
        console.log("user id", userId);
        console.log("job loop id", jobLoopId);

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is required."
            })
        }
        if (!jobLoopId) {
            return res.status(400).json({
                status: 400,
                message: "Job Loop ID is required."
            })
        }
        const jobLoop = await JobLoop.findOne({
            where: {
                id: jobLoopId,
                user_id: userId
            }
        });
        if (!jobLoop) {
            return res.status(404).json({
                status: 404,
                message: "Job Loop not found."
            })
        }
        return res.status(200).json({
            status: 200,
            message: 'Job Loop detail retrieved successfully.',
            data: jobLoop
        });
    } catch (error) {
        console.error("Job loop Detail error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: {} });
    }
};

// const generateTextWithGemini = async (prompt) => {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;

//     const text = await response.text();

//     // Clean response: remove ```json, ``` and extra newlines
//     const cleanedText = text
//         .replace(/```json/g, "")
//         .replace(/```/g, "")
//         .replace(/\n{2,}/g, "\n\n") // reduces 3+ newlines to 2
//         .trim();

//     return cleanedText;
// };

exports.coverLetter = async (req, res) => {
    try {
      const jobLoopId = req.params.id;
      const userId = req.user?.id;
  
      console.log(`📨 Request received for cover letter | JobLoop ID: ${jobLoopId}, User ID: ${userId}`);
  
      // Fetch the job loop and user details (cv_path will be fetched from User table)
      const jobLoopData = await JobLoop.findOne({
        where: { id: jobLoopId, user_id: userId },
      });
  
      if (!jobLoopData) {
        console.warn('⚠️ Job loop or user not found');
        return res.status(404).json({
          status: 404,
          message: 'Job loop or user not found',
          data: {}
        });
      }
  
      // Fetch user details from the User table
      const user = await User.findOne({
        where: { id: userId },
        attributes: ['first_name', 'last_name', 'email', 'cv_path'],
      });
  
      if (!user) {
        console.warn('⚠️ User not found');
        return res.status(404).json({
          status: 404,
          message: 'User not found',
          data: {}
        });
      }
  
      const { first_name, last_name, email, cv_path } = user;
      const userName = `${first_name} ${last_name}`.trim() || 'Candidate';
      const currentDate = moment().format("MMMM D, YYYY");
  
      const uploadsDir = path.join(__dirname, "../uploads");
      console.log(uploadsDir)
  
      // Construct the full path using the cv_path from the database
      const cvFullPath = path.resolve(uploadsDir, cv_path);
      console.log('📂 Full Local CV Path:', cvFullPath);
  
      // Check if the file exists
      if (!fs.existsSync(cvFullPath)) {
        console.error('⚠️ CV file not found at the specified path:', cvFullPath);
        return res.status(400).json({
          status: 400,
          message: 'CV file not found. Please ensure the file is uploaded correctly.',
          data: {}
        });
      }
  
      let cvText = '';
      try {
        const buffer = fs.readFileSync(cvFullPath);
        const parsed = await pdfParse(buffer);
        cvText = parsed.text;
      } catch (err) {
        console.warn('⚠️ Failed to parse CV:', err.message);
        return res.status(400).json({
          status: 400,
          message: 'Failed to read CV file. Please ensure it is a valid PDF.',
          data: {}
        });
      }
      console.log("cvtext", cvText)
  
      const { title, location, is_remote, experience, job_type } = jobLoopData;
      const safe = (val) => val || 'Not available';
  
      const template = await EmailTemplate.findOne({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
      });
  
      let emailBodySnippet = template?.body || `I'm interested in the {{JOB_TITLE}} position. I believe my skills make me a great fit for the role.\n\nSincerely,\n{{USER_NAME}}`;
  
      emailBodySnippet = emailBodySnippet
        .replace(/{{USER_FIRSTNAME}}/g, first_name)
        .replace(/{{USER_LASTNAME}}/g, last_name)
        .replace(/{{USER_NAME}}/g, userName)
        .replace(/{{JOB_TITLE}}/g, title || '')
        .replace(/{{SKILL_SET}}/g, 'See resume')
        .replace(/{{COMPANY_NAME}}/g, 'the company')
        .replace(/{{INTERVIEWER_NAME}}/g, 'Hiring Manager');
  
      // ---- FINAL PROMPT FOR AI ----
      const prompt = `
        Generate a professional and compelling cover letter based on the candidate and job details provided below. The tone should be confident, clear, and tailored to the role. Do not include generic salutations like "Dear Hiring Manager".
  
        ---
  
        **Candidate Details:**
        - Name: ${userName}
        - Email: ${email}
        - Phone: ${phone}
        - LinkedIn: ${linkedin_url}
        - Address: ${address}
  
        **Resume (Raw Extracted Text):**
        ${cvText.slice(0, 3000)} <!-- Limiting characters to avoid model overflow -->
  
        **Job Information:**
        - Title: ${title}
        - Location: ${location}
        - Remote: ${is_remote ? 'Yes' : 'No'}
        - Experience Required: ${experience}
        - Job Type: ${job_type}
  
        **Instructions:**
        - Begin with a personalized, engaging introduction
        - Highlight relevant experience and skills based on resume
        - Conclude with strong interest and call to action
  
        **Tone:** Professional  
        **Length:** Medium  
        **Date:** ${currentDate}
      `.trim();
  
      console.log('\n🧠 Prompt sent to Gemini AI:\n', prompt);
  
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const coverLetter = response.text();
  
      console.log('\n✍️ AI Response:\n', coverLetter);
  
      jobLoopData.cover_letter = coverLetter;
      await jobLoopData.save();
  
      return res.status(200).json({
        status: 200,
        data: coverLetter,
      });
  
    } catch (error) {
      console.error('❌ Error generating cover letter:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: error.message,
        data: {}
      });
    }
  };
  
  


  