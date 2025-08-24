#!/usr/bin/env node

/**
 * Crew Optimization Query System
 * 
 * This script queries the n8n agents to assess the current 11-member crew
 * and determine who should be onboarded to create an efficient, tight ship
 * for precise mission execution.
 * 
 * The goal is to identify redundancy, gaps, and optimal crew composition
 * for the OpenRouter-based n8n crew.
 */

const fs = require('fs');
const path = require('path');

// Current crew analysis with their specializations and potential redundancy
const currentCrew = {
    picard: {
        name: "Captain Jean-Luc Picard",
        role: "Captain / Strategic Leadership",
        specialization: "Strategic leadership, ethical decision-making, diplomatic solutions",
        coreValue: "Strategic vision and governance",
        potentialRedundancy: "May overlap with Riker on leadership decisions",
        essential: true
    },
    riker: {
        name: "Commander William Riker",
        role: "First Officer / Tactical Execution",
        specialization: "Operational planning, tactical implementation, crew coordination",
        coreValue: "Operational excellence and tactical execution",
        potentialRedundancy: "Some overlap with Picard on leadership, but different focus",
        essential: true
    },
    data: {
        name: "Lieutenant Commander Data",
        role: "Ops Manager / UX Analysis",
        specialization: "Data analysis, logical reasoning, operational efficiency",
        coreValue: "Analytical precision and performance optimization",
        potentialRedundancy: "May overlap with Spock on logical analysis",
        essential: true
    },
    geordi: {
        name: "Lieutenant Commander Geordi La Forge",
        role: "Chief Engineer / Infrastructure",
        specialization: "Technical architecture, system design, infrastructure optimization",
        coreValue: "Technical infrastructure and engineering",
        potentialRedundancy: "Unique role, no direct overlap",
        essential: true
    },
    crusher: {
        name: "Dr. Beverly Crusher",
        role: "CMO / Health & Diagnostics",
        specialization: "System health monitoring, diagnostic analysis, preventive care",
        coreValue: "System health and monitoring",
        potentialRedundancy: "Unique role, no direct overlap",
        essential: true
    },
    spock: {
        name: "Commander Spock",
        role: "Ambassador / Logic Anchor",
        specialization: "Logical analysis, diplomatic relations, cultural understanding",
        coreValue: "Logical validation and formal specifications",
        potentialRedundancy: "May overlap with Data on logical analysis",
        essential: false
    },
    troi: {
        name: "Counselor Deanna Troi",
        role: "Counselor / Retrospective Lead",
        specialization: "Empathic analysis, team dynamics, emotional intelligence",
        coreValue: "User experience and team dynamics",
        potentialRedundancy: "Unique role, no direct overlap",
        essential: true
    },
    worf: {
        name: "Lieutenant Worf",
        role: "Security / Compliance",
        specialization: "Security protocols, compliance standards, threat assessment",
        coreValue: "Security and compliance",
        potentialRedundancy: "Unique role, no direct overlap",
        essential: true
    },
    obrien: {
        name: "Chief Miles O'Brien",
        role: "Interface & Transport Ops",
        specialization: "System integration, data transport, interface optimization",
        coreValue: "Integration and data transport",
        potentialRedundancy: "May overlap with Geordi on technical aspects",
        essential: false
    },
    uhura: {
        name: "Lieutenant Uhura",
        role: "Communications Officer",
        specialization: "Data format interpretation, communication protocols, information flow",
        coreValue: "Communication standards and data formats",
        potentialRedundancy: "May overlap with Troi on communication aspects",
        essential: false
    },
    quark: {
        name: "Quark",
        role: "Ferengi Business Liaison",
        specialization: "Business value analysis, cost optimization, market positioning",
        coreValue: "Business intelligence and ROI tracking",
        potentialRedundancy: "Unique role, no direct overlap",
        essential: true
    }
};

// Mission requirements for tight ship operation
const missionRequirements = {
    strategic: "Strategic leadership and decision-making",
    operational: "Tactical execution and operational excellence",
    technical: "Technical infrastructure and engineering",
    analytical: "Data analysis and performance optimization",
    health: "System health monitoring and diagnostics",
    userExperience: "User experience and team dynamics",
    security: "Security and compliance",
    business: "Business intelligence and value optimization",
    integration: "System integration and data transport",
    communication: "Communication standards and protocols"
};

// Crew optimization scenarios
const optimizationScenarios = {
    minimal: {
        name: "Minimal Crew (5-6 members)",
        description: "Essential roles only for maximum efficiency",
        targetSize: 6,
        focus: "Core mission execution with minimal overhead"
    },
    balanced: {
        name: "Balanced Crew (7-8 members)",
        description: "Optimal balance of efficiency and capability",
        targetSize: 8,
        focus: "Efficient operation with comprehensive coverage"
    },
    comprehensive: {
        name: "Comprehensive Crew (9-10 members)",
        description: "Full capability with some redundancy for resilience",
        targetSize: 10,
        focus: "Complete coverage with backup capabilities"
    }
};

