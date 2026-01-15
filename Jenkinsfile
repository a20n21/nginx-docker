pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build da imagem') {
            steps {
                sh 'docker rm -f nginx-prod || true'
                sh 'docker build -t nginx-prod:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker run -d --name nginx-prod -p 8081:80 --restart always nginx-prod:latest'
            }
        }
    }
}
