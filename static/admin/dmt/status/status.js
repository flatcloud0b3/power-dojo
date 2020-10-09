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
    // Set default values displayed
    this.setStatusIndicator('#db-status-ind', 'idle')
    this.setStatusIndicator('#tracker-status-ind', 'idle')
    this.setStatusIndicator('#indexer-status-ind', 'idle')
    $('#tracker-uptime').text('-')
    $('#tracker-chaintip').text('-')
    $('#db-chaintip').text('-')
    $('#indexer-chaintip').text('-')
    $('#indexer-type').text('-')
    $('#indexer-url').text('-')

    //lib_msg.displayMessage('Loading API status info...');
    return lib_api.getApiStatus().then(apiStatus => {
      if (apiStatus) {
        $('#tracker-uptime').text(apiStatus['uptime'])

        const blocks = apiStatus['blocks']
        if (blocks) {
          $('#db-chaintip').text(blocks)
          $('#tracker-chaintip').text(blocks)
          this.setStatusIndicator('#db-status-ind', 'ok')
          this.setStatusIndicator('#tracker-status-ind', 'ok')
        } else {
          this.setStatusIndicator('#db-status-ind', 'ko')
          this.setStatusIndicator('#tracker-status-ind', 'ko')
        }

        if (apiStatus['indexer']) {
          const indexerMaxHeight = apiStatus['indexer']['maxHeight']
          if (indexerMaxHeight) {
            $('#indexer-chaintip').text(indexerMaxHeight)
            this.setStatusIndicator('#indexer-status-ind', 'ok')
          } else {
            this.setStatusIndicator('#indexer-status-ind', 'ko')
          }
          const indexerType = apiStatus['indexer']['type']
          if (indexerType)
            $('#indexer-type').text(indexerType.replace(/_/g, ' '))
          const indexerUrl = apiStatus['indexer']['url']
          if (indexerUrl)
            $('#indexer-url').text(indexerUrl)
        }
        //lib_msg.cleanMessagesUi()
      }
    }).catch(e => {
      this.setStatusIndicator('#db-status-ind', 'ko')
      this.setStatusIndicator('#tracker-status-ind', 'ko')
      this.setStatusIndicator('#indexer-status-ind', 'ko')
      lib_errors.processError(e)
    })
  },

  refreshPushTxStatus: function() {
    // Set default values displayed
    this.setStatusIndicator('#node-status-ind', 'idle')
    $('#node-uptime').text('-')
    $('#node-chaintip').text('-')
    $('#node-version').text('-')
    $('#node-network').text('-')
    $('#node-conn').text('-')
    $('#node-relay-fee').text('-')

    //lib_msg.displayMessage('Loading Tracker status info...');
    lib_api.getPushtxStatus().then(pushTxStatus => {
      if (pushTxStatus) {
        const data = pushTxStatus['data']
        this.setStatusIndicator('#node-status-ind', 'ok')
        const uptime = lib_cmn.timePeriod(data['uptime'])
        $('#node-uptime').text(uptime)
        $('#node-chaintip').text(data['bitcoind']['blocks'])
        $('#node-version').text(data['bitcoind']['version'])
        const network = data['bitcoind']['testnet'] == true ? 'testnet' : 'mainnet'
        $('#node-network').text(network)
        $('#node-conn').text(data['bitcoind']['conn'])
        $('#node-relay-fee').text(data['bitcoind']['relayfee'])
        //lib_msg.cleanMessagesUi()
      }
    }).catch(e => {
      this.setStatusIndicator('#node-status-ind', 'ko')
      lib_errors.processError(e)
    })
  },

  setStatusIndicator: function(id, status) {
    if (status == 'ok') {
      $(id).html('&#10003;')
      $(id).css('color', '#76d776')
    } else if (status == 'ko') {
      $(id).html('X')
      $(id).css('color', '#f77c7c')
    } else {
      $(id).html('-')
      $(id).css('color', '#efefef')
    }
  },

}

screenScripts.set('#screen-status', statusScript)