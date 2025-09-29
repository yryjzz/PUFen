/**
 * H5分享和社交功能
 */

interface ShareConfig {
  title: string;
  desc: string;
  link?: string;
  imgUrl?: string;
}

/**
 * 设置微信分享配置
 */
export const setupWechatShare = (config: ShareConfig) => {
  const { title, desc, link = window.location.href, imgUrl = '/icon-192x192.png' } = config;
  
  // 设置页面title和meta信息
  document.title = title;
  
  // 设置Open Graph meta标签
  const metaTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: desc },
    { property: 'og:url', content: link },
    { property: 'og:image', content: imgUrl },
    { property: 'og:type', content: 'website' },
    { name: 'description', content: desc },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: imgUrl },
  ];
  
  metaTags.forEach(({ property, name, content }) => {
    const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) meta.setAttribute('property', property);
      if (name) meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  });
  
  // 如果在微信环境中，可以进一步配置微信JS-SDK
  if (window.location.host !== 'localhost') {
    // 这里可以添加微信JS-SDK的配置
    console.log('微信分享配置已设置:', config);
  }
};

/**
 * 原生分享功能（Web Share API）
 */
export const nativeShare = async (config: ShareConfig): Promise<boolean> => {
  if (!navigator.share) {
    return false;
  }
  
  try {
    await navigator.share({
      title: config.title,
      text: config.desc,
      url: config.link || window.location.href,
    });
    return true;
  } catch (error) {
    console.error('分享失败:', error);
    return false;
  }
};

/**
 * 复制链接分享
 */
export const copyLinkShare = async (url?: string): Promise<boolean> => {
  const shareUrl = url || window.location.href;
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    }
    
    // 兼容方案
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const result = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return result;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
};

/**
 * 生成二维码分享
 */
export const generateQRCode = (url?: string, size = 200): string => {
  const shareUrl = encodeURIComponent(url || window.location.href);
  // 使用免费的二维码生成API
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${shareUrl}`;
};

/**
 * 分享到社交平台
 */
export const shareToSocial = (platform: string, config: ShareConfig) => {
  const { title, desc, link = window.location.href } = config;
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(desc);
  const encodedLink = encodeURIComponent(link);
  
  const urls: Record<string, string> = {
    qq: `https://connect.qq.com/widget/shareqq/index.html?url=${encodedLink}&title=${encodedTitle}&desc=${encodedDesc}`,
    qzone: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodedLink}&title=${encodedTitle}&desc=${encodedDesc}`,
    weibo: `https://service.weibo.com/share/share.php?url=${encodedLink}&title=${encodedTitle}${encodedDesc}&pic=${encodeURIComponent(config.imgUrl || '')}`,
    douban: `https://www.douban.com/share/service?href=${encodedLink}&name=${encodedTitle}&text=${encodedDesc}`,
  };
  
  const shareUrl = urls[platform];
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

/**
 * 通用分享方法
 */
export const universalShare = async (config: ShareConfig): Promise<void> => {
  // 首先尝试原生分享
  const nativeSuccess = await nativeShare(config);
  if (nativeSuccess) {
    return;
  }
  
  // 检测环境并提供对应的分享方式
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('micromessenger')) {
    // 微信环境
    setupWechatShare(config);
    showShareTip('请点击右上角菜单分享');
  } else if (userAgent.includes('qq')) {
    // QQ环境
    shareToSocial('qq', config);
  } else {
    // 其他环境，复制链接
    const success = await copyLinkShare(config.link);
    if (success) {
      showToast('链接已复制到剪贴板');
    } else {
      showShareOptions(config);
    }
  }
};

/**
 * 显示分享提示
 */
const showShareTip = (message: string) => {
  const tip = document.createElement('div');
  tip.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-size: 16px;
      text-align: center;
      padding: 20px;
    " onclick="this.parentNode.remove()">
      ${message}<br><br>
      点击任意位置关闭
    </div>
  `;
  document.body.appendChild(tip);
  
  setTimeout(() => {
    if (tip.parentNode) {
      tip.parentNode.removeChild(tip);
    }
  }, 3000);
};

/**
 * 显示Toast提示
 */
const showToast = (message: string) => {
  const toast = document.createElement('div');
  toast.innerHTML = message;
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 10000;
    animation: fadeInOut 2s ease-in-out;
  `;
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0%, 100% { opacity: 0; }
      20%, 80% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }, 2000);
};

/**
 * 显示分享选项
 */
const showShareOptions = (config: ShareConfig) => {
  const modal = document.createElement('div');
  modal.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 10000;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    " onclick="event.target === this && this.remove()">
      <div style="
        background: white;
        border-radius: 16px 16px 0 0;
        width: 100%;
        max-width: 500px;
        padding: 20px;
        transform: translateY(0);
        animation: slideUp 0.3s ease-out;
      ">
        <h3 style="text-align: center; margin-bottom: 20px; color: #333;">分享到</h3>
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
          <div onclick="shareToSocial('weibo', ${JSON.stringify(config).replace(/"/g, '&quot;')})" style="text-align: center; cursor: pointer;">
            <div style="width: 50px; height: 50px; background: #ff6b6b; border-radius: 50%; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">微</div>
            <div style="font-size: 12px; color: #666;">微博</div>
          </div>
          <div onclick="shareToSocial('qq', ${JSON.stringify(config).replace(/"/g, '&quot;')})" style="text-align: center; cursor: pointer;">
            <div style="width: 50px; height: 50px; background: #00aaff; border-radius: 50%; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">Q</div>
            <div style="font-size: 12px; color: #666;">QQ</div>
          </div>
          <div onclick="copyLinkShare('${config.link}').then(success => success && showToast('链接已复制')); this.closest('[onclick]').remove();" style="text-align: center; cursor: pointer;">
            <div style="width: 50px; height: 50px; background: #4CAF50; border-radius: 50%; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">📋</div>
            <div style="font-size: 12px; color: #666;">复制链接</div>
          </div>
        </div>
        <button onclick="this.closest('.modal').remove()" style="
          width: 100%;
          height: 44px;
          background: #f5f5f5;
          border: none;
          border-radius: 22px;
          color: #666;
          font-size: 16px;
          cursor: pointer;
        ">取消</button>
      </div>
    </div>
  `;
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  modal.className = 'modal';
  document.body.appendChild(modal);
};

/**
 * 创建分享按钮组件
 */
export const createShareButton = (config: ShareConfig, container?: HTMLElement): HTMLElement => {
  const button = document.createElement('button');
  button.innerHTML = '🔗 分享';
  button.style.cssText = `
    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  `;
  
  button.onclick = () => universalShare(config);
  
  if (container) {
    container.appendChild(button);
  }
  
  return button;
};