pipeline {
  agent any

  environment {
    GITHUB_TOKEN = credentials('git') 
  }

  stages {
    stage('Baixar código') {
      steps {
        git(
          branch: 'main',
          url: "https://${GITHUB_TOKEN}@github.com/a20n21/nginx-docker.git"
        )
      }
    }

    stage('Build da imagem') {
      steps {
        sh 'docker build -t nginx-vscode:latest .'
      }
    }

    stage('Parar container antigo') {
      steps {
        sh 'docker rm -f nginx-prod || true'
      }
    }

    stage('Subir novo container') {
      steps {
        sh '''
        docker run -d --name nginx-prod \
          -p 8081:80 \
          --restart always \
          nginx-vscode:latest
        '''
      }
    }
  }
}

