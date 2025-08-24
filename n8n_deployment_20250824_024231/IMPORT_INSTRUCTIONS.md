# AlexAI Crew N8N Import Instructions

1. Open your n8n instance: https://n8n.pbradygeorgen.com
2. Set up OpenRouter credentials (see instructions above)
3. Go to Workflows → Import from file
4. Import each workflow from the 'ready_to_import/' directory:

   Import order (recommended):
   • ready_to_import_mission_coordinator_workflow.json → Captain Picard
   • ready_to_import_execution_commander_workflow.json → Commander Riker
   • ready_to_import_specialist_1_data_workflow.json → Lieutenant Commander Data
   • ready_to_import_specialist_2_geordi_workflow.json → Lieutenant Commander Geordi
   • ready_to_import_specialist_3_crusher_workflow.json → Dr. Beverly Crusher
   • ready_to_import_specialist_4_worf_workflow.json → Lieutenant Worf
   • ready_to_import_specialist_5_troi_workflow.json → Counselor Deanna Troi
   • ready_to_import_specialist_6_uhura_workflow.json → Lieutenant Uhura
   • ready_to_import_specialist_7_quark_workflow.json → Quark

5. After importing, update each workflow's OpenAI node:
   • Click on the OpenAI node
   • In Authentication, select 'OpenRouter API'
   • Verify Base URL is: https://openrouter.ai/api/v1
   • Verify Model is set correctly for each crew member

6. Activate workflows one by one for testing
7. Test each crew member individually
8. Enjoy your optimized AlexAI crew!
