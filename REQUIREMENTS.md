Help me create a fun little application with nextjs, which let's the user input various numbers for above fields and they get a graph showing their startup runway by month

Libraries: recharts, shadcn/ui

Factors for Calculating Startup Runway, Each of these items represent a form section in the application

1. Total Funding
2. Engineering Costs, ask user to input count and annual salary for each type of engineer in the matrix(onshore/offshore v/s junior/senior)
3. SaaS Expenses assume per seat cost for each tools, ask use to select with checkboxes which ones they use. Include the most used saas products across categories in this sections, with heading for each category
   - Messaging: Slack/Teams
   - Version Control: GitHub/GitLab
   - CRM: Hubspot, Salesforce
   - HR: Workday
   - Project Management: Jira, Asana
   - Documentation: Confluence
   - Communication: Zoom
   - Productivity: Google Workspace
   - Cloud Services: AWS, GCP, Azure

4. Marketing Expenses: ask user to enter Monthly budget

5. Office Expenses: create a function that estimates this based on the number of in office employees(ask user for this) and the average cost per month for each office expense(assume sane defaults for office space rental, utilities, internet, phone, maintenance, etc.)

6. Acquisitions: ask user to enter the cost of any new company acquisitions, allow user to enter the total amount of money spent on acquisitions


