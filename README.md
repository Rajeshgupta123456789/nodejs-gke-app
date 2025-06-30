# nodejs-gke-app



Great! Here's a structured `README.md` template you can use to document your project:

---

# 🌐 Node.js Portfolio App on Google Kubernetes Engine (GKE) with GitLab CI/CD

## 📋 Overview

This project demonstrates how to containerize a Node.js application, push it to Google Container Registry (Artifact Registry), and deploy it to a Google Kubernetes Engine (GKE) cluster using GitLab CI/CD.

## 🛠️ Technologies Used

* Node.js
* Docker
* Kubernetes (GKE)
* GitLab CI/CD
* Google Cloud Platform (GCP)
* Artifact Registry

## 📦 Project Structure

```
.
├── k8s/                    # Kubernetes manifests
│   ├── deployment.yaml
│   └── service.yaml
├── public/
├── views/
├── Dockerfile
├── server.js
├── package.json
├── .gitlab-ci.yml          # GitLab CI/CD pipeline
└── key.json                # GCP service account (not committed in repo)
```

## 🚀 Steps Followed

### 1. ✅ Created and Tested Node.js App

A basic Express.js app was created with views, public assets, and a working server.

### 2. 🐳 Dockerized the Application

Created a `Dockerfile` to containerize the Node.js app.

### 3. ☁️ Set Up Google Cloud

* Created a GCP project: `gkewithgitlabs`
* Enabled required APIs: Kubernetes Engine API, Artifact Registry API
* Created a GKE Cluster: `gitlab-cluster` in region `us-central1`
* Created Artifact Registry repository: `nodejs-gke-app` (Docker format)

### 4. 🔐 Created a Service Account

* Gave it roles:

  * Kubernetes Engine Admin
  * Compute Admin
  * Service Account User
  * Artifact Registry Writer
* Generated and downloaded JSON key (`key.json`)

### 5. 🔧 GitLab CI/CD Integration

Configured `.gitlab-ci.yml`:

```yaml
image: google/cloud-sdk:latest

variables:
  PROJECT_ID: "gkewithgitlabs"
  CLUSTER_NAME: "gitlab-cluster"
  CLUSTER_ZONE: "us-central1"
  DOCKER_HOST: tcp://docker:2375/
  DOCKER_TLS_CERTDIR: ""
  IMAGE: "us-central1-docker.pkg.dev/gkewithgitlabs/nodejs-gke-app/nodejs-gke-app"

stages:
  - build
  - deploy

build:
  image: google/cloud-sdk:latest
  services:
    - docker:24.0.2-dind
  stage: build
  before_script:
    - echo "$GCP_SERVICE_KEY" > key.json
    - gcloud auth activate-service-account --key-file=key.json
    - gcloud config set project $PROJECT_ID
    - gcloud config set compute/region $CLUSTER_ZONE
    - gcloud container clusters get-credentials $CLUSTER_NAME --region $CLUSTER_ZONE
    - gcloud auth configure-docker us-central1-docker.pkg.dev
  script:
    - docker build -t $IMAGE .
    - echo $GCP_SERVICE_KEY | docker login -u _json_key --password-stdin https://us-central1-docker.pkg.dev
    - docker push $IMAGE

deploy:
  stage: deploy
  script:
    - kubectl apply -f k8s/
```

### 6. ☸️ Kubernetes Deployment

Created the following files in the `k8s/` directory:

**deployment.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nodejs-app
  template:
    metadata:
      labels:
        app: nodejs-app
    spec:
      containers:
      - name: nodejs-container
        image: us-central1-docker.pkg.dev/gkewithgitlabs/nodejs-gke-app/nodejs-gke-app:latest
        ports:
        - containerPort: 80
```

**service.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nodejs-service
spec:
  type: LoadBalancer
  selector:
    app: nodejs-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

### 7. ✅ Verified Deployment

* Confirmed pod was running using:

  ```
  kubectl get pods
  ```
* Accessed app via external IP from:

  ```
  kubectl get svc
  ```

### 8. 🧹 Cleaned Up Resources

To avoid billing charges, the following resources were deleted:

* GKE cluster
* VM instance
* Artifact Registry
* Project (optional)

---

Let me know if you'd like me to add a badge, deployment screenshot, or any Git commands!
