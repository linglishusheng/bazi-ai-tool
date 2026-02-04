// lunar.js - 简化八字排盘（仅年月日干支）
const HeavenlyStems = ['甲','乙','丙','丁','E','己','庚','辛','壬','癸'];
const EarthlyBranches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 年干支（1900起）
function getYearGanZhi(year) {
  const yearOffset = (year - 1900) % 60;
  return HeavenlyStems[(yearOffset + 6) % 10] + EarthlyBranches[(yearOffset + 8) % 12];
}

// 月干支（简化：以节气为界，此处按农历月）
function getMonthGanZhi(year, month) {
  const yearGan = getYearGanZhi(year)[0];
  const ganIndex = HeavenlyStems.indexOf(yearGan);
  const monthGan = HeavenlyStems[(ganIndex * 2 + month) % 10];
  const monthZhi = EarthlyBranches[(month + 1) % 12];
  return monthGan + monthZhi;
}

// 日干支（公式法）
function getDayGanZhi(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const y = year % 100;
  const m = month;
  const d = day;
  const c = a - 1;
  let w = (y + Math.floor(y/4) + Math.floor(c/4) - 2*c + Math.floor(26*(m+1)/10) + d - 1) % 7;
  if (w < 0) w += 7;

  // 日干支基数（简化）
  const base = (year + Math.floor((year-1)/4) - Math.floor((year-1)/100) + Math.floor((year-1)/400)) % 60;
  const dayOffset = Math.floor((new Date(year, month-1, day) - new Date(1900, 0, 1)) / (24*60*60*1000));
  const ganZhiIndex = (base + dayOffset) % 60;
  return HeavenlyStems[ganZhiIndex % 10] + EarthlyBranches[ganZhiIndex % 12];
}

// 时干支略（默认子时）
function getHourGanZhi(dayGan) {
  return dayGan + '子'; // 简化
}

function calculateBazi(year, month, day) {
  const yearGZ = getYearGanZhi(year);
  const monthGZ = getMonthGanZhi(year, month);
  const dayGZ = getDayGanZhi(year, month, day);
  const hourGZ = getHourGanZhi(dayGZ[0]);

  return {
    raw: `${yearGZ}年 ${monthGZ}月 ${dayGZ}日 ${hourGZ}时`,
    nianZhi: yearGZ,
    yueZhi: monthGZ,
    riZhi: dayGZ,
    shiZhi: hourGZ
  };
}
