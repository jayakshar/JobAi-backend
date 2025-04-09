const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../models');
const cvScanner = db.cvScanner;
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.cvScanner = async (req, res) => {
    try {
        const userId = req.user?.id;
        const file = req.file;

        if (!userId) {
            return res.status(400).json({ status: 400, message: "User ID is required." });
        }

        if (!file) {
            return res.status(400).json({ status: 400, message: "File is required" });
        }

        const filePath = path.join(__dirname, '../uploads', file.filename);
        const pdfBuffer = fs.readFileSync(filePath);

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert CV reviewer. Analyze the attached CV (in PDF format) and return a structured JSON response only, in the exact format below. Do not include any text outside the JSON.   
                        {
                          "cv_score": number (0-100),
                          "format_score": number (0-100),
                          "sections_score": number (0-100),
                          "content_score": number (0-100),
                          "style_score": number (0-100),
                          "suggestions": {
                            "format": {
                             "format_score": number (0-100),
                              "description": "text",
                              "suggestion": "text"
                            }, 
                            "sections": {
                              "sections_score": number (0-100),
                              "description": "text",
                              "suggestion": "text"
                            },
                            "content": {
                            "content_score": number (0-100),
                              "description": "text",
                              "suggestion": "text"
                            },
                            "style": {
                              "style_score": number (0-100),
                              "description": "text",
                              "suggestion": "text"
                            }
                          }
                        }
                    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: "application/pdf",
                    data: Buffer.from(pdfBuffer).toString('base64'),
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();
        console.log("Raw AI Response:", text);

        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(cleanedText);
        } catch (err) {
            console.error("Invalid JSON from AI:", cleanedText);
            return res.status(500).json({
                status: 500,
                message: "AI did not return valid JSON.",
                raw: cleanedText
            });
        }

        const newEntry = await cvScanner.create({
            user_id: userId,
            cv_file: file.filename,
            cv_score: parsed.cv_score,
            ai_response: JSON.stringify(parsed),
            created_at: new Date(),
        });

        res.status(200).json({
            status: 200,
            message: "CV scanned successfully.",
            data: {
                ...newEntry.dataValues,
                ai_response: JSON.parse(newEntry.ai_response)
            }
        });
        
          

    }  catch (err) {
        console.error("Invalid JSON from AI:", cleanedText);
        return res.status(500).json({
          status: 500,
          message: "AI did not return valid structured JSON.",
          raw: cleanedText // helpful for debugging
        });
    } 
};
