const statusScript = {

  initPage: function() {
    // Refresh API status
    setInterval(() => {this.refreshApiStatus()}, 60000)
    // Refresh PushTx status
    setInterval(() => {this.refreshPushTxStatus()}, 60000)
  },

  preparePage: function() {
    this.refreshApiStatus()
    this.refreshPushTxStatus()
  },

  refreshApiStatus: function() {
    lib_msg.displayMessage('Loading API status info...');
    return lib_api.getApiStatus().then(apiStatus => {
      if (apiStatus) {
        $('#tracker-status-ind').html('&#10003;')
        $('#tracker-status-ind').css('color', '#76d776')
        $('#tracker-uptime').text(apiStatus['uptime'])
        $('#tracker-chaintip').text(apiStatus['blocks'])
        lib_msg.cleanMessagesUi()
      }
    }).catch(e => {
      $('#tracker-status-ind').text('X')
      $('#tracker-status-ind').css('color', '#f77c7c')
      $('#tracker-uptime').text('-')
      $('#tracker-chaintip').text('-')
      lib_msg.displayErrors(lib_msg.extractJqxhrErrorMsg(e))
      console.log(e)
    })
  },

  refreshPushTxStatus: function() {
    lib_msg.displayMessage('Loading Tracker status info...');
    lib_api.getPushtxStatus().then(pushTxStatus => {
      if (pushTxStatus) {
        const data = pushTxStatus['data']
        $('#node-status-ind').html('&#10003;')
        $('#node-status-ind').css('color', '#76d776')
        const uptime = lib_cmn.timePeriod(data['uptime'])
        $('#node-uptime').text(uptime)
        $('#node-chaintip').text(data['bitcoind']['blocks'])
        $('#node-version').text(data['bitcoind']['version'])
        const network = data['bitcoind']['testnet'] == true ? 'testnet' : 'mainnet'
        $('#node-network').text(network)
        $('#node-conn').text(data['bitcoind']['conn'])
        $('#node-relay-fee').text(data['bitcoind']['relayfee'])
        lib_msg.cleanMessagesUi()
      }
    }).catch(e => {
      $('#node-status-ind').text('-')
      $('#node-status-ind').css('color', '#f77c7c')
      $('#node-uptime').text('-')
      $('#node-chaintip').text('-')
      $('#node-version').text('-')
      $('#node-network').text('-')
      $('#node-conn').text('-')
      $('#node-relay-fee').text('-')
      lib_msg.displayErrors(lib_msg.extractJqxhrErrorMsg(e))
      console.log(e)
    })
  },

}

screenScripts.set('#screen-status', statusScript)