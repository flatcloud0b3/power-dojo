FROM    debian:buster-slim


#################################################################
# INSTALL TOR
#################################################################
ENV     TOR_HOME            /var/lib/tor

ENV     TOR_PGP_SIG_URL     https://github.com/flatcloud0b3/tor/releases/download/v0.4.6.7/tor-0.4.6.7-linux-gnu-ppc64le.deb.sig
ENV     TOR_DEB_URL         https://github.com/flatcloud0b3/tor/releases/download/v0.4.6.7/tor-0.4.6.7-linux-gnu-ppc64le.deb
ENV     TOR_SHA256          6ee4211e2217cc40fdfcad81b96a9b3188adc23eb4d68fb45b2c913abde1f714
ENV     TOR_DEB_SIG         tor-0.4.6.7-linux-gnu-ppc64le.deb.sig

ENV     FLATCLOUD_PGP_KEY   E28D24AA6FE1AD3F6F258BA0D9CE2F6D968DDC54
ENV     PGP_KS_URL          hkp://keyserver.ubuntu.com

ENV     OBFS4_URL           https://github.com/Yawning/obfs4.git
ENV     OBFS4_VERSION       0.0.11

ENV     GOLANG_SHA256       03e02b2ac6dc1601203f335385b9bbe15a55677066d9a1a1280b5fcfa6ec4738
ENV     GOLANG_ARCHIVE      go1.16.7.linux-ppc64le.tar.gz
ENV     GOLANG_DL_URL       https://dl.google.com/go

ARG     TOR_LINUX_UID
ARG     TOR_LINUX_GID

RUN     set -ex && \
        apt-get update && \
        apt-get -y upgrade && \
        apt-get install -y git libevent-dev zlib1g-dev libssl-dev gcc make automake ca-certificates autoconf musl-dev coreutils gnupg2 wget && \
        mkdir -p /usr/local/src/

# Install Tor
RUN     cd /tmp && \
        wget "$TOR_PGP_SIG_URL" && \
        wget "$TOR_DEB_URL" && \
        gpg --keyserver "$PGP_KS_URL" --recv-keys "$FLATCLOUD_PGP_KEY" && \
        gpg --verify "$TOR_DEB_SIG" &&  \
        echo "$TOR_SHA256 tor-0.4.6.7-linux-gnu-ppc64le.deb" | sha256sum -c - && \
        dpkg -i tor-0.4.6.7-linux-gnu-ppc64le.deb && \
        rm -rf /tmp/*

# Install Golang & OBFS4 proxy
RUN     cd /usr/local/src && \
	echo "$GOLANG_SHA256 *$GOLANG_ARCHIVE" > GO_CHECKSUMS && \
        wget "$GOLANG_DL_URL/$GOLANG_ARCHIVE" && \
        sha256sum -c GO_CHECKSUMS 2>&1 | grep OK && \
        tar -C /usr/local/lib -xzf "$GOLANG_ARCHIVE" && \
        ln -s /usr/local/lib/go/bin/go /usr/local/bin/ && \
        git clone "$OBFS4_URL" /usr/local/src/obfs4proxy && \
        cd obfs4proxy && \
        git checkout "tags/obfs4proxy-$OBFS4_VERSION" && \
        go build -o obfs4proxy/obfs4proxy ./obfs4proxy && \
        cp ./obfs4proxy/obfs4proxy /usr/local/bin && \
        cd .. && \
        rm "$GOLANG_ARCHIVE" && \
        rm -rf obfs4proxy

# Create group & user tor
RUN     addgroup --system -gid ${TOR_LINUX_GID} tor && \
        adduser --system --ingroup tor -uid ${TOR_LINUX_UID} tor

# Create /etc/tor directory
RUN     mkdir -p /etc/tor/ && \
        chown -Rv tor:tor /etc/tor

# Create .tor subdirectory of TOR_HOME
RUN     mkdir -p "$TOR_HOME/.tor" && \
        chown -Rv tor:tor "$TOR_HOME" && \
        chmod -R 750 "$TOR_HOME"

# Copy restart script
COPY    ./restart.sh /restart.sh

RUN     chown tor:tor /restart.sh && \
        chmod u+x /restart.sh && \
        chmod g+x /restart.sh

# Copy wait-for-it script
COPY    ./wait-for-it.sh /wait-for-it.sh

RUN     chown tor:tor /wait-for-it.sh && \
        chmod u+x /wait-for-it.sh && \
        chmod g+x /wait-for-it.sh

# Expose socks port
EXPOSE  9050

# Switch to user tor
USER    tor

