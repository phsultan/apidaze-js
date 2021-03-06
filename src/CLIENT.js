/* APIdaze client definition */
(function(APIdaze){
  var LOG_PREFIX = APIdaze.name +' | '+ 'CLIENT' +' | ';
  var CLIENT,
    CONSTANTS = {
      STATUS_INIT :           0,
      STATUS_READY :          1,
      STATUS_NOTREADY :       2
    };

  CLIENT = function(config) {
    APIdaze.EventTarget.call(this);
    this.configuration = {
      // Default options
      debug: false,
      sounddetect: false,
      unsafe: false,        // WebRTC only : connect WebSocket over ws rather than wss
      type: "auto",
      apiKey: "none"
    };
    this.status = CONSTANTS.STATUS_INIT;
    this.callstarted = false;
    this.roomstarted = false;

    try {
      this.init(config);
      console.log(LOG_PREFIX + "Client initialized");
    } catch (e) {
      this.status = CONSTANTS.STATUS_NOTREADY;
      throw e;
    }

    if (this.status === CONSTANTS.STATUS_NOTREADY) {
      throw new APIdaze.Exceptions.CallError("Client is not ready");
    }

    this.bind(this.configuration);

    switch (this.configuration.type) {
      case "webrtc":
        try {
          this.webRTCAV = new APIdaze.WebRTCAV(this);
        } catch(error) {
          console.log(LOG_PREFIX + "Error : " + error.toString());
        }
        break;
      case "flash":
      case "auto":
        this.flashAudio = new APIdaze.FlashAudio(this);
        break;
      default:
        this.flashAudio = new APIdaze.FlashAudio(this);
        break;
    }

    return this;
  };

  CLIENT.prototype = new APIdaze.EventTarget();

  CLIENT.prototype.init = function(config){
    APIdaze.Utils.extend(this.configuration, config);
    if (this.configuration.sounddetect === "yes" || this.configuration.sounddetect === "true") {
      this.configuration.sounddetect = true;
    }
    switch(this.configuration.type) {
      case "webrtc":
        break;
      case "flash":
        break;
      case "auto":
        this.configuration.type = "flash";
        break;
      default:
        throw new APIdaze.Exceptions.ConfigurationError(this.configuration.type);
    }
  };

  CLIENT.prototype.call = function(params, listeners) {
    if (this.status !== CONSTANTS.STATUS_READY) {
      throw new APIdaze.Exceptions.CallError("Client is not ready");
    }

    if (this.callstarted === true) {
      throw new APIdaze.Exceptions.CallError("Call already started");
    }

    this.callstarted = true;

    switch(this.configuration.type) {
      case "webrtc":
        return this.webRTCAV.call(params, listeners);
      case "flash":
      case "auto":
        return this.flashAudio.call(params, listeners);
      default:
        return this.flashAudio.call(params, listeners);
    }
  };

  CLIENT.prototype.joinroom = function(dest, identifier, listeners) {
    if (this.status !== CONSTANTS.STATUS_READY) {
      throw new APIdaze.Exceptions.CallError("Client is not ready");
    }

    if (this.roomstarted === true) {
      throw new APIdaze.Exceptions.CallError("Already joined a conference room");
    }

    this.roomstarted = true;

    switch(this.configuration.type) {
      case "webrtc":
        this.bind(listeners);
        return this.webRTCAV.joinroom(dest, identifier, listeners); 
      case "flash":
        return this.flashAudio.joinroom(dest, identifier, listeners); 
      case "auto":
        throw new APIdaze.Exceptions.CallError("Method joinroom not implemented in non WebRTC channels");
      default:
        throw new APIdaze.Exceptions.CallError("Method joinroom not implemented in non WebRTC channels");
    }
  };

  CLIENT.prototype.connect = function() {
    switch(this.configuration.type) {
      case "webrtc":
        this.webRTCAV.connect();
        break;
      case "flash":
      case "auto":
        this.flashAudio.connect();
        break;
      default:
        this.flashAudio.connect();
        break;
    }
  };

  CLIENT.prototype.disconnect = function() {
    switch(this.configuration.type) {
      case "webrtc":
        this.webRTCAV.disconnect();
        break;
      case "flash":
      case "auto":
        this.flashAudio.disconnect();
        break;
      default:
        this.flashAudio.disconnect();
        break;
    }
  };

  CLIENT.prototype.isMuted = function() {
    switch(this.configuration.type) {
      case "flash":
        return this.flashAudio.isMuted();
      default:
        throw new APIdaze.Exceptions.ClientError("Function isMuted not available for " + this.configuration.type + " configuration mode");
    }
  };

  CLIENT.prototype.muteAudioMic = function() {
    switch(this.configuration.type) {
      case "webrtc":
        return this.webRTCAV.muteAudioMic();
      default:
        throw new APIdaze.Exceptions.ClientError("Function muteAudioMic not available for " + this.configuration.type + " configuration mode");
    }
  };

  CLIENT.prototype.unMuteAudioMic = function() {
    switch(this.configuration.type) {
      case "webrtc":
        return this.webRTCAV.unMuteAudioMic();
      default:
        throw new APIdaze.Exceptions.ClientError("Function unMuteAudioMic not available for " + this.configuration.type + " configuration mode");
    }
  };

  CLIENT.prototype.muteAudioOut = function() {
    switch(this.configuration.type) {
      case "webrtc":
        return this.webRTCAV.muteAudioOut();
      default:
        throw new APIdaze.Exceptions.ClientError("Function muteAudioOut not available for " + this.configuration.type + " configuration mode");
    }
  };

  CLIENT.prototype.unMuteAudioOut = function() {
    switch(this.configuration.type) {
      case "webrtc":
        return this.webRTCAV.unMuteAudioOut();
      default:
        throw new APIdaze.Exceptions.ClientError("Function unMuteAudioOut not available for " + this.configuration.type + " configuration mode");
    }
  };

  /** Free created DOM elements */
  CLIENT.prototype.freeDOM = function() {
    switch(this.configuration.type) {
      case "webrtc":
        return this.webRTCAV.freeDOM();
      default:
        throw new APIdaze.Exceptions.ClientError("Function freeDOM not available for " + this.configuration.type + " configuration mode");
    }
  };

  CLIENT.prototype.freeALL = function() {
    switch(this.configuration.type) {
      case "webrtc":
        return this.webRTCAV.freeALL();
      default:
        throw new APIdaze.Exceptions.ClientError("Function freeALL not available for " + this.configuration.type + " configuration mode");
    }
  };

  CLIENT.prototype.WebRTCAudio = function() {
    console.log(LOG_PREFIX + "Starting WebRTCAudio");
  };

  CLIENT.CONSTANTS = CONSTANTS;
  APIdaze.CLIENT = CLIENT;
}(APIdaze));
