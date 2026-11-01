pipeline {
    agent any

    environment {
        IMAGE_NAME = 'exp13-cicd-app'
        CONTAINER_NAME = 'exp13-cicd-app'
        HOST_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code checked out by Jenkins.'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%BUILD_NUMBER% .'
                bat 'docker tag %IMAGE_NAME%:%BUILD_NUMBER% %IMAGE_NAME%:latest'
            }
        }

        stage('Test Application') {
            steps {
                bat 'docker run --rm %IMAGE_NAME%:%BUILD_NUMBER% node --test test.js'
            }
        }

        stage('Deploy Locally') {
            steps {
                bat 'docker rm -f %CONTAINER_NAME% 2>NUL || exit /b 0'
                bat 'docker run -d --name %CONTAINER_NAME% -p %HOST_PORT%:3000 %IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'docker ps --filter name=%CONTAINER_NAME%'
            }
        }

        stage('Deploy to AWS ECS (Optional)') {
            when {
                expression {
                    return env.AWS_ECR_URI?.trim() &&
                           env.AWS_ECS_CLUSTER?.trim() &&
                           env.AWS_ECS_SERVICE?.trim() &&
                           env.AWS_REGION?.trim()
                }
            }
            steps {
                echo 'Optional AWS deployment: requires AWS CLI, configured AWS credentials, ECR repository, and ECS service.'
                bat 'aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %AWS_ECR_URI%'
                bat 'docker tag %IMAGE_NAME%:%BUILD_NUMBER% %AWS_ECR_URI%:%BUILD_NUMBER%'
                bat 'docker push %AWS_ECR_URI%:%BUILD_NUMBER%'
                bat 'aws ecs update-service --cluster %AWS_ECS_CLUSTER% --service %AWS_ECS_SERVICE% --force-new-deployment --region %AWS_REGION%'
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Open Console Output to identify the failed stage.'
        }
    }
}
