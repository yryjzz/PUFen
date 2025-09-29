import dayjs from 'dayjs';

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

/**
 * 格式化时间
 */
export const formatTime = (date: string | Date, format = 'HH:mm') => {
  return dayjs(date).format(format);
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string | Date, format = 'MM/DD HH:mm') => {
  return dayjs(date).format(format);
};

/**
 * 计算时间差
 */
export const getTimeAgo = (date: string | Date) => {
  const now = dayjs();
  const target = dayjs(date);
  const diff = now.diff(target);
  
  if (diff < 60000) { // 小于1分钟
    return '刚刚';
  } else if (diff < 3600000) { // 小于1小时
    return `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff < 86400000) { // 小于1天
    return `${Math.floor(diff / 3600000)}小时前`;
  } else if (diff < 604800000) { // 小于1周
    return `${Math.floor(diff / 86400000)}天前`;
  } else {
    return target.format('MM/DD');
  }
};

/**
 * 获取本周的开始日期（周一）
 */
export const getWeekStart = (date?: string | Date) => {
  const target = date ? dayjs(date) : dayjs();
  const weekday = target.day();
  const diff = weekday === 0 ? -6 : 1 - weekday; // 周日为0，需要调整为-6
  return target.add(diff, 'day').startOf('day');
};

/**
 * 获取本周的日期数组
 */
export const getWeekDates = (date?: string | Date) => {
  const weekStart = getWeekStart(date);
  return Array.from({ length: 7 }, (_, i) => 
    weekStart.add(i, 'day').format('YYYY-MM-DD')
  );
};

/**
 * 判断是否为今天
 */
export const isToday = (date: string | Date) => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * 判断是否为本周
 */
export const isThisWeek = (date: string | Date) => {
  const weekStart = getWeekStart();
  const weekEnd = weekStart.add(6, 'day').endOf('day');
  const target = dayjs(date);
  return target.isAfter(weekStart) && target.isBefore(weekEnd);
};