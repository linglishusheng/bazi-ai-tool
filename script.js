// 数字能量分析规则库（根据 z数字能量参数库.txt 提取）
const MAGNETIC_FIELDS = {
  // 三吉星
  '天医': { pairs: ['13','31','49','94','27','72','86','68'], type: '吉', aspect: '正财，婚姻' },
  '生气': { pairs: ['14','41','67','76','28','82','39','93'], type: '次吉', aspect: '人脉，心态' },
  '延年': { pairs: ['19','91','78','87','26','62','34','43'], type: '吉', aspect: '地位，专业' },
  
  // 四凶星
  '绝命': { pairs: ['12','21','37','73','96','69','48','84'], type: '凶', aspect: '创造，破财' },
  '五鬼': { pairs: ['18','81','36','63','79','97','24','42'], type: '凶', aspect: '权力，思维' },
  '祸害': { pairs: ['17','71','23','32','46','64','89','98'], type: '凶', aspect: '口才，意外' },
  '六煞': { pairs: ['16','61','47','74','29','92','38','83'], type: '次凶', aspect: '桃花，偏财' }
};

// 单数字五行与卦象
const SINGLE_DIGIT = {
  '1': { wuXing: '水', gua: '坎', meaning: '流动、隐匿、强势、掌控欲强' },
  '2': { wuXing: '土', gua: '坤', meaning: '承载、包容、稳定、保守' },
  '3': { wuXing: '木', gua: '震', meaning: '雷动、快速、冲动、行动力强' },
  '4': { wuXing: '木', gua: '巽', meaning: '风动、思维、犹豫、学习力强' },
  '5': { wuXing: '土', gua: '中', meaning: '变化、不确定、太极点' },
  '6': { wuXing: '金', gua: '乾', meaning: '刚健、领导、强势、果断' },
  '7': { wuXing: '金', gua: '兑', meaning: '口才、才华、是非、官非' },
  '8': { wuXing: '土', gua: '艮', meaning: '山止、稳重、固执、固定资产' },
  '9': { wuXing: '火', gua: '离', meaning: '发散、热情、好动、易亏钱' },
  '0': { wuXing: '无', gua: '阴太极', meaning: '变动、隐藏、减弱' }
};

// 获取两位数对应的磁场
function getMagneticField(pair) {
  for (const [name, config] of Object.entries(MAGNETIC_FIELDS)) {
    if (config.pairs.includes(pair)) {
      return { name, ...config };
    }
  }
  return null;
}

// 分析单个数字
function analyzeSingleDigit(digit) {
  const info = SINGLE_DIGIT[digit];
  if (!info) return '';
  return `【${digit}】属${info.wuXing}（${info.gua}卦）：${info.meaning}\n`;
}

// 分析两位数组合
function analyzePair(pair) {
  const field = getMagneticField(pair);
  if (!field) return `【${pair}】未识别磁场\n`;
  
  let desc = `【${pair}】为【${field.name}】(${field.type})：${field.aspect}\n`;
  
  // 添加具体解读（简化版，基于文档关键词）
  switch(field.name) {
    case '天医':
      desc += '代表正财、婚姻、贵人、固定资产。性格善良、稳重，但可能单纯易被骗。\n';
      break;
    case '生气':
      desc += '代表人脉、贵人、合作。性格乐观开朗，但可能懒散、易受骗。\n';
      break;
    case '延年':
      desc += '代表地位、专业、技术。性格负责、固执，但压力大、睡眠差。\n';
      break;
    case '绝命':
      desc += '代表创业、破财、伤灾。性格冲动、讲义气，但易上当、负债。\n';
      break;
    case '五鬼':
      desc += '代表权力、思维、疾病。性格精明、多疑，但易熬夜、有隐疾。\n';
      break;
    case '祸害':
      desc += '代表口才、意外、是非。性格直率、善辩，但易招官非、血光。\n';
      break;
    case '六煞':
      desc += '代表桃花、偏财、变动。性格犹豫、感性，但易犯桃花、破财。\n';
      break;
  }
  return desc;
}

