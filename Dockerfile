FROM node:alpine

# Install dependencies
COPY ./package* .
RUN npm install

ENTRYPOINT [ "/entrypoint.sh" ]
