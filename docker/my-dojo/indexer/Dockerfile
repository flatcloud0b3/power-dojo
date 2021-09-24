FROM    debian:11

ENV     INDEXER_HOME            /home/indexer

ENV     ELECTRS_PGP_SIG_URL     https://github.com/flatcloud0b3/electrs/releases/download/v0.8.12/electrs-0.8.12-linux-gnu-ppc64le.deb.sig
ENV     ELECTRS_DEB_URL         https://github.com/flatcloud0b3/electrs/releases/download/v0.8.12/electrs-0.8.12-linux-gnu-ppc64le.deb
ENV     ELECTRS_SHA256          63688d8d0a2ecb55d1eadc1e32db9fe9de355b6509c19c6f453000f9f5a880fb
ENV     ELECTRS_DEB_SIG         electrs-0.8.12-linux-gnu-ppc64le.deb.sig

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
        echo "$ELECTRS_SHA256 electrs-0.8.12-linux-gnu-ppc64le.deb" | sha256sum -c - && \
        dpkg -i electrs-0.8.12-linux-gnu-ppc64le.deb && \
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
