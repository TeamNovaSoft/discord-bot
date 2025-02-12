# Deployment Documentation with GitHub Actions

## Introduction

This guide explains how to set up a GitHub Actions workflow to deploy an application to a remote server (e.g., AWS EC2). It also details the required environment variables for automation to work correctly.

## Setting Up Environment Variables in GitHub Actions

To successfully deploy, certain environment variables need to be configured as secrets in the GitHub repository.

### Required Variables

| Variable              | Description                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| `AWS_HOST`            | IP address or domain of the EC2 instance. Example: `ec2-18-231-104-85.sa-east-1.compute.amazonaws.com` |
| `AWS_SSH_PRIVATE_KEY` | SSH private key to access the EC2 instance. Must match the public key in `~/.ssh/authorized_keys`.     |
| `AWS_USER`            | User with deployment permissions. Usually `ec2-user` for Amazon Linux or `ubuntu` for Ubuntu.          |
| `AWS_WORK_DIRECTORY`  | Path where the app is hosted on EC2. Example: `/home/ec2-user/app`.                                    |

## Example GitHub Actions Workflow Configuration

This workflow performs the following steps:

- Connects to the server using SSH.

- Navigates to the work directory defined in AWS_WORK_DIRECTORY.

- Clones the repository if it's the first time.

- Runs git pull to update the code.

- Installs dependencies with npm install.

- Restarts the application with pm2.

```yaml
name: Deploy to AWS EC2
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Deploy to AWS EC2
        run: |
          ssh -o StrictHostKeyChecking=no -i ~/.ssh/aws_key.pem ${{ secrets.AWS_USER }}@${{ secrets.AWS_HOST }} << 'EOF'
            eval "$(ssh-agent -s)"
            ssh-add ~/.ssh/github_key
            if [ ! -d "${{ secrets.AWS_WORK_DIRECTORY }}/.git" ]; then
              git clone git@github.com:YOUR_USER/YOUR_REPO.git ${{ secrets.AWS_WORK_DIRECTORY }}
            fi
            cd ${{ secrets.AWS_WORK_DIRECTORY }}
            git pull origin main
            npm install
            pm2 restart app || pm2 start index.js --name app
          EOF
```

## How to Add Environment Variables in GitHub

1. Go to your repository on GitHub.
2. In the Settings tab, select Secrets and variables → Actions.
3. Add each variable in Repository secrets with its respective values.

## Summary

- AWS_HOST → EC2 instance IP or domain.
- AWS_SSH_PRIVATE_KEY → SSH private key for access.
- AWS_USER → User to connect to the instance.
- AWS_WORK_DIRECTORY → Path where the application is hosted on EC2.

With this configuration, GitHub Actions can automate the deployment of your application on AWS EC2 securely and efficiently. 🚀
