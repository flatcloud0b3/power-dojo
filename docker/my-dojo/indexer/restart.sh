#!/bin/bash
set -e

indexer_options=(
  -vv
  --index-batch-size="$INDEXER_BATCH_SIZE"
  --db-dir="/home/indexer/db"
  --daemon-p2p-addr="$BITCOIND_IP:$BITCOIND_P2P_PORT"
  --daemon-rpc-addr="$BITCOIND_IP:$BITCOIND_RPC_PORT"
  --electrum-rpc-addr="$NET_DOJO_INDEXER_IPV4:$INDEXER_RPC_PORT"
  --index-lookup-limit="$INDEXER_TXID_LIMIT"
)

if [ "$COMMON_BTC_NETWORK" == "testnet" ]; then
  bitcoind_options+=(--network="testnet")
else
  bitcoind_options+=(--network="mainnet")
fi

electrs "${indexer_options[@]}"
