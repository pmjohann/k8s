FROM ubuntu:18.04

# SET DEBIAN FRONTEND
ENV DEBIAN_FRONTEND=noninteractive

# SET DEFAULT ENV VARS FOR DEPLOYMENT
ENV SSH_PUBKEY_PATH=/root/.ssh/id_rsa.pub
ENV MASTER_TYPE=g6-standard-2
ENV NODE_TYPE=g6-standard-1
ENV NODES=2
ENV REGION=eu-west
ENV CLUSTERNAME=mycluster

# FETCH DEPS
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    openssh-client \
    unzip \
    git \
    php;

# NODEJS INSTALL
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install -y nodejs

# INSTALL KUBECTL
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

# INSTALL TERRAFORM
RUN curl -sSL https://releases.hashicorp.com/terraform/0.11.4/terraform_0.11.4_linux_amd64.zip -o /tmp/tf.zip
RUN unzip /tmp/tf.zip && rm /tmp/tf.zip && mv terraform /usr/local/bin/terraform

# INSTALL LINODE-CLI
RUN pip3 install linode-cli && pip3 install --upgrade linode-cli

# COPY AND INSTALL
COPY app /app
WORKDIR /app
RUN npm install

# CREATE OUTPUT FOLDER FOR KUBECONFIG FILES
RUN mkdir /out

# MAKE ENTRYPOINT EXECUTABLE
RUN chmod +x /app/docker-entrypoint.sh

# SET ENTRYPOINT
ENTRYPOINT /app/docker-entrypoint.sh
