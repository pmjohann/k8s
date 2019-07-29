FROM ubuntu:18.04

# SET DEBIAN FRONTEND
ENV DEBIAN_FRONTEND=noninteractive

# SET DEFAULT ENV VARS FOR DEPLOYMENT
ENV SSH_PUBKEY_PATH=/root/.ssh/id_rsa.pub
ENV MASTER_TYPE=g6-standard-2
ENV NODE_TYPE=g6-nanode-1

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
RUN curl -sSL https://releases.hashicorp.com/terraform/0.12.5/terraform_0.12.5_linux_amd64.zip -o /tmp/tf.zip
RUN unzip /tmp/tf.zip && rm /tmp/tf.zip && mv terraform /usr/local/bin/terraform

# INSTALL LINODE-CLI
RUN pip3 install linode-cli && pip3 install --upgrade linode-cli

# COPY AND INSTALL
COPY app /app
WORKDIR /app
RUN npm install

# LINK PHP FILES TO APACHE
RUN rm -rf /var/www/html && ln -s /app/php /var/www/html

# CREATE OUTPUT FOLDER FOR KUBECONFIG FILES
RUN mkdir /out

# MAKE ENTRYPOINT EXECUTABLE
RUN chmod +x /app/docker-entrypoint.sh

# ADD CLUSTER SCRIPTS
RUN chmod +x /app/addcluster.sh
RUN ln -s /app/addcluster.sh /usr/local/bin/addcluster
RUN chmod +x /usr/local/bin/addcluster

RUN chmod +x /app/delcluster.sh
RUN ln -s /app/delcluster.sh /usr/local/bin/delcluster
RUN chmod +x /usr/local/bin/delcluster

RUN chmod +x /app/applycluster.sh
RUN ln -s /app/applycluster.sh /usr/local/bin/applycluster
RUN chmod +x /usr/local/bin/applycluster

# SET ENTRYPOINT
ENTRYPOINT /app/docker-entrypoint.sh
