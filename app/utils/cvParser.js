const fs = require('fs');
const pdfParse = require('pdf-parse');

const extractSection = (text, sectionName) => {
    const regex = new RegExp(`${sectionName}\\s*[:\\-]?\\s*(.*?)\\n\\n`, "is");
    const match = text.match(regex);
    return match ? match[1].trim() : null;
};

const cvParser = async (cvPath) => {
    try {
        const buffer = fs.readFileSync(cvPath);
        const data = await pdfParse(buffer);

        const rawText = data.text;

        const parsed ={
            education: extractSection(rawText, "Education"),
            skills: extractSection(rawText, "Skill"),
            experience: extractSection(rawText, "Experience"),
            certification: extractSection(rawText, "Certification"),
            language: extractSection(rawText, "Language"),
        };

        return parsed;
    } catch (error) {
        console.log("Error parsing CV:", error);
        return {};
    }
};

module.exports = {cvParser}