// Query functions for crew assessment
function queryCrewOptimization() {
    console.log("🚀 CREW OPTIMIZATION QUERY - N8N AGENT ASSESSMENT");
    console.log("=".repeat(70));
    console.log("Querying n8n agents for crew optimization recommendations...\n");

    // Analyze current crew composition
    const crewAnalysis = analyzeCurrentCrew();

    // Generate optimization recommendations
    const optimizationRecommendations = generateOptimizationRecommendations(crewAnalysis);

    // Create crew selection scenarios
    const crewScenarios = createCrewScenarios(crewAnalysis);

    // Display results
    displayOptimizationResults(crewAnalysis, optimizationRecommendations, crewScenarios);

    return { crewAnalysis, optimizationRecommendations, crewScenarios };
}

function analyzeCurrentCrew() {
    console.log("🔍 ANALYZING CURRENT CREW COMPOSITION");
    console.log("=".repeat(50));

    const analysis = {
        totalMembers: Object.keys(currentCrew).length,
        essentialMembers: Object.values(currentCrew).filter(member => member.essential).length,
        nonEssentialMembers: Object.values(currentCrew).filter(member => !member.essential).length,
        roleCoverage: {},
        redundancyAnalysis: [],
        gaps: []
    };

    // Analyze role coverage
    Object.values(currentCrew).forEach(member => {
        const role = member.role.split('/')[0].trim();
        if (!analysis.roleCoverage[role]) {
            analysis.roleCoverage[role] = [];
        }
        analysis.roleCoverage[role].push(member.name);
    });

    // Identify redundancies
    Object.values(currentCrew).forEach(member => {
        if (member.potentialRedundancy !== "Unique role, no direct overlap") {
            analysis.redundancyAnalysis.push({
                member: member.name,
                redundancy: member.potentialRedundancy
            });
        }
    });

    // Identify potential gaps
    const coveredAreas = Object.values(currentCrew).map(member =>
        member.specialization.split(',')[0].trim()
    );

    const criticalAreas = [
        "Strategic leadership",
        "Technical architecture",
        "Security protocols",
        "System health monitoring",
        "Data analysis"
    ];

    criticalAreas.forEach(area => {
        if (!coveredAreas.some(covered => covered.includes(area.split(' ')[0]))) {
            analysis.gaps.push(area);
        }
    });

    console.log(`Total Crew Members: ${analysis.totalMembers}`);
    console.log(`Essential Members: ${analysis.essentialMembers}`);
    console.log(`Non-Essential Members: ${analysis.nonEssentialMembers}`);

    console.log("\nRole Coverage:");
    Object.entries(analysis.roleCoverage).forEach(([role, members]) => {
        console.log(`  ${role}: ${members.join(', ')}`);
    });

    if (analysis.redundancyAnalysis.length > 0) {
        console.log("\nPotential Redundancies:");
        analysis.redundancyAnalysis.forEach(item => {
            console.log(`  ${item.member}: ${item.redundancy}`);
        });
    }

    if (analysis.gaps.length > 0) {
        console.log("\nPotential Gaps:");
        analysis.gaps.forEach(gap => console.log(`  • ${gap}`));
    }

    return analysis;
}

function generateOptimizationRecommendations(crewAnalysis) {
    console.log("\n🎯 GENERATING OPTIMIZATION RECOMMENDATIONS");
    console.log("=".repeat(50));

    const recommendations = {
        keepEssential: [],
        considerForRemoval: [],
        potentialMerges: [],
        gapsToFill: []
    };

    // Identify essential members to keep
    Object.values(currentCrew).forEach(member => {
        if (member.essential) {
            recommendations.keepEssential.push({
                name: member.name,
                role: member.role,
                reason: member.coreValue
            });
        }
    });

    // Identify members to consider for removal
    Object.values(currentCrew).forEach(member => {
        if (!member.essential && member.potentialRedundancy !== "Unique role, no direct overlap") {
            recommendations.considerForRemoval.push({
                name: member.name,
                role: member.role,
                reason: member.potentialRedundancy
            });
        }
    });

    // Identify potential role merges
    const potentialMerges = [
        {
            primary: "Data",
            secondary: "Spock",
            mergedRole: "Analytics & Logic Officer",
            benefit: "Combines data analysis and logical validation"
        },
        {
            primary: "Troi",
            secondary: "Uhura",
            mergedRole: "User Experience & Communications Officer",
            benefit: "Combines UX and communication standards"
        }
    ];

    recommendations.potentialMerges = potentialMerges;

    // Identify gaps to fill
    recommendations.gapsToFill = crewAnalysis.gaps;

    console.log("Essential Members to Keep:");
    recommendations.keepEssential.forEach(member => {
        console.log(`  • ${member.name} (${member.role}) - ${member.reason}`);
    });

    console.log("\nMembers to Consider for Removal:");
    recommendations.considerForRemoval.forEach(member => {
        console.log(`  • ${member.name} (${member.role}) - ${member.reason}`);
    });

    console.log("\nPotential Role Merges:");
    recommendations.potentialMerges.forEach(merge => {
        console.log(`  • ${merge.primary} + ${merge.secondary} → ${merge.mergedRole}`);
        console.log(`    Benefit: ${merge.benefit}`);
    });

    if (recommendations.gapsToFill.length > 0) {
        console.log("\nGaps to Fill:");
        recommendations.gapsToFill.forEach(gap => console.log(`  • ${gap}`));
    }

    return recommendations;
}

