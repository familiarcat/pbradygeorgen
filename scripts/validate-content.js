/**
 * Validate Content Script
 * 
 * This script validates the analyzed content against Zod schemas
 * to ensure it conforms to our expected structure.
 */

const fs = require('fs');
const path = require('path');
const { z } = require('zod');

// Define the schemas that match our TypeScript definitions
const ContactInfoSchema = z.object({
  text: z.string()
});

const ExperienceEntrySchema = z.object({
  period: z.string(),
  company: z.string(),
  title: z.string(),
  description: z.string().optional()
});

const EducationEntrySchema = z.object({
  degree: z.string().optional(),
  institution: z.string(),
  period: z.string().optional()
});

const ClientEntrySchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

const SkillEntrySchema = z.object({
  text: z.string()
});

// Schema for the sections object
const SectionsSchema = z.object({
  name: z.string(),
  header: z.array(z.string()),
  about: z.array(z.string()),
  contact: z.array(z.string()),
  skills: z.array(z.string()),
  experience: z.array(z.string()),
  education: z.array(z.string()),
  clients: z.array(z.string()),
  other: z.array(z.string())
});

// Schema for the structuredContent object
const StructuredContentSchema = z.object({
  name: z.string(),
  summary: z.string().optional(),
  contact: z.array(ContactInfoSchema),
  skills: z.array(SkillEntrySchema),
  experience: z.array(ExperienceEntrySchema),
  education: z.array(EducationEntrySchema),
  clients: z.array(ClientEntrySchema).optional(),
  about: z.string().optional()
});

// Schema for the analyzed content
const AnalyzedContentSchema = z.object({
  sections: SectionsSchema,
  structuredContent: StructuredContentSchema
});

// Read the analyzed content
const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');

if (!fs.existsSync(analyzedPath)) {
  console.error(`❌ Analyzed content file not found at ${analyzedPath}`);
  process.exit(1);
}

const analyzed = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));

// Validate the content
console.log('🔍 Validating content against Zod schemas...');

try {
  const result = AnalyzedContentSchema.safeParse(analyzed);
  
  if (result.success) {
    console.log('✅ Content validation successful!');
    console.log('📄 Name:', analyzed.structuredContent.name);
    console.log('📄 Sections:', Object.keys(analyzed.sections).join(', '));
    console.log('📄 Structured sections:', Object.keys(analyzed.structuredContent).join(', '));
    
    // Create a log entry
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'content-validation',
      result: 'success',
      details: {
        name: analyzed.structuredContent.name,
        sections: Object.keys(analyzed.sections),
        structuredSections: Object.keys(analyzed.structuredContent)
      }
    };
    
    fs.appendFileSync(
      path.join(logsDir, 'validation.log'),
      JSON.stringify(logEntry) + '\n'
    );
    
    process.exit(0);
  } else {
    console.error('❌ Content validation failed!');
    console.error('Errors:');
    
    // Format the validation errors
    result.error.errors.forEach((err, index) => {
      console.error(`${index + 1}. Path: ${err.path.join('.')}, Message: ${err.message}, Code: ${err.code}`);
    });
    
    // Create a log entry
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'content-validation',
      result: 'failure',
      errors: result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code
      }))
    };
    
    fs.appendFileSync(
      path.join(logsDir, 'validation.log'),
      JSON.stringify(logEntry) + '\n'
    );
    
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error validating content:', error);
  process.exit(1);
}
