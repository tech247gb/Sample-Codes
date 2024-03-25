module.exports = function (socket) {
  socket.authenticated = false
  socket.isAdmin = false

  var disconnected = false

  return {
    getSocket: function () {
      return socket
    },
    socketId: function () {
      return socket.id
    },

    isAdmin: function () {
      return socket.isAdmin
    },

    isWidget: function () {
      return socket.isWidget
    },

    isPartner: function () {
      return socket.isPartner
    },

    user: function () {
      return socket.user
    },

    authenticated: function () {
      return socket.authenticated
    },

    getDeviceId: function () {
      return socket.deviceId
    },

    auth: function (user, deviceId, isAdmin) {
      socket.authenticated = true
      socket.user = user
      socket.isAdmin = isAdmin || false
      socket.deviceId = deviceId
    },

    authWidget: function (user) {
      socket.authenticated = true
      socket.user = user
      socket.isWidget = true
    },

    authPartner: function (user) {
      socket.authenticated = true
      socket.user = user
      socket.isPartner = true
    },

    unauth: function () {
      socket.authenticated = false
      socket.isAdmin = false
      socket.user = null
      socket.deviceId = null
    },

    emitToOthers: function (name, data) {
      socket.broadcast.emit(name, data)
    },

    emit: function (name, data) {
      socket.emit(name, data)
    },

    on: function (name, callback) {
      socket.on(name, function () {
        callback.apply(null, arguments)
      })
    },

    off: function (event, callback) {
      socket.removeListener(event, callback)
    },

    disconnected: function () {
      return disconnected
    },

    disconnect: function () {
      disconnected = true
    }
  }
}
