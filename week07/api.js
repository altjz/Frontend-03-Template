let names = Object.getOwnPropertyNames(window);

const filterOut = (names, props) => {
  const set = new Set();
  props.forEach(p => set.add(p));
  return names.filter(n => !set.has(n));
}

// **************************************************************  ECMA Javascript ********************************************************************************

/**
 * 58
 * ECMA 262 Reference from below
 * https://tc39.es/ecma262/#sec-global-object
 * https://tc39.es/ecma262/#sec-additional-properties-of-the-global-object
 * */

const ECMA262 = ['escape', 'unescape', 'globalThis', 'undefined', 'Infinity', 'NaN', 'eval', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'Object', 'Function', 'Array', 'ArrayBuffer', 'BigInt', 'BigInt64Array', 'BigUint64Array', 'String', 'Boolean', 'Number', 'DataView', 'Date', 'RegExp', 'Error', 'EvalError', 'FinalizationRegistry', 'Float32Array', 'Float64Array', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Promise', 'Proxy', 'Set', 'RangeError', 'SharedArrayBuffer', 'Symbol',  'ReferenceError', 'SyntaxError', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'URIError', 'TypeError', 'WeakMap', 'WeakRef', 'WeakSet', 'Atomics', 'Reflect', 'Math', 'JSON', ]
const ESNEXT = ['AggregateError'];
names = filterOut(names, ECMA262);
names = filterOut(names, ESNEXT);

/**
 * ECMA International
 * https://ecma-international.org/ecma-402/
 */
names = filterOut(names, ['Intl']);

/************************************************************** whatwg ******************************************************************************** /
 * 
 **************************************************************  DOM API  ********************************************************************************
 * whatwg
 * https://dom.spec.whatwg.org/
 */

/**
 * DOM NODEs
 * https://dom.spec.whatwg.org/#nodes
 * 
 * 
 * DOM Node
 * https://dom.spec.whatwg.org/#interface-node
 */
 /**
 * HTML filter from all inheritance from Node
 */
const DOM_NodeAPI = [];
for (const name of names) {
  try {
    if (window[name].prototype instanceof Node) {
      DOM_NodeAPI.push(name);
    }
  } catch(e) {
  }
}
names = filterOut(names, DOM_NodeAPI);
names = filterOut(names, ['Node', 'NodeList', 'RadioNodeList', 'HTMLAllCollection', 'HTMLCollection', 'HTMLOptionsCollection', 'HTMLFormControlsCollection']);
/**
 * Document
 * https://dom.spec.whatwg.org/#interface-document
 */
names = filterOut(names, ['DOMImplementation', 'NamedNodeMap'])
/**
* DOM Events
* https://dom.spec.whatwg.org/#events
*/
names = filterOut(names, ['Event', 'EventTarget', 'CustomEvent']);
names = filterOut(names, ['PopStateEvent', 'PointerEvent', 'UIEvent', 'TextEvent', 'WheelEvent', 'BeforeInstallPromptEvent', 'PageTransitionEvent', 'FocusEvent', 'MouseEvent', 'HashChangeEvent', 'ErrorEvent', 'DragEvent', 'CompositionEvent', 'BeforeUnloadEvent', 'ClipboardEvent', 'SecurityPolicyViolationEvent', 'KeyboardEvent', 'InputEvent' ])
/**
 * Aborting
* https://dom.spec.whatwg.org/#aborting-ongoing-activities
*/
names = filterOut(names, ['AbortController', 'AbortSignal', ]);
/**
 * mutation
* https://dom.spec.whatwg.org/#mutation-observers
*/
names = filterOut(names, ['MutationObserver', 'MutationRecord', ]);
/**
 * XPath
* https://dom.spec.whatwg.org/#xpath
*/
names = filterOut(names, ['XPathResult', 'XPathExpression', 'XPathEvaluator',]);
/**
 * Range
* https://dom.spec.whatwg.org/#ranges
*/
names = filterOut(names, ['Range', 'StaticRange', 'Selection', 'getSelection']);
/**
 * DOMTokenList
* https://dom.spec.whatwg.org/#interface-domtokenlist
*/
names = filterOut(names, ['DOMTokenList',]);
/**
 * URL
 * https://url.spec.whatwg.org/
 */
names = filterOut(names, ['URL', 'URLSearchParams'])
/**
 * Traversal
* https://dom.spec.whatwg.org/#traversal
*/
names = filterOut(names, ['NodeIterator', 'TreeWalker', 'NodeFilter']);

/********** drafts ****** */

// https://drafts.fxtf.org/geometry/
names = filterOut(names, ['DOMRectReadOnly', 'DOMRectList', 'DOMRect', 'DOMPointReadOnly', 'DOMPoint', 'DOMMatrixReadOnly', 'DOMMatrix', 'DOMQuad', ]);

// https://heycam.github.io/webidl/#idl-DOMException
names = filterOut(names, ['DOMException']);

/**
 * W3C Media Source
 * https://html.spec.whatwg.org/multipage/media.html
 * https://w3c.github.io/media-source/
 */
names = filterOut(names, ['MediaError', 'SourceBuffer', 'SourceBufferList',  'VideoPlaybackQuality', 'VideoTrackList', 'AudioTrackList', 'AudioTrack', 'VideoTrack', 'TextTrackList', 'TextTrack', 'TextTrackCueList', 'TextTrackCue', 'TimeRanges', 'TrackEvent'])
names = filterOut(names, ['MediaSource', 'SourceBuffer', 'SourceBufferList', 'VideoPlaybackQuality']);

/**
 * W3c Media Session
 * https://w3c.github.io/mediasession/
 */
names = filterOut(names, ['MediaMetadata', 'MediaSession'])

/**
 * 
 * https://w3c.github.io/picture-in-picture/
 */
names = filterOut(names, ['PictureInPictureEvent', 'PictureInPictureWindow']);

/**
 * Touch
 * https://www.w3.org/TR/touch-events/
 */
names = filterOut(names, ['Touch', 'TouchEvent', 'TouchList', 'InputDeviceCapabilities'])

// 废弃， DOMStringMap 查不到
names = filterOut(names, ['DOMStringList', 'DOMStringMap', 'DOMError', 'MutationEvent', 'captureEvents', 'releaseEvents', 'external', 'External']);

/******* Drafts */
// https://wicg.github.io/visual-viewport/
names = filterOut(names, ['VisualViewport', 'visualViewport']);

/************************************************************** HTML API ******************************************************************************** /

/**
 * 40
 * webapi
 * https://html.spec.whatwg.org/multipage/#toc-webappapis
 */
names = filterOut(names, ['atob', 'btoa', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Plugin', 'PluginArray', 'MimeType', 'MimeTypeArray', 'Image', 'Blob', 'Animation', 'AnimationEffect', 'AnimationEvent', 'AnimationPlaybackEvent', 'AnimationTimeline', 'requestAnimationFrame', 'cancelAnimationFrame', 'MessageEvent', 'MessagePort', 'MessageChannel', 'EventSource', 'CloseEvent', 'BroadcastChannel', 'PromiseRejectionEvent']);
/**
 * Canvas
 * https://html.spec.whatwg.org/multipage/canvas.html
 */
names = filterOut(names, ['CanvasRenderingContext2D', 'OffscreenCanvasRenderingContext2D', 'Path2D', 'ImageBitmap', 'ImageData', 'TextMetrics', 'CanvasGradient', 'CanvasPattern',  'OffscreenCanvas', 'ImageBitmapRenderingContext', 'createImageBitmap']);

/**
 * Worker
 * https://html.spec.whatwg.org/multipage/workers.html
 * https://w3c.github.io/ServiceWorker/
 * https://drafts.css-houdini.org/worklets/
 */
names = filterOut(names, ['Worker', 'SharedWorker', 'ServiceWorker', 'ServiceWorkerContainer', 'Cache', 'caches', 'CacheStorage', 'Worklet', 'NavigationPreloadManager'])
/**
 * WebSocket
 * https://www.w3.org/TR/websockets/
 */
names = filterOut(names, ['WebSocket']);

/**
 * window object
 * https://html.spec.whatwg.org/multipage/window-object.html#window
 */
names = filterOut(names, ['window', 'self', 'document', 'name', 'location', 'history', 'event', 'customElements', 'locationbar', 'menubar', 'personalbar', 'scrollbars', 'statusbar', 'toolbar', 'status', 'close', 'closed', 'stop', 'focus', 'blur', 'frames', 'length', 'top', 'opener', 'parent', 'frameElement', 'open', 'navigator', 'clientInformation', 'applicationCache', 'originIsolated', 'alert', 'confirm', 'prompt', 'print', 'postMessage', 'find', 'offscreenBuffering', 'styleMedia', 'queueMicrotask']);
names = filterOut(names, ['Navigator', 'BarProp', 'Window', 'History', 'Location', 'ApplicationCache', 'Notification', 'ElementInternals', 'CustomElementRegistry']);

/**
 * window global event handlers
 * https://html.spec.whatwg.org/multipage/webappapis.html#globaleventhandlers
 */
const Global_Event_Handlers = [];
for (const name of names) {
  if (/^on/.test(name)) {
    Global_Event_Handlers.push(name);
  }
}
names = filterOut(names, Global_Event_Handlers);

/**
 * origin
 * https://html.spec.whatwg.org/multipage/origin.html#origin
 */
names = filterOut(names, ['origin']);

/**
 * 4
 * whatwg webstorage
 * https://html.spec.whatwg.org/multipage/#toc-webstorage
 */
names = filterOut(names, ['Storage', 'sessionStorage', 'localStorage', 'StorageEvent', 'StorageManager']);

/**
 * DOM Parser
 * https://w3c.github.io/DOM-Parsing/
 */
names = filterOut(names, ['DOMParser', 'XMLSerializer']);

/**
 * xhr
 * https://xhr.spec.whatwg.org/
 */
names = filterOut(names, ['XMLHttpRequestUpload', 'XMLHttpRequestEventTarget', 'XMLHttpRequest', 'FormData', 'ProgressEvent']);

/**
 * fetch
 * https://fetch.spec.whatwg.org/
 */
names = filterOut(names, ['fetch', 'Request', 'Response', 'Headers']);

/**
 * background fetch
 * https://wicg.github.io/background-fetch/
 */
names = filterOut(names, ['BackgroundFetchManager', 'BackgroundFetchRecord', 'BackgroundFetchRegistration']);

/**
 * streams
 * https://streams.spec.whatwg.org/
 */
names = filterOut(names, ['ReadableStream', 'ReadableStreamDefaultReader', 'WritableStream', 'WritableStreamDefaultWriter', 'CountQueuingStrategy', 'ByteLengthQueuingStrategy'])

/**
 * File API
 * https://w3c.github.io/FileAPI/
 */
names = filterOut(names, ['FileReader', 'FileList', 'File'])

/**
 * Drag And Drop
 * https://html.spec.whatwg.org/multipage/dnd.html
 */
names = filterOut(names, ['DragEvent', 'DataTransfer', 'DataTransferItemList', 'DataTransferItem'])

/**
 * console
 * https://console.spec.whatwg.org/
 */
names = filterOut(names, ['console']);

/**
 * Encoding
 * https://encoding.spec.whatwg.org/
 */
const EncodingAPI = ['TextEncoderStream', 'TextEncoder', 'TextDecoderStream', 'TextDecoder'];
names = filterOut(names, EncodingAPI);

/**
 * Others
 */
names = filterOut(names, ['ValidityState', 'SubmitEvent', 'FormDataEvent', 'defaultStatus', 'defaultstatus'])

/************************************************************** W3C ******************************************************************************** /
 * 

/**************************************************************  CSS/SVG WG ******************************************************************************** /
/**
 * csswg
 * CSSOM
 * https://drafts.csswg.org/cssom/
 * https://drafts.css-houdini.org/css-typed-om-1/
 * https://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSview-getComputedStyle
 */
const CSSOMAPI = [];
for (const name of names) {
  if (/^CSS/.test(name)) {
    CSSOMAPI.push(name);
  }
}
names = filterOut(names, CSSOMAPI);
names = filterOut(names, ['getComputedStyle', 'matchMedia', 'MediaQueryListEvent', 'MediaQueryList', 'MediaList', 'StyleSheetList', 'StyleSheet', 'StylePropertyMapReadOnly', 'StylePropertyMap']);
// https://drafts.csswg.org/cssom-view/#extensions-to-the-window-interface
names = filterOut(names, ['moveTo','moveBy','resizeTo','resizeBy','scroll','scrollTo','scrollBy', 'scrollX', 'scrollY', 'screenX', 'screenY', 'innerHeight', 'innerWidth', 'outerHeight', 'outerWidth', 'pageXOffset', 'pageYOffset', 'devicePixelRatio', 'screenLeft', 'screenTop']);

/**
 * CSS Transitions
 * https://drafts.csswg.org/css-transitions/
 */
names = filterOut(names, ['TransitionEvent', 'TransformStream']);

/**
 * Web Animations
 * https://drafts.csswg.org/web-animations-1/
 */
names = filterOut(names, ['Animation', 'KeyframeEffect', 'AnimationEffect', 'AnimationPlaybackEvent', 'DocumentTimeline', 'AnimationTimeline'])

/**
 * Font Face
 * https://drafts.csswg.org/css-font-loading
 */
names = filterOut(names, ['FontFaceSetLoadEvent', 'FontFace'])

//https://drafts.csswg.org/resize-observer/
names = filterOut(names, ['ResizeObserverEntry', 'ResizeObserverSize', 'ResizeObserver']);

/**
 * SVG WG
 * https://www.w3.org/TR/SVG2/
 * https://svgwg.org/svg2-draft/
 */
const SVGAPI = [];
for (const name of names) {
  if (/^SVG/.test(name)) {
    SVGAPI.push(name);
  }
}
names = filterOut(names, SVGAPI);

/**************************************************************  W3C Others  ******************************************************************************** /
/**
 * W3C WebRTC
 * https://w3c.github.io/webrtc-pc/
 */
const WebRTCAPI = [];
for (const name of names) {
  if (/^RTC/.test(name)) {
    WebRTCAPI.push(name);
  }
}
names = filterOut(names, WebRTCAPI);

/**
 * w3c mediacapture-main
 * https://w3c.github.io/mediacapture-main/
 */
names = filterOut(names, ['ImageCapture', 'MediaStream', 'MediaStreamTrackEvent', 'MediaStreamTrack', 'MediaStreamEvent', 'MediaSettingsRange', 'MediaRecorder', 'MediaEncryptedEvent', 'MediaCapabilities', 'BlobEvent', 'PhotoCapabilities', 'OverconstrainedError', 'InputDeviceInfo', 'CanvasCaptureMediaStreamTrack'])

/**
 * webaudio
 * https://webaudio.github.io/web-audio-api/
 */
const WEB_AUDIOAPI = ['BaseAudioContext', 'AudioNode', 'AudioBuffer', 'AudioParam', 'AudioParamMap', 'AudioListener', 'AudioProcessingEvent', 'PeriodicWave', 'AudioWorklet', 'OfflineAudioCompletionEvent', 'MediaDeviceInfo', 'MediaDevices', 'MediaKeyMessageEvent', 'MediaKeys', 'MediaKeySession', 'MediaKeyStatusMap', 'MediaKeySystemAccess', ];
for (const name of names) {
  try {
    if (window[name].prototype instanceof BaseAudioContext || window[name].prototype instanceof AudioNode) {
      WEB_AUDIOAPI.push(name);
    }
  } catch(e) {
  }
}
names = filterOut(names, WEB_AUDIOAPI);

/**
 * Web Midi
 * https://webaudio.github.io/web-midi-api/
 */
const WebMidiAPI = [];
for (const name of names) {
  if (/^MIDI/.test(name)) {
    WebMidiAPI.push(name);
  }
}
names = filterOut(names, WebMidiAPI);

/**
 * GamePad
 * https://w3c.github.io/gamepad/extensions.htm
 */
const GamepadAPI = [];
for (const name of names) {
  if (/^Gamepad/.test(name)) {
    GamepadAPI.push(name);
  }
}
names = filterOut(names, GamepadAPI);

/**
 * Geolocation
 * https://w3c.github.io/geolocation-api/
 */
const GeolocationAPI = [];
for (const name of names) {
  if (/^Geolocation/.test(name)) {
    GeolocationAPI.push(name);
  }
}
names = filterOut(names, GeolocationAPI);

// https://w3c.github.io/battery/
names = filterOut(names, ['BatteryManager']);

// https://w3c.github.io/deviceorientation/
names = filterOut(names, ['DeviceMotionEvent', 'DeviceMotionEventAcceleration', 'DeviceMotionEventRotationRate', 'DeviceOrientationEvent']);

/**
 * W3C screen-orientation
 * https://w3c.github.io/screen-orientation/
 */
const Screen_orientation = ['screen', 'Screen', 'ScreenOrientation', ]
names = filterOut(names, Screen_orientation);

/**
 * Web Authentication
 * https://w3c.github.io/webauthn/
 * Authenticator
 */
const WebAuthnAPI = [];
for (const name of names) {
  if (/^Authenticator/i.test(name)) {
    WebAuthnAPI.push(name);
  }
}
names = filterOut(names, WebAuthnAPI);

/**
 * trusted types
 * https://w3c.github.io/webappsec-trusted-types/dist/spec/
 */
const TrustedAPI = [];
for (const name of names) {
  if (/^Trusted/i.test(name)) {
    TrustedAPI.push(name);
  }
}
names = filterOut(names, TrustedAPI);

/**
 * w3c persentation
 * https://w3c.github.io/presentation-api/
 */
const WebPresentationAPI = [];
for (const name of names) {
  if (/^Presentation/.test(name)) {
    WebPresentationAPI.push(name);
  }
}
names = filterOut(names, WebPresentationAPI);

/**
 * Web VTT
 * https://w3c.github.io/webvtt/
 */
names = filterOut(names, ['VTTCue']);

/**
 * Clipboard
 * https://w3c.github.io/clipboard-apis/
 */

names = filterOut(names, ['Clipboard', 'ClipboardItem'])

/**
* Push
* https://w3c.github.io/push-api/
*/
names = filterOut(names, ['PushManager', 'PushSubscription', 'PushSubscriptionOptions'])

/**
* WakeLock
* https://w3c.github.io/screen-wake-lock
*/
names = filterOut(names, ['WakeLock', 'WakeLockSentinel', 'PushSubscriptionOptions'])

/**
* IntersectionObserver
* https://w3c.github.io/IntersectionObserver/
*/

names = filterOut(names, ['IntersectionObserver', 'IntersectionObserverEntry'])
/**
https://w3c.github.io/permissions/
*/
names = filterOut(names, ['Permissions', 'PermissionStatus'])
/**
* https://w3c.github.io/webappsec-credential-management/
*/
names = filterOut(names, ['Credential', 'CredentialsContainer', 'FederatedCredential', 'PasswordCredential', 'PublicKeyCredential'])

/**
 * FeaturePolicy
 * https://w3c.github.io/webappsec-permissions-policy/
 */

names = filterOut(names, ['FeaturePolicy'])

/**
 * Reporting
 * https://w3c.github.io/reporting/
 */
names = filterOut(names, ['ReportingObserver'])

/**
 * Secure Contexts
 * https://w3c.github.io/webappsec-secure-contexts/
 */
names = filterOut(names, ['isSecureContext'])

/**
 * Remote Playback
 * https://w3c.github.io/remote-playback/
 */
names = filterOut(names, ['RemotePlayback'])


/**
 * SensorAPI
 * https://www.w3.org/TR/generic-sensor
 */
const SensorAPI = ['Sensor', 'SensorErrorEvent'];
for (const name of names) {
  try {
    if (window[name].prototype instanceof Sensor) {
      SensorAPI.push(name);
    }
  } catch(e) {

  }
}
names = filterOut(names, SensorAPI);
/**
 * w3 IndexedDB
 * https://www.w3.org/TR/IndexedDB/
 */
const IndexedDBAPI = [];
for (const name of names) {
  if (/^IDB/.test(name)) {
    IndexedDBAPI.push(name);
  }
}
names = filterOut(names, IndexedDBAPI);
names = filterOut(names, ['openDatabase', 'indexedDB']);

/**
 * w3 navigation-timing
 * https://www.w3.org/TR/navigation-timing/
 */
const PerformanceAPI = [];
for (const name of names) {
  if (/^Performance/i.test(name)) {
    PerformanceAPI.push(name);
  }
}
names = filterOut(names, PerformanceAPI);
names = filterOut(names, ['TaskAttributionTiming']);


// https://www.w3.org/TR/payment-handler/
const PaymentAPI = [];
for (const name of names) {
  if (/^Payment/i.test(name)) {
    PaymentAPI.push(name);
  }
}
names = filterOut(names, PaymentAPI);

/**
 * Crypto API
 * https://www.w3.org/TR/WebCryptoAPI/
 */

names = filterOut(names, ['Crypto', 'crypto', 'CryptoKey', 'SubtleCrypto'])

/**
* Idle Callback
* https://www.w3.org/TR/requestidlecallback/
*/
names = filterOut(names, ['requestIdleCallback', 'cancelIdleCallback', 'IdleDeadline']);

/**
 * immersive-web webxr
 * https://www.w3.org/TR/webxr/
 * https://immersive-web.github.io/webxr/
 */
const WebXRAPI = [];
for (const name of names) {
  if (/^XR/.test(name)) {
    WebXRAPI.push(name);
  }
}
names = filterOut(names, WebXRAPI);

/**
 * WebAssembly
 * https://www.w3.org/TR/wasm-js-api-1/
 * https://webassembly.github.io/spec/js-api/
 */
names = filterOut(names, ['WebAssembly']);

/************************************************************** WICG ******************************************************************************** /

/**
 * Web Speech API
 * https://wicg.github.io/speech-api/
 */
const WebSpeechAPI = [];
for (const name of names) {
  if (/^Speech/i.test(name)) {
    WebSpeechAPI.push(name);
  }
}
names = filterOut(names, WebSpeechAPI);

/**
 * wicg Web USB
 * https://wicg.github.io/webusb
 */
const WebUSBAPI = [];
for (const name of names) {
  if (/^USB/.test(name)) {
    WebUSBAPI.push(name);
  }
}
names = filterOut(names, WebUSBAPI);

/**
 * background-sync
 * https://wicg.github.io/background-sync/spec/
 */
const BackgroundAPI = ['ServiceWorkerRegistration', 'SyncManager']
names = filterOut(names, BackgroundAPI);
/**
 * wicg Event timing
 * https://github.com/WICG/event-timing
 */
names = filterOut(names, ['EventCounts']);

// https://wicg.github.io/compression/
names = filterOut(names, ['DecompressionStream', 'CompressionStream']);

/**
* https://wicg.github.io/web-locks/
*/
names = filterOut(names, ['Lock', 'LockManager'])

/**
* https://wicg.github.io/keyboard-map/
*/
names = filterOut(names, ['Keyboard', 'KeyboardLayoutMap'])

/**
 * Layout instability
 * https://wicg.github.io/layout-instability/
 */
names = filterOut(names, ['LayoutShift', 'LayoutShiftAttribution'])

/**
 * LCP
 * https://wicg.github.io/largest-contentful-paint/
 */

names = filterOut(names, ['LargestContentfulPaint'])

/**
 * NetworkInformation
 * https://wicg.github.io/netinfo/
 */
names = filterOut(names, ['NetworkInformation'])

/**
 * Background Sync
 * https://wicg.github.io/background-sync/spec/PeriodicBackgroundSync-index.html
 */
names = filterOut(names, ['PeriodicSyncManager'])

/**
 * FragmentDirective
 * Move to document.fragmentDirective
 * https://wicg.github.io/scroll-to-text-fragment/
 * https://github.com/WICG/scroll-to-text-fragment/pull/134
 * https://www.chromestatus.com/feature/5679640498667520
 */
names = filterOut(names, ['FragmentDirective'])

/**
 * Web Bluetooth
 * https://webbluetoothcg.github.io/web-bluetooth/
 */
const WebBleAPI = [];
for (const name of names) {
  if (/^Bluetooth/.test(name)) {
    WebBleAPI.push(name);
  }
}
names = filterOut(names, WebBleAPI);

/**************************************************************  Others  ******************************************************************************** /
/**
 * khronos WebGL
 * https://www.khronos.org/registry/webgl/specs/latest/2.0/
 */
const WebGL_Prefix = [];
for (const name of names) {
  if (/^WebGL/.test(name)) {
    WebGL_Prefix.push(name);
  }
}
names = filterOut(names, WebGL_Prefix);

/**************************************************************  Private  ******************************************************************************** /
/**
 * 13
 * Webkit Private
 */
const Webkit_Private = [];
for (const name of names) {
  if (/^webkit/i.test(name)) {
    Webkit_Private.push(name);
  }
}
names = filterOut(names, Webkit_Private);

// https://developer.mozilla.org/en-US/docs/Web/API/XSLTProcessor
names = filterOut(names, ['XSLTProcessor']);

/**
 * chrome
 * https://www.chromestatus.com/feature/4757990523535360
 */
names = filterOut(names, ['BarcodeDetector'])

/**
 * UserActivation V2
 * https://mustaqahmed.github.io/user-activation-v2/
 */
names = filterOut(names, ['UserActivation']);

names = filterOut(names, ['chrome']);

/************************************************************** Experiment Feature ********************************************************************************/
/**
 * Enable chrome://flags/#experimental-web-platform-features
 */

/**
 * W3C/WICG origin
 * https://html.spec.whatwg.org/multipage/origin.html
 * https://github.com/wicg/origin-policy
 */
names = filterOut(names, ['originIsolationRestricted', 'crossOriginIsolated', 'originPolicyIds']);

/**
 * Web Serial API
 * https://wicg.github.io/serial/
 */
names = filterOut(names, ['SerialPortInfo', 'Serial', 'SerialPort', 'SerialConnectionEvent']);

/**
 * Native File System
 * https://wicg.github.io/native-file-system/
 */
names = filterOut(names, ['FileSystemDirectoryHandle','FileSystemFileHandle','FileSystemHandle','FileSystemWritableFileStream', 'showDirectoryPicker', 'showOpenFilePicker', 'showSaveFilePicker', 'chooseFileSystemEntries', 'getOriginPrivateDirectory']);

/**
 * Web HID
 * https://wicg.github.io/webhid/
 */
names = filterOut(names, ['HID','HIDCollectionInfo','HIDConnectionEvent','HIDDevice','HIDInputReportEvent','HIDReportInfo','HIDReportItem',]);

/**
 * Web NFC
 * https://w3c.github.io/web-nfc/
 */
names = filterOut(names, ['NDEFMessage','NDEFReader','NDEFReadingEvent','NDEFRecord','NDEFWriter',]);

/**
 * Web Transport
 * https://wicg.github.io/web-transport/
 */
names = filterOut(names, ['SendStream','ReceiveStream','QuicTransport','BidirectionalStream',]);

/**
 * Cookie Store API
 * https://wicg.github.io/cookie-store/
 */
names = filterOut(names, ['CookieChangeEvent','CookieStore','CookieStoreManager', 'cookieStore']);

/**
 * WebSocketStream
 * https://chromestatus.com/feature/5189728691290112
 * https://web.dev/websocketstream/
 */
names = filterOut(names, ['WebSocketStream'])
/************************************************************** End ********************************************************************************/
console.log(names);
