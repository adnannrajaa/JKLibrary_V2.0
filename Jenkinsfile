pipeline {
    agent any 

    environment {
        IMAGE_NAME = "jklibrary-image"  // Your Docker image name
        CONTAINER_NAME = "jklibrary-container"  // Your Docker container name
        DOCKER_REPO = "adnannrajaa/angular-app"  // Your Docker Hub repository name
    }

    stages {
        stage('Clone Repo') {
            steps {
                sshagent(credentials: ['Github_SSH_Key']) {
                    script {
                        dir('/var/lib/jenkins/workspace') {
                            // Clean existing contents inside the directory
                            sh 'rm -rf ./* .[^.]* || true'
                            
                            // Clone the repository
                            sh 'git clone --branch main git@github.com:adnannrajaa/JKLibrary_V2.0.git ./JKLibrary-Pipeline'
                            
                            // Set Git safe directory
                            sh 'git config --global --add safe.directory /var/lib/jenkins/workspace/JKLibrary-Pipeline'
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dir('/var/lib/jenkins/workspace/JKLibrary-Pipeline') {
                        // Build Docker image for the Angular app
                        sh "docker build -t ${IMAGE_NAME}:latest ."
                    }
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    """
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    // Run a new container for the Angular app
                    sh "docker run -d --name ${CONTAINER_NAME} -p 6063:80 ${IMAGE_NAME}:latest"
                    sh "docker update --restart unless-stopped ${CONTAINER_NAME}"
                }
            }
        }

        stage('Cleanup Docker Images') {
            steps {
                script {
                    // Clean up unused Docker images
                    sh 'docker image prune -f'
                }
            }
        }
    }
}