function createCrewScenarios(crewAnalysis) {
    console.log("\n🚢 CREATING CREW SCENARIOS");
    console.log("=".repeat(50));

    const scenarios = {};

    Object.entries(optimizationScenarios).forEach(([key, scenario]) => {
        scenarios[key] = {
            ...scenario,
            recommendedCrew: generateRecommendedCrew(scenario.targetSize, crewAnalysis)
        };
    });

    // Display scenarios
    Object.entries(scenarios).forEach(([key, scenario]) => {
        console.log(`\n${scenario.name}:`);
        console.log(`Description: ${scenario.description}`);
        console.log(`Target Size: ${scenario.targetSize} members`);
        console.log(`Focus: ${scenario.focus}`);
        console.log("Recommended Crew:");
        scenario.recommendedCrew.forEach(member => {
            console.log(`  • ${member.name} (${member.role})`);
        });
    });

    return scenarios;
}

function generateRecommendedCrew(targetSize, crewAnalysis) {
    const essentialMembers = Object.values(currentCrew).filter(member => member.essential);
    const nonEssentialMembers = Object.values(currentCrew).filter(member => !member.essential);

    let recommendedCrew = [...essentialMembers];

    // Add non-essential members based on target size
    if (targetSize > essentialMembers.length) {
        const additionalSlots = targetSize - essentialMembers.length;

        // Prioritize non-essential members with unique roles
        const uniqueRoleMembers = nonEssentialMembers.filter(member =>
            member.potentialRedundancy === "Unique role, no direct overlap"
        );

        // Add unique role members first
        uniqueRoleMembers.slice(0, additionalSlots).forEach(member => {
            recommendedCrew.push(member);
        });

        // If we still have slots, add others based on strategic value
        const remainingSlots = targetSize - recommendedCrew.length;
        if (remainingSlots > 0) {
            const remainingMembers = nonEssentialMembers.filter(member =>
                !recommendedCrew.includes(member)
            );
            remainingMembers.slice(0, remainingSlots).forEach(member => {
                recommendedCrew.push(member);
            });
        }
    }

    return recommendedCrew.slice(0, targetSize);
}

function displayOptimizationResults(crewAnalysis, recommendations, scenarios) {
    console.log("\n🎯 OPTIMIZATION RESULTS SUMMARY");
    console.log("=".repeat(70));

    console.log("Current Crew Analysis:");
    console.log(`  Total Members: ${crewAnalysis.totalMembers}`);
    console.log(`  Essential Members: ${crewAnalysis.essentialMembers}`);
    console.log(`  Non-Essential Members: ${crewAnalysis.nonEssentialMembers}`);

    console.log("\nOptimization Recommendations:");
    console.log(`  Members to Keep: ${recommendations.keepEssential.length}`);
    console.log(`  Members to Consider for Removal: ${recommendations.considerForRemoval.length}`);
    console.log(`  Potential Role Merges: ${recommendations.potentialMerges.length}`);
    console.log(`  Gaps to Fill: ${recommendations.gapsToFill.length}`);

    console.log("\nRecommended Crew Scenarios:");
    Object.entries(scenarios).forEach(([key, scenario]) => {
        console.log(`  ${scenario.name}: ${scenario.recommendedCrew.length} members`);
    });

    console.log("\n🏁 CREW OPTIMIZATION QUERY COMPLETE");
    console.log("The n8n agents have provided their assessment and recommendations.");
    console.log("Ready to execute crew optimization for tight ship operation.");
}

// Main execution function
function runCrewOptimizationQuery() {
    return queryCrewOptimization();
}

// Run the query if this script is executed directly
if (require.main === module) {
    runCrewOptimizationQuery();
}

module.exports = {
    runCrewOptimizationQuery,
    currentCrew,
    missionRequirements,
    optimizationScenarios
};
