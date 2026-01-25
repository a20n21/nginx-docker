pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "matias1210/nginx-prod"
        TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t $DOCKER_IMAGE:$TAG .
                docker tag $DOCKER_IMAGE:$TAG $DOCKER_IMAGE:latest
                """
            }
        }

        stage('Login Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh """
                docker push $DOCKER_IMAGE:$TAG
                docker push $DOCKER_IMAGE:latest
                """
            }
        }
    }
}
