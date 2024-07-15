//사용자의 운영체제 이름을 식별
export function getOSName() {
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf('Windows') != -1) {
    // Get Windows version
    const version = /Windows\sNT\s(\d+\.\d+)/i.exec(userAgent);
    return version ? `Windows ${version[1]}` : 'Windows';
  } else if (userAgent.indexOf('Mac OS X') != -1) {
    // Get macOS version
    const version = /Mac OS X\s([\d._]+)/i.exec(userAgent);
    return version ? `MacOS ${version[1].replace(/_/g, '.')}` : 'MacOS';
  } else if (userAgent.indexOf('Linux') != -1) {
    // Get Linux version
    const version = /Linux\s?([\d._]*)/i.exec(userAgent);
    return version ? `Linux ${version[1].replace(/_/g, '.')}` : 'Linux';
  } else if (userAgent.indexOf('Android') != -1) {
    // Get Android version
    const version = /Android\s([\d.]+)/i.exec(userAgent);
    return version ? `Android ${version[1]}` : 'Android';
  } else if (userAgent.indexOf('iOS') != -1) {
    // Get iOS version
    const version = /\bOS\s([\d_]+)/i.exec(userAgent);
    return version ? `iOS ${version[1].replace(/_/g, '.')}` : 'iOS';
  } else {
    return 'unknown';
  }
}

//사용자가 사용하는 브라우저 이름을 식별
export function getBrowserName() {
  if (
    (navigator.userAgent.indexOf('Opera') ||
      navigator.userAgent.indexOf('OPR')) != -1
  ) {
    return 'Opera';
  } else if (navigator.userAgent.indexOf('Chrome') != -1) {
    return 'Chrome';
  } else if (navigator.userAgent.indexOf('Safari') != -1) {
    return 'Safari';
  } else if (navigator.userAgent.indexOf('Firefox') != -1) {
    return 'Firefox';
  } else if (navigator.userAgent.indexOf('MSIE') != -1) {
    //IF IE > 10
    return 'IE';
  } else {
    return 'unknown';
  }
}

//사용자의 기기 종류를 식별
export function getDeviceName() {
  const userAgent = navigator.userAgent;

  if (/iPad/i.test(userAgent)) {
    // Get iPad version
    const version = /iPad\sOS\s([\d_]+)/i.exec(userAgent);
    return version ? `iPad ${version[1].replace(/_/g, '.')}` : 'iPad';
  } else if (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) {
    // Get Android Tablet version
    const version = /Android\s([\d.]+)/i.exec(userAgent);
    return version ? `Android Tablet ${version[1]}` : 'Android Tablet';
  } else if (/Android/i.test(userAgent) && /Mobile/i.test(userAgent)) {
    // Get Android Mobile version
    const version = /Android\s([\d.]+)/i.exec(userAgent);
    return version ? `Android Mobile ${version[1]}` : 'Android Mobile';
  } else if (/iPhone/i.test(userAgent)) {
    // Get iPhone version
    const version = /\bOS\s([\d_]+)/i.exec(userAgent);
    return version ? `iPhone ${version[1].replace(/_/g, '.')}` : 'iPhone';
  } else if (/iPod/i.test(userAgent)) {
    // Get iPod version
    const version = /\bOS\s([\d_]+)/i.exec(userAgent);
    return version ? `iPod ${version[1].replace(/_/g, '.')}` : 'iPod';
  } else if (/BlackBerry/i.test(userAgent)) {
    // Get BlackBerry version
    const version = /BlackBerry\s?(\d+)/i.exec(userAgent);
    return version ? `BlackBerry ${version[1]}` : 'BlackBerry';
  } else if (/Windows NT|Macintosh|MacIntel|Linux/i.test(userAgent)) {
    return 'Desktop';
  } else {
    return 'Unknown';
  }
}

//isMobile(): 사용자의 기기가 모바일 기기인지 여부를 확인
export function isMobile() {
  var agent = window.navigator.userAgent;
  const mobileRegex = [
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return mobileRegex.some((mobile) => agent.match(mobile));
}