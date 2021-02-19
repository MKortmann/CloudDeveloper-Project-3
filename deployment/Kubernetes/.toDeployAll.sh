2
#to deploy all the files to AWS EKS Cluster using kubectl

cd ./udagram-api-feed
kubectl apply -f udagram-api-feed-deployment.yaml
kubectl apply -f udagram-api-feed-service.yaml

cd ../udagram-api-frontend
kubectl apply -f udagram-api-users-deployment.yaml
kubectl apply -f udagram-api-users-service.yaml

cd ../udagram-api-frontend
kubectl apply -f udagram-api-frontend-deployment.yaml
kubectl apply -f udagram-api-frontend-service.yaml

cd ../udagram-api-reverseproxy
kubectl apply -f udagram-api-reverseproxy-deployment.yaml
kubectl apply -f udagram-api-reverseproxy-service.yaml

