"use strict";(()=>{var e={};e.id=345,e.ids=[345],e.modules={846:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1630:e=>{e.exports=require("http")},1997:e=>{e.exports=require("punycode")},3024:e=>{e.exports=require("node:fs")},3033:e=>{e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3873:e=>{e.exports=require("path")},4075:e=>{e.exports=require("zlib")},4870:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5511:e=>{e.exports=require("crypto")},5591:e=>{e.exports=require("https")},6023:(e,r,t)=>{t.r(r),t.d(r,{patchFetch:()=>f,routeModule:()=>y,serverHooks:()=>x,workAsyncStorage:()=>v,workUnitAsyncStorage:()=>w});var n={};t.r(n),t.d(n,{GET:()=>g});var i=t(6559),a=t(8088),s=t(7719),o=t(2190),l=t(9021),c=t.n(l),u=t(3873),p=t.n(u),m=t(9369),d=t(5464),h=t(9475);async function g(e){try{m.x.success.basic("Summary API called");let e=p().join(process.cwd(),"public"),r=p().join(e,"extracted/resume_content.md");if(!c().existsSync(r))return m.x.error.runtime("Resume content file not found"),o.NextResponse.json({success:!1,error:"Resume content file not found"},{status:404});let t=c().readFileSync(r,"utf8");if(!(process.env.OPENAI_API_KEY&&"true"===process.env.USE_OPENAI))return m.x.warn.performance("OpenAI integration is disabled. Using fallback summary"),d.v.ai.warning("OpenAI integration is disabled. Using fallback summary"),o.NextResponse.json({success:!0,summary:`# P. Brady Georgen - Cover Letter

## Summary

I'm a seasoned software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.

## My Skills

- Full Stack Development
- JavaScript/TypeScript
- React/React Native
- AWS
- UI/UX Design
- Creative Technology
- Problem-Solving

## Industries I've Worked In

- Business Solutions
- Communications
- Healthcare/Pharmaceutical
- Financial Services

## My Career Journey

I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader. I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

## My Education

I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving.

## What I'm Looking For

- I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities
- I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference
`});try{d.v.summary.start("Starting summary generation with OpenAI");try{let e=Date.now(),r=await (0,h.H6)(t),n=Date.now();return d.v.summary.complete(`Summary formatted in ${n-e}ms`),o.NextResponse.json({success:!0,summary:r})}catch(a){d.v.summary.error(`Error formatting summary: ${a}`),m.x.warn.deprecated("Falling back to analysis-based summary generation");let e=Date.now(),r=await (0,h.Oq)(t,!1),n=Date.now();m.x.success.core(`OpenAI summary generated in ${n-e}ms`);let i=`# P. Brady Georgen - Cover Letter

## Summary

${r.summary}

## My Skills

${r.keySkills.map(e=>`- ${e}`).join("\n")}

## Industries I've Worked In

${r.industryExperience.map(e=>`- ${e}`).join("\n")}

## My Career Journey

I've been in the industry for over ${r.yearsOfExperience.replace(/^I've been in the industry for over /,"")}. During this time, I've had the privilege of working with major clients and growing both technically and as a leader. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

${r.careerHighlights.slice(0,2).map(e=>e).join(" ")}

## My Education

${r.educationLevel}

## What I'm Looking For

${r.recommendations.map(e=>`- ${e}`).join("\n")}
`;return o.NextResponse.json({success:!0,summary:i})}}catch(e){return m.x.error.runtime(`Error generating summary with OpenAI: ${e}`),d.v.summary.error(`Summary generation failed: ${e}`),o.NextResponse.json({success:!0,summary:`# P. Brady Georgen - Cover Letter

## Summary

I'm a seasoned software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.

## My Skills

- Full Stack Development
- JavaScript/TypeScript
- React/React Native
- AWS
- UI/UX Design
- Creative Technology
- Problem-Solving

## Industries I've Worked In

- Business Solutions
- Communications
- Healthcare/Pharmaceutical
- Financial Services

## My Career Journey

I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader. I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

## My Education

I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving.

## What I'm Looking For

- I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities
- I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference
`})}}catch(e){return m.x.error.runtime(`Error in get-summary API: ${e}`),o.NextResponse.json({success:!1,error:e instanceof Error?e.message:"Unknown error"},{status:500})}}let y=new i.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/get-summary/route",pathname:"/api/get-summary",filename:"route",bundlePath:"app/api/get-summary/route"},resolvedPagePath:"/Users/bradygeorgen/Documents/workspace/pbradygeorgen/app/api/get-summary/route.ts",nextConfigOutput:"",userland:n}),{workAsyncStorage:v,workUnitAsyncStorage:w,serverHooks:x}=y;function f(){return(0,s.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:w})}},7075:e=>{e.exports=require("node:stream")},7830:e=>{e.exports=require("node:stream/web")},7910:e=>{e.exports=require("stream")},8354:e=>{e.exports=require("util")},9021:e=>{e.exports=require("fs")},9294:e=>{e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},9551:e=>{e.exports=require("url")}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[447,199,905,831],()=>t(6023));module.exports=n})();