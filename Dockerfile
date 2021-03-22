FROM node:12

WORKDIR /app
COPY kainos-chain.pem .

RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
RUN mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
RUN apt-get update && \
    apt-get install apt-transport-https
RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/debian/9/prod stretch main" > /etc/apt/sources.list.d/dotnetdev.list'
RUN apt-get update && \
    apt-get install azure-functions-core-tools-3


WORKDIR /app/ftts-stub-tcn
COPY ftts-stub-tcn/packag*.json ./
RUN npm install
COPY .env .
COPY ftts-stub-tcn/ ./
RUN rm *.js

ENTRYPOINT [ "npm", "run", "watch" ]