// 主分析函数
function analyzePhoneSuffix(suffix) {
  if (!/^\d{4}$/.test(suffix)) {
    throw new Error('请输入4位数字');
  }

  let result = '';
  const digits = suffix.split('');
  const pairs = [suffix.substring(0,2), suffix.substring(1,3), suffix.substring(2,4)];

  // 第一部分：单数字分析
  result += '### 一、单数字能量分析\n\n';
  digits.forEach(d => {
    result += analyzeSingleDigit(d);
  });
  result += '\n';

  // 第二部分：两数组合磁场分析
  result += '### 二、两数组合磁场分析\n\n';
  pairs.forEach((pair, i) => {
    result += `第${i+1}组【${pair}】：\n`;
    result += analyzePair(pair) + '\n';
  });

  // 第三部分：整体磁场判断
  const fields = pairs.map(p => getMagneticField(p)?.name).filter(n => n);
  const hasJi = fields.some(f => ['天医','生气','延年'].includes(f));
  const hasXiong = fields.some(f => ['绝命','五鬼','祸害','六煞'].includes(f));
  
  result += '### 三、整体磁场格局\n\n';
  if (fields.length === 0) {
    result += '未识别有效磁场组合。\n';
  } else {
    result += `检测到磁场：${fields.join('、')}\n\n`;
    
    if (hasXiong && fields.filter(f => ['绝命','五鬼','祸害'].includes(f)).length >= 2) {
      result += '⚠️ **凶星连片警告**：多个凶星相连，易引发不利事件，请谨慎对待。\n';
    }
    
    if (hasJi && hasXiong) {
      result += '吉凶混杂：需结合具体位置判断吉凶影响。\n';
    } else if (hasJi) {
      result += '整体偏吉：利于财运、人脉或事业发展。\n';
    } else if (hasXiong) {
      result += '整体偏凶：需注意破财、是非或健康问题。\n';
    }
  }

  // 第四部分：尾星直断（最后两位）
  const lastPair = pairs[2];
  const lastField = getMagneticField(lastPair);
  if (lastField) {
    result += `\n### 四、尾星直断（事业/近期运势）\n\n`;
    result += `结尾【${lastPair}】为【${lastField.name}】，`;
    
    switch(lastField.name) {
      case '天医':
        result += '近期事业平稳，财运稳定，适合守成。\n';
        break;
      case '生气':
        result += '近期合作机会多，但进展缓慢，需主动推进。\n';
        break;
      case '延年':
        result += '近期工作压力大，但专业能力受认可，不宜变动。\n';
        break;
      case '绝命':
        result += '近期易有变动、投资或破财风险，需谨慎决策。\n';
        break;
      case '五鬼':
        result += '近期思维活跃，易有新想法，但需防隐疾或失眠。\n';
        break;
      case '祸害':
        result += '近期口舌是非多，需谨言慎行，避免冲突。\n';
        break;
      case '六煞':
        result += '近期桃花旺或有偏财，但花销大，需控制支出。\n';
        break;
    }
  }

  return result;
}

// 绑定事件
document.getElementById('analyze-btn').addEventListener('click', () => {
  const input = document.getElementById('phone-suffix').value.trim();
  const resultDiv = document.getElementById('analysis-result');
  const resultSection = document.getElementById('result-section');

  try {
    const analysis = analyzePhoneSuffix(input);
    resultDiv.innerHTML = analysis.replace(/\n/g, '<br>').replace(/### /g, '<h3>').replace(/<\/h3><br>/g, '</h3>');
    resultSection.classList.remove('hidden');
  } catch (error) {
    alert(error.message);
  }
});

// 支持回车键
document.getElementById('phone-suffix').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('analyze-btn').click();
  }
});
