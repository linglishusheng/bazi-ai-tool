// =============================================
// 手机号后四位磁场能量分析引擎
// 严格依据《z数字能量参数库.txt》文档内容实现
// 作者：网页设计程序员
// =============================================

// 七星磁场定义（完全按文档）
const MAGNETIC_FIELDS = {
  // 三吉星
  '天医': {
    pairs: ['13', '31', '68', '86', '49', '94', '27', '72'],
    nature: '吉',
    domain: '正财、婚姻、贵人、固定资产',
    personality: '善良、稳重、单纯、有爱心、付出型人格',
    risk: '容易被骗、感情受挫、财务被套',
    health: '脾胃、消化系统',
    career: '适合稳定行业，如教育、医疗、金融'
  },
  '生气': {
    pairs: ['14', '41', '67', '76', '39', '93', '28', '82'],
    nature: '次吉',
    domain: '人脉、贵人、合作、偏财',
    personality: '乐观、开朗、随和、人缘好、懒散',
    risk: '缺乏主见、易受骗、行动力不足',
    health: '神经系统、睡眠',
    career: '适合社交型工作，如销售、公关、自媒体'
  },
  '延年': {
    pairs: ['19', '91', '78', '87', '34', '43', '26', '62'],
    nature: '吉',
    domain: '地位、专业、技术、领导力',
    personality: '负责、固执、讲原则、压力大、完美主义',
    risk: '人际关系紧张、过度劳累、失眠',
    health: '心脏、血压、颈椎',
    career: '适合技术、管理、创业'
  },

  // 四凶星
  '绝命': {
    pairs: ['12', '21', '96', '69', '48', '84', '37', '73'],
    nature: '凶',
    domain: '破财、伤灾、官司、负债',
    personality: '冲动、讲义气、敢拼、情绪化',
    risk: '投资失败、意外伤害、法律纠纷',
    health: '头部、血液、外伤',
    career: '高风险行业需谨慎'
  },
  '五鬼': {
    pairs: ['18', '81', '79', '97', '36', '63', '24', '42'],
    nature: '凶',
    domain: '权力、思维、疾病、隐疾',
    personality: '精明、多疑、控制欲强、熬夜',
    risk: '精神内耗、慢性病、失眠、焦虑',
    health: '肝胆、眼睛、神经系统',
    career: '适合策划、研究，但需防过劳'
  },
  '祸害': {
    pairs: ['17', '71', '89', '98', '46', '64', '23', '32'],
    nature: '凶',
    domain: '口舌、是非、官非、血光',
    personality: '直率、善辩、爱争论、不服输',
    risk: '言语冲突、合同纠纷、交通事故',
    health: '口腔、牙齿、呼吸系统',
    career: '避免法律、客服等高冲突岗位'
  },
  '六煞': {
    pairs: ['16', '61', '47', '74', '29', '92', '38', '83'],
    nature: '次凶',
    domain: '桃花、偏财、变动、小人',
    personality: '犹豫、感性、多情、幻想',
    risk: '感情纠纷、财务损失、决策失误',
    health: '泌尿系统、内分泌',
    career: '适合创意、艺术，但需防情绪影响'
  }
};

// 单数字卦象与五行（完全按文档）
const SINGLE_DIGIT_INFO = {
  '1': { wuXing: '水', gua: '坎卦', meaning: '流动、隐匿、聪明、掌控欲强、情绪波动' },
  '2': { wuXing: '土', gua: '坤卦', meaning: '承载、包容、稳定、保守、依赖性强' },
  '3': { wuXing: '木', gua: '震卦', meaning: '雷动、快速、冲动、行动力强、脾气急' },
  '4': { wuXing: '木', gua: '巽卦', meaning: '风动、思维、犹豫、学习力强、优柔寡断' },
  '5': { wuXing: '土', gua: '中宫', meaning: '变化、不确定、太极点、影响力强' },
  '6': { wuXing: '金', gua: '乾卦', meaning: '刚健、领导、强势、果断、孤傲' },
  '7': { wuXing: '金', gua: '兑卦', meaning: '口才、才华、是非、官非、情绪外露' },
  '8': { wuXing: '土', gua: '艮卦', meaning: '山止、稳重、固执、固定资产、守财' },
  '9': { wuXing: '火', gua: '离卦', meaning: '发散、热情、好动、易亏钱、表现欲强' },
  '0': { wuXing: '无', gua: '阴太极', meaning: '变动、隐藏、减弱、虚无、过渡' }
};

// 获取磁场名称
function getFieldName(pair) {
  for (const [name, config] of Object.entries(MAGNETIC_FIELDS)) {
    if (config.pairs.includes(pair)) {
      return name;
    }
  }
  return null;
}

// 分析单数字
function analyzeSingleDigit(digit) {
  const info = SINGLE_DIGIT_INFO[digit];
  if (!info) return '';
  return `【${digit}】属${info.wuXing}（${info.gua}）：${info.meaning}\n`;
}

// 分析两数组合（完整字段输出）
function analyzePair(pair) {
  const fieldName = getFieldName(pair);
  if (!fieldName) {
    return `【${pair}】未识别磁场组合\n`;
  }

  const field = MAGNETIC_FIELDS[fieldName];
  let output = `【${pair}】为【${fieldName}】（${field.nature}）\n`;
  output += `领域：${field.domain}\n`;
  output += `性格：${field.personality}\n`;
  output += `风险：${field.risk}\n`;
  output += `健康：${field.health}\n`;
  output += `事业：${field.career}\n`;
  return output;
}

// 判断是否为凶星
function isXiongStar(name) {
  return ['绝命', '五鬼', '祸害'].includes(name);
}

