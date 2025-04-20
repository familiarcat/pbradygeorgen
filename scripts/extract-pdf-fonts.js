const fs = require('fs');
const pdf = require('pdf-parse');

// Read the PDF file
const dataBuffer = fs.readFileSync('./public/pbradygeorgen_resume.pdf');

pdf(dataBuffer).then(function(data) {
  // The raw PDF data contains font information
  const text = data.text;
  
  // Look for font declarations in the raw data
  const fontMatches = data.metadata && data.metadata.toString().match(/\/Font\s+<<(.*?)>>/gs);
  
  if (fontMatches && fontMatches.length > 0) {
    console.log('Font information found:');
    console.log(fontMatches);
  } else {
    console.log('No font information found in metadata.');
    console.log('Trying to extract from raw data...');
    
    // Try to find font names in the raw data
    const rawData = data.metadata ? data.metadata.toString() : '';
    const fontNameMatches = rawData.match(/\/BaseFont\s*\/([A-Za-z0-9+]+)/g);
    
    if (fontNameMatches && fontNameMatches.length > 0) {
      console.log('Font names found:');
      fontNameMatches.forEach(match => {
        console.log(match.replace('/BaseFont/', ''));
      });
    } else {
      console.log('Could not extract font information from this PDF.');
    }
  }
}).catch(function(error) {
  console.error('Error parsing PDF:', error);
});
