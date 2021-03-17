pipeline {
  agent any
  environment {
    registry = "fwork-header"
    dockerImage = ''
    host = '118.68.218.94:5000'
    port = '9010:9010'
    containerName = 'fwork-header'
    containerId = null
  }

  tools {
    nodejs "node"
    'org.jenkinsci.plugins.docker.commons.tools.DockerTool' 'docker'
  }

  stages {

    stage('Cloning Git') {
      steps {
        git 'git@118.68.218.91:fpt.work/header/header.git'
      }
    }

    // stage('Install dependencies') {
    //   steps {
    //     sh 'npm install'
    //   }
    // }

    // stage('Unit test, esline') {
    //   steps {
    //     sh 'npm test'
    //   }
    // }

    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry + ":$BUILD_NUMBER"
          containerId = sh(script: "docker ps -aq -f name=$containerName", returnStdout: true).trim()
        }
      }
    }
    stage('Push Image to Docker Registry') {
      steps{
        script {
          docker.withRegistry('http://$host') {
            dockerImage.push()
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
    stage('Deploy to Docker'){
      steps{
        script{
          if (containerId.isEmpty()) {
            // sh "docker pull $host/$registry:$BUILD_NUMBER"
            sh "docker run --name $containerName -td -p $port $host/$registry:$BUILD_NUMBER"
          }
          else {
            // echo 'containerId' + containerId
            sh "docker stop $containerName"
            sh "docker rm $containerName"
            sh "docker run --name $containerName -td -p $port $host/$registry:$BUILD_NUMBER"
          }
        }
      }
    }
  }
}