EXP-13: CI/CD Pipeline using Jenkins and Docker
================================================

Files:
- app.js       : Sample Node.js application
- test.js      : Automated test
- Dockerfile   : Container image instructions
- Jenkinsfile  : Jenkins pipeline (Build -> Test -> Local Deploy; optional AWS ECS stage)

QUICK SETUP (Windows + Docker Desktop)
--------------------------------------
1. Install Docker Desktop and make sure it is running.
   Official guide: https://docs.docker.com/desktop/setup/install/windows-install/

2. Install Java 21 and Jenkins for Windows, or run Jenkins WAR using Java 21.
   Official Jenkins install guide: https://www.jenkins.io/doc/book/installing/windows/

3. Open Jenkins at http://localhost:8080 and finish the setup wizard.
   Install suggested plugins, including Pipeline and Git.

4. Copy this project folder into a Git repository and push it to GitHub.
   Make sure Dockerfile and Jenkinsfile are at the repository root.

5. In Jenkins, choose New Item -> Pipeline -> OK.
   Under Pipeline:
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: your GitHub repository URL
   - Branch: */main (or your repository's default branch)
   - Script Path: Jenkinsfile
   Save, then click Build Now.

6. Check Console Output. Successful local deployment should show the container running.
   Open http://localhost:3000 in your browser.

AUTOMATIC BUILDS
----------------
For a quick local setup, open the Jenkins job -> Configure -> Build Triggers and select
"Poll SCM", then enter: H/2 * * * *
This checks Git for changes approximately every two minutes.

For a GitHub webhook, the Jenkins server must be reachable by GitHub over the internet.
In GitHub repository -> Settings -> Webhooks -> Add webhook:
Payload URL: https://YOUR-PUBLIC-JENKINS-URL/github-webhook/
Content type: application/json
Choose push events. Do not use localhost as the webhook URL.

OPTIONAL AWS ECS DEPLOYMENT
---------------------------
The AWS stage is skipped unless these Jenkins environment variables are configured:
AWS_ECR_URI     = your ECR registry/repository URI (example: account.dkr.ecr.region.amazonaws.com/repository)
AWS_REGION      = your AWS region (example: ap-south-1)
AWS_ECS_CLUSTER = your ECS cluster name
AWS_ECS_SERVICE = your ECS service name

You also need AWS CLI installed and valid AWS credentials configured securely on the Jenkins agent.
Create the ECR repository and ECS service/task definition first. The ECS task definition must reference
the image tag used by this pipeline or be updated to use the pushed tag for a fully versioned rollout.
Never put AWS access keys directly in the Jenkinsfile or source repository.

NOTE
----
The included pipeline deploys locally by default. Cloud deployment is only performed after AWS is
configured. For a college demo, show Jenkins stage results and the app running at localhost:3000.
