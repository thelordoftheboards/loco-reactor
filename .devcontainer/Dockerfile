FROM mcr.microsoft.com/devcontainers/rust:1

# Install postgresql-client, sea-orm-cli, others
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
     && apt-get -y install --no-install-recommends postgresql-client \
     && cargo install sea-orm-cli cargo-insta cargo-watch concurrently \
     && chown -R vscode /usr/local/cargo

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs
RUN npm i -g npm-check-updates

COPY .env /.env
