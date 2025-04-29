/**
 * Test script to validate ChatGPT-analyzed JSON against Zod schemas
 *
 * This script tests if the JSON structure produced by ChatGPT's analysis
 * is compatible with our Zod schemas.
 */

const { z } = require('zod');
const fs = require('fs');
const path = require('path');

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

// Schema for the complete ChatGPT response
const ChatGptResponseSchema = z.object({
  sections: SectionsSchema,
  structuredContent: StructuredContentSchema
});

// The ChatGPT-analyzed JSON
const chatGptJson = {
  "sections": {
    "name": "BENJAMIN STEIN",
    "header": [
      "BENJAMIN STEIN"
    ],
    "about": [],
    "contact": [
      "+1 (314)-809-1836",
      "benjaminsteinstl@gmail.com"
    ],
    "skills": [
      "Implementation, maintenance, and training of web-based EHR system",
      "Enterprise web browser",
      "Google Enterprise",
      "Administrative roles within Panorama 9, Verkada, SiPass, Zendesk, IT Glue, Chartnote",
      "On / Off-boarding of office and clinical users",
      "Configuring securities and permissions",
      "Communicating with third party vendors",
      "Troubleshooting EMR, Network, Interfaces, PC's, Hardware, and Web Applications",
      "Creating, modifying, or running reports via TruBridge Report Builder",
      "Support for clinical and office staff",
      "Implementation of new functionality within Cerner suite",
      "Training and access for clinical staff",
      "Design and interpret reports in SAP Business Objects and Discern Analytics",
      "Track tickets using Service Now",
      "Maintain inventory of PC's",
      "Manage user sessions with Citrix Desktop Director",
      "24x7 IT support",
      "Hardware and OS issues",
      "Applications associated with hospital health Information systems",
      "Monitoring and Maintaining health information integration engines",
      "Management and manipulation of HL7 messages",
      "VPN repair and eCare integration",
      "Remote support via Simple-Help remote desktop",
      "Tasks within Active Directory, Exchange and SQL",
      "Creation/configuration of virtual A/V servers"
    ],
    "experience": [
      "CLINICAL INFORMATICS SPECIALIST",
      "Homer G. Phillips Memorial Hospital",
      "MAR 2023 - Current",
      "Clinical Analyst II",
      "Shriners Hospital for Children",
      "MAR 2018 - MAR 2023",
      "Clinical Analyst I",
      "Advanced ICU Care",
      "APR 2012 - FEB 2015",
      "IT Specialist",
      "Boeing",
      "2/17 - 2/18",
      "Graphic Designer",
      "Baked Tees",
      "4/11 - 4/12",
      "IT Specialist",
      "Tek Systems",
      "3/10 - 9/10",
      "Mobile Technician",
      "Nexicore Technology",
      "4/09 - 11/09",
      "Graphic Designer",
      "Think Tank Design",
      "2/07"
    ],
    "education": [
      "Ranken Technical College",
      "2010 - 2012",
      "Network & Database Administration",
      "St. Louis Community College",
      "2002 - 2005",
      "Graphic Communications"
    ],
    "clients": [],
    "other": [
      "Certifications:",
      "M.C.T.S - Windows Xp",
      "M.C.T.S - VISTA",
      "M.C.T.S - Server 08 R2",
      "M.C.T.S - Active Directory",
      "M.C.T.S - SQL",
      "CompTIA - A+",
      "Dell Certified Systems Expert",
      "Sony-certified - laptop repair",
      "HIPAA Certified",
      "References:",
      "Karen Johnson",
      "C.E.O.",
      "Homer G. Phillips Memorial Hospital",
      "+1 (314) 399-4288",
      "Susan \"Angie\" Kinney",
      "Clinical Analyst II",
      "Shriners Hospital for Children",
      "+1 (618) 960-5628",
      "Justin Thuli Manager of I.T.",
      "Advanced ICU Care",
      "+1 (608) 215-9302"
    ]
  },
  "structuredContent": {
    "name": "BENJAMIN STEIN",
    "summary": "Clinical Informatics Specialist with extensive experience in IT support and health information systems.",
    "contact": [
      {
        "text": "benjaminsteinstl@gmail.com"
      },
      {
        "text": "+1 (314)-809-1836"
      }
    ],
    "skills": [
      {
        "text": "Implementation, maintenance, and training of web-based EHR system"
      },
      {
        "text": "Enterprise web browser"
      },
      {
        "text": "Google Enterprise"
      },
      {
        "text": "Administrative roles within Panorama 9, Verkada, SiPass, Zendesk, IT Glue, Chartnote"
      },
      {
        "text": "On / Off-boarding of office and clinical users"
      },
      {
        "text": "Configuring securities and permissions"
      },
      {
        "text": "Communicating with third party vendors"
      },
      {
        "text": "Troubleshooting EMR, Network, Interfaces, PC's, Hardware, and Web Applications"
      },
      {
        "text": "Creating, modifying, or running reports via TruBridge Report Builder"
      },
      {
        "text": "Support for clinical and office staff"
      },
      {
        "text": "Implementation of new functionality within Cerner suite"
      },
      {
        "text": "Training and access for clinical staff"
      },
      {
        "text": "Design and interpret reports in SAP Business Objects and Discern Analytics"
      },
      {
        "text": "Track tickets using Service Now"
      },
      {
        "text": "Maintain inventory of PC's"
      },
      {
        "text": "Manage user sessions with Citrix Desktop Director"
      },
      {
        "text": "24x7 IT support"
      },
      {
        "text": "Hardware and OS issues"
      },
      {
        "text": "Applications associated with hospital health Information systems"
      },
      {
        "text": "Monitoring and Maintaining health information integration engines"
      },
      {
        "text": "Management and manipulation of HL7 messages"
      },
      {
        "text": "VPN repair and eCare integration"
      },
      {
        "text": "Remote support via Simple-Help remote desktop"
      },
      {
        "text": "Tasks within Active Directory, Exchange and SQL"
      },
      {
        "text": "Creation/configuration of virtual A/V servers"
      }
    ],
    "experience": [
      {
        "period": "MAR 2023 - Current",
        "company": "Homer G. Phillips Memorial Hospital",
        "title": "Clinical Informatics Specialist",
        "description": "Responsible for systems and technologies at the hospital, including EHR system implementation and maintenance, user onboarding, and troubleshooting."
      },
      {
        "period": "MAR 2018 - MAR 2023",
        "company": "Shriners Hospital for Children",
        "title": "Clinical Analyst II",
        "description": "Provided 24x7 IT support for clinical staff, managed health information systems, and supported remote clinical staff."
      },
      {
        "period": "APR 2012 - FEB 2015",
        "company": "Advanced ICU Care",
        "title": "Clinical Analyst I",
        "description": "Extended experience in IT support and health information systems."
      },
      {
        "period": "2/17 - 2/18",
        "company": "Boeing",
        "title": "IT Specialist",
        "description": "Under Contract by RMS."
      },
      {
        "period": "4/11 - 4/12",
        "company": "Baked Tees",
        "title": "Graphic Designer",
        "description": "Worked as a graphic designer."
      },
      {
        "period": "3/10 - 9/10",
        "company": "Tek Systems",
        "title": "IT Specialist",
        "description": "Worked as an IT Specialist."
      },
      {
        "period": "4/09 - 11/09",
        "company": "Nexicore Technology",
        "title": "Mobile Technician",
        "description": "Worked as a mobile technician."
      },
      {
        "period": "2/07",
        "company": "Think Tank Design",
        "title": "Graphic Designer",
        "description": "Worked as a graphic designer."
      }
    ],
    "education": [
      {
        "degree": "Network & Database Administration",
        "institution": "Ranken Technical College",
        "period": "2010 - 2012"
      },
      {
        "degree": "Graphic Communications",
        "institution": "St. Louis Community College",
        "period": "2002 - 2005"
      }
    ],
    "clients": [],
    "about": ""
  }
};