// 判断是否为吉星
function isJiStar(name) {
  return ['天医', '生气', '延年'].includes(name);
}

// 主分析函数
function analyzePhoneSuffix(suffix) {
  // 输入校验
  if (!/^\d{4}$/.test(suffix)) {
    throw new Error('请输入4位数字');
  }

  let report = '';

  // 第一部分：单数字能量分析
  report += '### 一、单数字能量分析\n\n';
  const digits = suffix.split('');
  digits.forEach(d => {
    report += analyzeSingleDigit(d);
  });
  report += '\n';

  // 提取三组两数组合
  const pair1 = suffix.substring(0, 2); // 前两位
  const pair2 = suffix.substring(1, 3); // 中间两位
  const pair3 = suffix.substring(2, 4); // 后两位
  const pairs = [pair1, pair2, pair3];

  // 第二部分：两数组合磁场分析
  report += '### 二、两数组合磁场分析\n\n';
  report += `第1组【${pair1}】（前两位）：\n${analyzePair(pair1)}\n`;
  report += `第2组【${pair2}】（中间两位）：\n${analyzePair(pair2)}\n`;
  report += `第3组【${pair3}】（后两位）：\n${analyzePair(pair3)}\n`;

  // 第三部分：整体磁场格局判断
  const fieldNames = pairs.map(p => getFieldName(p)).filter(n => n);
  const hasJi = fieldNames.some(isJiStar);
  const hasXiong = fieldNames.some(isXiongStar);

  report += '### 三、整体磁场格局\n\n';

  if (fieldNames.length === 0) {
    report += '未识别有效磁场组合。\n';
  } else {
    report += `检测到磁场：${fieldNames.join('、')}\n\n`;

    // 凶星连片判断（文档重点）
    let xiongCount = 0;
    let consecutiveXiong = false;
    for (let i = 0; i < fieldNames.length; i++) {
      if (isXiongStar(fieldNames[i])) {
        xiongCount++;
        if (i > 0 && isXiongStar(fieldNames[i - 1])) {
          consecutiveXiong = true;
        }
      }
    }

    if (consecutiveXiong) {
      report += '⚠️ 【凶星连片】：存在连续凶星组合，易引发连锁不利事件，需高度警惕！\n';
    } else if (xiongCount >= 2) {
      report += '⚠️ 【多凶星】：存在两个及以上凶星，整体磁场偏凶，建议谨慎行事。\n';
    }

    // 吉凶混杂
    if (hasJi && hasXiong) {
      report += '【吉凶混杂】：吉星与凶星并存，吉凶相互抵消，需结合具体位置判断影响。\n';
    } else if (hasJi && !hasXiong) {
      report += '【整体偏吉】：磁场以吉星为主，利于事业发展与人际关系。\n';
    } else if (hasXiong && !hasJi) {
      report += '【整体偏凶】：磁场以凶星为主，需注意财务、健康与法律风险。\n';
    }
  }

  // 第四部分：尾星直断（文档核心逻辑）
  const lastField = getFieldName(pair3);
  if (lastField) {
    report += `\n### 四、尾星直断（事业与近期运势）\n\n`;
    report += `结尾磁场为【${lastField}】，代表近期运势走向：\n`;

    switch (lastField) {
      case '天医':
        report += '事业稳定，财运平稳，适合守成；感情关系和谐，但需防被利用。\n';
        break;
      case '生气':
        report += '人脉活跃，合作机会增多；但进展缓慢，需主动推进，避免拖延。\n';
        break;
      case '延年':
        report += '专业能力受认可，地位提升；但压力增大，注意劳逸结合，避免过劳。\n';
        break;
      case '绝命':
        report += '易有重大变动、投资或破财风险；切勿冲动决策，避免高风险行为。\n';
        break;
      case '五鬼':
        report += '思维活跃，创意涌现；但易失眠、焦虑，注意心理健康与作息规律。\n';
        break;
      case '祸害':
        report += '口舌是非增多，易起争执；谨言慎行，避免签署模糊合同或卷入纠纷。\n';
        break;
      case '六煞':
        report += '桃花旺盛或有偏财机会；但情绪波动大，需理性消费，防感情纠葛。\n';
        break;
    }
  }

  // 第五部分：使用建议（文档收尾逻辑）
  report += `\n### 五、综合建议\n\n`;
  if (hasXiong) {
    report += '当前号码存在不利磁场，建议：\n';
    report += '- 避免重大投资或借贷\n';
    report += '- 注意交通安全与合同细节\n';
    report += '- 定期体检，关注对应健康领域\n';
    report += '- 可考虑更换号码或通过风水调理化解\n';
  } else {
    report += '当前号码磁场较为吉祥，建议：\n';
    report += '- 把握合作与事业发展机会\n';
    report += '- 维护好人际关系\n';
    report += '- 保持当前良好状态\n';
  }

  return report;
}

// 绑定事件
document.getElementById('analyze-btn').addEventListener('click', () => {
  const input = document.getElementById('phone-input').value.trim();
  const outputDiv = document.getElementById('analysis-output');
  const resultSection = document.getElementById('result-section');

  try {
    const report = analyzePhoneSuffix(input);
    // 转换为 HTML（保留段落与标题）
    outputDiv.innerHTML = report
      .replace(/\n/g, '<br>')
      .replace(/### (.*?)(<br>|$)/g, '<h3>$1</h3>');
    resultSection.classList.remove('hidden');
  } catch (error) {
    alert('输入错误：' + error.message);
  }
});

// 支持回车提交
document.getElementById('phone-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('analyze-btn').click();
  }
});
