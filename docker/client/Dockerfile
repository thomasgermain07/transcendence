FROM node:14-alpine
# FROM node:14

WORKDIR /workspace

VOLUME ["/workspace", "/workspace/node_modules"]

COPY client.sh	/usr/local/bin/client.sh
RUN  chmod +x	/usr/local/bin/client.sh
ENTRYPOINT ["client.sh"]

EXPOSE 3000
