pipeline {
    
    agent {label "dev"}
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ayushsoni155/skillsyncAiServer.git'
            }
        }

        stage('Build') {
            steps {
                withCredentials([usernamePassword(
                credentialsId:"dockerhubCreds",
                passwordVariable:"dockerHPass",
                usernameVariable:"dockerHUser")]){
                sh "docker build -t ${env.dockerHUser}/skillserver ."
                }
            }
        }
        stage('Push to Dockerhub'){
            steps{
                withCredentials([usernamePassword(
                credentialsId:"dockerhubCreds",
                passwordVariable:"dockerHPass",
                usernameVariable:"dockerHUser")]){
                    sh "docker login -u ${env.dockerHUser} -p ${env.dockerHPass}"
                    sh "docker push ${env.dockerHUser}/skillserver"
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d --build'
            }
        }
    }
    post {
        failure {
            script{
                 emailext from: 'ayushsoni6997@gmail.com',
                 to: 'agent47.6997@gmail.com',
                 subject: "FAILED: Build ${env.JOB_NAME}", 
                 body: "Build failed: ${env.JOB_NAME} (No. ${env.BUILD_NUMBER})"
                }
            }
    
        success {
            script{
                 emailext from: 'ayushsoni6997@gmail.com',
                 to: 'agent47.6997@gmail.com',
                 subject: "SUCCESSFUL: Build ${env.JOB_NAME}", 
                 body: "Build Successful: ${env.JOB_NAME} (No. ${env.BUILD_NUMBER})"
                }
        }
    }
}
