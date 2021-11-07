FROM    debian:11-slim


#################################################################
# INSTALL BITCOIN
#################################################################
ENV     BITCOIN_HOME            /home/bitcoin

ENV     BITCOIND_PGP_SIG_URL    https://github.com/flatcloud0b3/bitcoin/releases/download/v22.0/bitcoind-22.0_powerpc64le-linux-gnu.deb.sig
ENV     BITCOIND_DEB_URL        https://github.com/flatcloud0b3/bitcoin/releases/download/v22.0/bitcoind-22.0_powerpc64le-linux-gnu.deb
ENV     BITCOIND_SHA256         45781abfa94f1a21b5d24dbb2cbaaaff135a8c4227dc70abcca87021ef7f6253
ENV     BITCOIND_DEB_SIG        bitcoind-22.0_powerpc64le-linux-gnu.deb.sig

ENV     BITCOIN_CLI_PGP_SIG_URL https://github.com/flatcloud0b3/bitcoin/releases/download/v22.0/bitcoin-cli-22.0_powerpc64le-linux-gnu.deb.sig
ENV     BITCOIN_CLI_DEB_URL     https://github.com/flatcloud0b3/bitcoin/releases/download/v22.0/bitcoin-cli-22.0_powerpc64le-linux-gnu.deb
ENV     BITCOIN_CLI_SHA256      abdf5d0a70e57f179fc54b29bdfb4898f5ff3d55d9893d82778f71aabe5e7490
ENV     BITCOIN_CLI_DEB_SIG     bitcoin-cli-22.0_powerpc64le-linux-gnu.deb.sig

ENV     PGP_KS_URL              hkp://keyserver.ubuntu.com
ENV     FLATCLOUD_PGP_KEY       E28D24AA6FE1AD3F6F258BA0D9CE2F6D968DDC54

ARG     BITCOIND_LINUX_UID
ARG     BITCOIND_LINUX_GID
ARG     TOR_LINUX_GID

RUN     set -ex && \
        apt-get update && \
        apt-get install -qq --no-install-recommends ca-certificates dirmngr gosu gpg gpg-agent wget python3 && \
        rm -rf /var/lib/apt/lists/*

# Build and install bitcoin binaries
RUN     set -ex && \
        cd /tmp && \
        wget "$BITCOIND_DEB_URL" && \
        wget "$BITCOIN_CLI_DEB_URL" && \
        gpg --keyserver "$PGP_KS_URL" --recv "$FLATCLOUD_PGP_KEY" && \
        wget "$BITCOIND_PGP_SIG_URL" && \
        wget "$BITCOIN_CLI_PGP_SIG_URL" && \
        gpg --verify "$BITCOIND_DEB_SIG" &&  \
        gpg --verify "$BITCOIN_CLI_DEB_SIG" && \
        echo "$BITCOIND_SHA256 bitcoind-22.0_powerpc64le-linux-gnu.deb" | sha256sum -c - && \
        echo "$BITCOIN_CLI_SHA256 bitcoin-cli-22.0_powerpc64le-linux-gnu.deb" | sha256sum -c - && \
        dpkg -i bitcoind-22.0_powerpc64le-linux-gnu.deb && dpkg -i  bitcoin-cli-22.0_powerpc64le-linux-gnu.deb && \
        rm -rf /tmp/*

# Create groups bitcoin & tor
# Create user bitcoin and add it to groups
RUN     addgroup --system -gid ${BITCOIND_LINUX_GID} bitcoin && \
        addgroup --system -gid ${TOR_LINUX_GID} tor && \
        adduser --system --ingroup bitcoin -uid ${BITCOIND_LINUX_UID} bitcoin && \
        usermod -a -G tor bitcoin

# Create data directory
RUN     mkdir "$BITCOIN_HOME/.bitcoin" && \
        chown -h bitcoin:bitcoin "$BITCOIN_HOME/.bitcoin"

# Copy restart script
COPY    ./restart.sh /restart.sh
RUN     chown bitcoin:bitcoin /restart.sh && \
        chmod 777 /restart.sh

# Copy wait-for-it script
COPY    ./wait-for-it.sh /wait-for-it.sh

RUN     chown bitcoin:bitcoin /wait-for-it.sh && \
        chmod u+x /wait-for-it.sh && \
        chmod g+x /wait-for-it.sh

# Copy rpcauth.py script
COPY    ./rpcauth.py /rpcauth.py

RUN     chown bitcoin:bitcoin /rpcauth.py && \
        chmod u+x /rpcauth.py && \
        chmod g+x /rpcauth.py

EXPOSE  8333 9501 9502 28256

USER    bitcoin

