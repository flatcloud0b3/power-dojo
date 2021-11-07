FROM    debian:11-slim

ENV     WHIRLPOOL_HOME                /home/whirlpool
ENV     WHIRLPOOL_DIR                 /usr/local/whirlpool-cli

ARG     WHIRLPOOL_LINUX_UID
ARG     WHIRLPOOL_LINUX_GID

# Install prerequisites
# Create group & user whirlpool
# Create /usr/share/man/man1 directory
# Create .whirlpool-cli subdirectory of WHIRLPOOL_HOME
# Create /usr/local/src/whirlpool-cli directory

RUN     mkdir -p /usr/share/man/man1

RUN     set -ex && \
        apt-get update && \
        apt-get install -y libevent-dev zlib1g-dev libssl-dev gcc make automake ca-certificates autoconf musl-dev coreutils gpg wget default-jdk && \
        addgroup --system -gid ${WHIRLPOOL_LINUX_GID} whirlpool && \
        adduser --system --ingroup whirlpool -uid ${WHIRLPOOL_LINUX_UID} whirlpool && \
        mkdir -p "$WHIRLPOOL_HOME/.whirlpool-cli" && \
        chown -Rv whirlpool:whirlpool "$WHIRLPOOL_HOME" && \
        chmod -R 750 "$WHIRLPOOL_HOME" && \
        mkdir -p "$WHIRLPOOL_DIR"

# Install Tor
<<<<<<< HEAD
ENV     TOR_PGP_SIG_URL     https://github.com/flatcloud0b3/tor/releases/download/v0.4.6.8/tor-0.4.6.8-linux-gnu-ppc64le-bullseye.deb.sig
ENV     TOR_DEB_URL         https://github.com/flatcloud0b3/tor/releases/download/v0.4.6.8/tor-0.4.6.8-linux-gnu-ppc64le-bullseye.deb
ENV     TOR_SHA256          ca9a6a7e16c0cd64a353910486ac001fdf25ea002995e98903cdd6ad77a87120
ENV     TOR_DEB_SIG         tor-0.4.6.8-linux-gnu-ppc64le-bullseye.deb.sig
=======
ENV     TOR_PGP_SIG_URL     https://github.com/flatcloud0b3/tor/releases/download/v0.4.6.7/tor-0.4.6.7-linux-gnu-ppc64le-bullseye.deb.sig
ENV     TOR_DEB_URL         https://github.com/flatcloud0b3/tor/releases/download/v0.4.6.7/tor-0.4.6.7-linux-gnu-ppc64le-bullseye.deb
ENV     TOR_SHA256          844886ac03e50cdf385e8edf6e493a3acbb7d1c83fbdef57901b4cb2d3916fae
ENV     TOR_DEB_SIG         tor-0.4.6.7-linux-gnu-ppc64le-bullseye.deb.sig
>>>>>>> a9a75511f5f0f884271d6d866ecf86a517cbc084

ENV     FLATCLOUD_PGP_KEY   E28D24AA6FE1AD3F6F258BA0D9CE2F6D968DDC54
ENV     PGP_KS_URL          hkp://keyserver.ubuntu.com

RUN     set -ex && \
        cd /tmp && \
        wget "$TOR_PGP_SIG_URL" && \
        wget "$TOR_DEB_URL" && \
        gpg --keyserver "$PGP_KS_URL" --recv-keys "$FLATCLOUD_PGP_KEY" && \
        gpg --verify "$TOR_DEB_SIG" &&  \
<<<<<<< HEAD
        echo "$TOR_SHA256 tor-0.4.6.8-linux-gnu-ppc64le-bullseye.deb" | sha256sum -c - && \
        dpkg -i tor-0.4.6.8-linux-gnu-ppc64le-bullseye.deb && \
=======
        echo "$TOR_SHA256 tor-0.4.6.7-linux-gnu-ppc64le-bullseye.deb" | sha256sum -c - && \
        dpkg -i tor-0.4.6.7-linux-gnu-ppc64le-bullseye.deb && \
>>>>>>> a9a75511f5f0f884271d6d866ecf86a517cbc084
        rm -rf /tmp/*

# Install whirlpool-cli
ENV     WHIRLPOOL_URL                 https://code.samourai.io/whirlpool/whirlpool-client-cli/uploads
ENV     WHIRLPOOL_VERSION             0.10.11
ENV     WHIRLPOOL_VERSION_HASH        21d25ed02cceb91f4aa95b6389b9da9c
ENV     WHIRLPOOL_JAR                 "whirlpool-client-cli-$WHIRLPOOL_VERSION-run.jar"
ENV     WHIRLPOOL_SHA256              09e574743851db2d5374bc7d4e66fd0c29f07b95b4e32b3d70c2187b724d5745


RUN     set -ex && \
        cd "$WHIRLPOOL_DIR" && \
        echo "$WHIRLPOOL_SHA256 *$WHIRLPOOL_JAR" > WHIRLPOOL_CHECKSUMS && \
        wget -qO "$WHIRLPOOL_JAR" "$WHIRLPOOL_URL/$WHIRLPOOL_VERSION_HASH/$WHIRLPOOL_JAR" && \
        sha256sum -c WHIRLPOOL_CHECKSUMS 2>&1 | grep OK && \
        mv "$WHIRLPOOL_JAR" whirlpool-client-cli-run.jar && \
        chown -Rv whirlpool:whirlpool "$WHIRLPOOL_DIR" && \
        chmod -R 750 "$WHIRLPOOL_DIR"

# Copy restart script
COPY    ./restart.sh /restart.sh

RUN     chown whirlpool:whirlpool /restart.sh && \
        chmod u+x /restart.sh && \
        chmod g+x /restart.sh

# Expose HTTP API port
EXPOSE  8898

# Switch to user whirlpool
USER    whirlpool
