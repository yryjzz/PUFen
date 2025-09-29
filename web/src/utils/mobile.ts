/**
 * 移动端H5工具函数
 */

/**
 * 判断是否在微信内置浏览器中
 */
export const isWechat = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
};

/**
 * 判断是否在QQ内置浏览器中
 */
export const isQQ = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('qq/') && !ua.includes('mqqbrowser');
};

/**
 * 判断是否在微博内置浏览器中
 */
export const isWeibo = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('weibo');
};

/**
 * 判断是否在支付宝内置浏览器中
 */
export const isAlipay = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('alipayclient');
};

/**
 * 获取设备信息
 */
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isMobile = isIOS || isAndroid;
  
  return {
    isIOS,
    isAndroid,
    isMobile,
    isWechat: isWechat(),
    isQQ: isQQ(),
    isWeibo: isWeibo(),
    isAlipay: isAlipay(),
    userAgent: ua,
  };
};

/**
 * 获取屏幕信息
 */
export const getScreenInfo = () => {
  const { innerWidth, innerHeight } = window;
  const { availWidth, availHeight } = window.screen;
  const pixelRatio = window.devicePixelRatio || 1;
  
  return {
    width: innerWidth,
    height: innerHeight,
    availWidth,
    availHeight,
    pixelRatio,
    isLandscape: innerWidth > innerHeight,
    isPortrait: innerWidth <= innerHeight,
  };
};

/**
 * 禁止页面滚动
 */
export const disableScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100%';
};

/**
 * 恢复页面滚动
 */
export const enableScroll = () => {
  document.body.style.overflow = '';
  document.body.style.height = '';
};

/**
 * 防止iOS橡皮筋效果
 */
export const preventBounce = () => {
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};

/**
 * 添加触摸反馈
 */
export const addTouchFeedback = (element: HTMLElement) => {
  const handleTouchStart = () => {
    element.classList.add('press-effect');
  };
  
  const handleTouchEnd = () => {
    setTimeout(() => {
      element.classList.remove('press-effect');
    }, 150);
  };
  
  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchend', handleTouchEnd);
  element.addEventListener('touchcancel', handleTouchEnd);
  
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
    element.removeEventListener('touchcancel', handleTouchEnd);
  };
};

/**
 * 设置页面标题（兼容各种环境）
 */
export const setPageTitle = (title: string) => {
  document.title = title;
  
  // 微信环境下需要特殊处理
  if (isWechat()) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'data:text/html,<title>' + title + '</title>';
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * 获取URL参数
 */
export const getUrlParams = (url?: string) => {
  const urlStr = url || window.location.href;
  const params: Record<string, string> = {};
  const urlObj = new URL(urlStr);
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = decodeURIComponent(value);
  });
  
  return params;
};

/**
 * 跳转到外部链接
 */
export const openExternalLink = (url: string) => {
  if (isWechat()) {
    // 微信环境下提示用户在浏览器中打开
    alert('请点击右上角菜单，选择"在浏览器中打开"');
    return;
  }
  
  window.open(url, '_blank');
};

/**
 * 复制文本到剪贴板（移动端兼容）
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // 现代浏览器
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // 兼容方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    
    // 移动端需要聚焦
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);
    
    const result = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return result;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
};

/**
 * 分享到微信（需要微信JS-SDK）
 */
export const shareToWechat = (options: {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
}) => {
  if (!isWechat()) {
    alert('请在微信中打开此页面');
    return;
  }
  
  // 这里需要集成微信JS-SDK
  console.log('分享配置:', options);
  alert('请点击右上角分享按钮');
};

/**
 * 设置页面分享信息
 */
export const setShareInfo = (options: {
  title: string;
  desc: string;
  link?: string;
  imgUrl?: string;
}) => {
  const { title, desc, link = window.location.href, imgUrl = '/share-image.png' } = options;
  
  // 设置meta标签
  const setMeta = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };
  
  setMeta('og:title', title);
  setMeta('og:description', desc);
  setMeta('og:url', link);
  setMeta('og:image', imgUrl);
};

/**
 * 震动反馈（如果设备支持）
 */
export const vibrate = (pattern: number | number[] = 100) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/**
 * 检查网络状态
 */
export const getNetworkStatus = () => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || 0,
    rtt: connection?.rtt || 0,
  };
};

/**
 * 监听网络状态变化
 */
export const onNetworkChange = (callback: (online: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * 原生分享功能
 */
export const share = async (data: {
  title?: string;
  text?: string;
  url?: string;
}) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Share failed:', error);
      throw error;
    }
  } else {
    // 如果不支持原生分享，抛出错误让调用者处理
    throw new Error('Web Share API not supported');
  }
};