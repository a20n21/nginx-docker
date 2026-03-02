pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "matias1210/nginx-prod"
        TAG = "${BUILD_NUMBER}"
        KUBE_DEPLOYMENT = "nginx-prod"
        KUBE_NAMESPACE = "default"
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

        stage('Deploy to Kubernetes') {
            steps {
                // Aqui usamos o secret do kubeconfig
                withCredentials([string(credentialsId: 'kubeconfig-secret', variable: 'KUBECONFIG_CONTENT')]) {
                    sh '''
                        # Cria arquivo temporário kubeconfig
                        echo "$KUBECONFIG_CONTENT" > kubeconfig_temp
                        export KUBECONFIG=$(pwd)/kubeconfig_temp

                        # Testa conexão
                        echo "Nodes do cluster:"
                        kubectl get nodes

                        # Atualiza a imagem do deployment
                        kubectl set image deployment/$KUBE_DEPLOYMENT \
                        nginx=$DOCKER_IMAGE:$TAG \
                        -n $KUBE_NAMESPACE

                        # Acompanha rollout
                        kubectl rollout status deployment/$KUBE_DEPLOYMENT -n $KUBE_NAMESPACE
                    '''
                }
            }
        }
    }

    post {
        always {
            // Limpeza
            sh 'rm -f kubeconfig_temp'
        }
        success {
            echo "Pipeline finalizado com sucesso! 🚀"
        }
        failure {
            echo "Pipeline falhou 😢"
        }
    }
}