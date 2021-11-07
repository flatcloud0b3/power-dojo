FROM    debian:11-slim

ENV     INDEXER_HOME            /home/indexer

<<<<<<< HEAD
ENV     ELECTRS_PGP_SIG_URL     https://github.com/flatcloud0b3/electrs/releases/download/v0.9.2/electrs-0.9.2-linux-gnu-ppc64le.deb.sig
ENV     ELECTRS_DEB_URL         https://github.com/flatcloud0b3/electrs/releases/download/v0.9.2/electrs-0.9.2-linux-gnu-ppc64le.deb
ENV     ELECTRS_SHA256          8dd74b62c30d631a3d6f97d3e007bf515a0cc5a803bb4a4f60c726dfa01b0e32
ENV     ELECTRS_DEB_SIG         electrs-0.9.2-linux-gnu-ppc64le.deb.sig
=======
ENV     ELECTRS_PGP_SIG_URL     https://github.com/flatcloud0b3/electrs/releases/download/v0.9.0/electrs-0.9.0-linux-gnu-ppc64le.deb.sig
ENV     ELECTRS_DEB_URL         https://github.com/flatcloud0b3/electrs/releases/download/v0.9.0/electrs-0.9.0-linux-gnu-ppc64le.deb
ENV     ELECTRS_SHA256          5154608db5be094c5a862dd60965dae64734aa1d183665824ef782da2bc6b03f
ENV     ELECTRS_DEB_SIG         electrs-0.9.0-linux-gnu-ppc64le.deb.sig
>>>>>>> a9a75511f5f0f884271d6d866ecf86a517cbc084

ENV     PGP_KS_URL              hkp://keyserver.ubuntu.com
ENV     FLATCLOUD_PGP_KEY       E28D24AA6FE1AD3F6F258BA0D9CE2F6D968DDC54

ARG     INDEXER_LINUX_GID
ARG     INDEXER_LINUX_UID

# Install rocksdb library
RUN     apt-get update && \
        apt-get -y upgrade && \
        apt-get -y install gpg wget librocksdb-dev=6.11.4-3

# Install electrs
RUN     set -ex && \
        cd /tmp && \
        wget "$ELECTRS_DEB_URL" && \
        gpg --keyserver "$PGP_KS_URL" --recv "$FLATCLOUD_PGP_KEY" && \
        wget "$ELECTRS_PGP_SIG_URL" && \
        gpg --verify "$ELECTRS_DEB_SIG" && \
<<<<<<< HEAD
        echo "$ELECTRS_SHA256 electrs-0.9.2-linux-gnu-ppc64le.deb" | sha256sum -c - && \
        dpkg -i electrs-0.9.2-linux-gnu-ppc64le.deb && \
=======
        echo "$ELECTRS_SHA256 electrs-0.9.0-linux-gnu-ppc64le.deb" | sha256sum -c - && \
        dpkg -i electrs-0.9.0-linux-gnu-ppc64le.deb && \
>>>>>>> a9a75511f5f0f884271d6d866ecf86a517cbc084
        rm -rf /tmp/*

# Create group and user indexer
RUN     addgroup --system -gid ${INDEXER_LINUX_GID} indexer && \
        adduser --system --ingroup indexer -uid ${INDEXER_LINUX_UID} indexer

# Create data directory
RUN     mkdir "$INDEXER_HOME/electrs" && \
        mkdir "$INDEXER_HOME/db" && \
        chown -h indexer:indexer "$INDEXER_HOME/electrs" && \
        chown -h indexer:indexer "$INDEXER_HOME/db"

# Copy restart script
COPY    ./restart.sh /restart.sh
RUN     chown indexer:indexer /restart.sh && \
        chmod 777 /restart.sh

# Copy electrs.toml
COPY    ./electrs.toml /electrs.toml
RUN     chown indexer:indexer /electrs.toml && \
        chmod 600 /electrs.toml

# Copy wait-for-it script
COPY    ./wait-for-it.sh /wait-for-it.sh
RUN     chown indexer:indexer /wait-for-it.sh && \
        chmod u+x /wait-for-it.sh && \
        chmod g+x /wait-for-it.sh

USER    indexer

EXPOSE  50001

STOPSIGNAL SIGINT
