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
        sh 'docker build -t nginx-vscode:latest .'
      }
    }

    stage('Testes') {
      steps {
        sh 'docker run --rm nginx-vscode:latest nginx -t'
      }
    }

    stage('Deploy Produção') {
      when {
        branch 'main'
      }
      steps {
        sh 'docker rm -f nginx-prod || true'
        sh 'docker run -d --name nginx-prod -p 8081:80 --restart always nginx-vscode:latest'
      }
    }
  }
}


