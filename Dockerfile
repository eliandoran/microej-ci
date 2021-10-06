FROM node:alpine

# Install dependencies
COPY ./package* ./
RUN npm install

COPY ./ ./
ENTRYPOINT [ "/entrypoint.sh" ]