// Test the ChatGPT response against our schema
try {
  const validationResult = ChatGptResponseSchema.safeParse(chatGptJson);

  if (validationResult.success) {
    console.log('✅ Validation successful! The ChatGPT response is compatible with our Zod schema.');
    console.log('Validated data:', JSON.stringify(validationResult.data, null, 2).substring(0, 100) + '...');
  } else {
    console.error('❌ Validation failed!');
    console.error('Validation errors:');
    validationResult.error.errors.forEach(err => {
      console.error(`- Path: ${err.path.join('.')}, Error: ${err.message}`);
    });
  }
} catch (error) {
  console.error('❌ Error during validation:', error);
}

// Test against the actual schema used in the application
console.log('\nTesting against application schema...');

// Create a more complex test that simulates how the application would use this data
function testApplicationUsage() {
  // Simulate extracting data for the application
  const { structuredContent } = chatGptJson;

  // Test if we can access all the expected properties
  try {
    // Access name
    console.log(`Name: ${structuredContent.name}`);

    // Access contact information
    console.log('Contact Information:');
    structuredContent.contact.forEach(contact => {
      console.log(`- ${contact.text}`);
    });

    // Access skills
    console.log('Skills:');
    structuredContent.skills.forEach(skill => {
      console.log(`- ${skill.text}`);
    });

    // Access experience
    console.log('Experience:');
    structuredContent.experience.forEach(exp => {
      console.log(`- ${exp.title} at ${exp.company} (${exp.period})`);
      if (exp.description) {
        console.log(`  ${exp.description}`);
      }
    });

    // Access education
    console.log('Education:');
    structuredContent.education.forEach(edu => {
      console.log(`- ${edu.degree || 'Degree'} at ${edu.institution} (${edu.period || 'N/A'})`);
    });

    console.log('\n✅ Application usage test passed! All expected properties are accessible.');
  } catch (error) {
    console.error('\n❌ Application usage test failed!', error);
  }
}

// Run the application usage test
testApplicationUsage();
