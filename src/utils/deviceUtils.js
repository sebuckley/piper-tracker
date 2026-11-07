// deviceUtils.ts

const DEVICE_ID_KEY = "piper_device_id";

export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getDeviceMetadata() {
  const ua = navigator.userAgent.toLowerCase();

  const platform =
    /iphone|ipad|ipod/.test(ua) ? "ios" :
    /android/.test(ua) ? "android" :
    /macintosh|mac os x/.test(ua) ? "mac" :
    /windows/.test(ua) ? "windows" :
    "web";

  return {
    deviceName: "Piper Tracker",
    platform,
  };
}
