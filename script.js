document.getElementById('analyze-btn').addEventListener('click', async () => {
  const dateInput = document.getElementById('birth-date').value;
  if (!dateInput) {
    alert('请选择出生日期');
    return;
  }

  const [year, month, day] = dateInput.split('-').map(Number);
  const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  try {
    // 调用外部API获取四柱（模拟，实际需代理或CORS支持）
    const apiUrl = `https://mobile.51wnl-cq.com/huangli_tab_h5/?posId=BDSS&STIME=${formattedDate}`;
    // 注意：由于浏览器同源策略，直接 fetch 此 URL 会失败！
    // 实际部署时需通过代理或使用 JSONP（但该站不支持）
    // 因此我们改用 lunar.js 本地排盘（更可靠）

    const bazi = calculateBazi(year, month, day);
    document.getElementById('bazi-display').innerText = bazi.raw;

    const analysis = await generateAnalysis(bazi);
    document.getElementById('analysis-result').innerHTML = analysis.replace(/\n/g, '<br>');
    document.getElementById('result-section').classList.remove('hidden');
  } catch (error) {
    console.error(error);
    alert('分析失败，请检查日期或稍后再试');
  }
});

// 模拟AI分析（基于rules.json）
async function generateAnalysis(bazi) {
  const rules = await fetch('rules.json').then(r => r.json());
  let output = '';

  // 第一部分：传统分析方法
  output += "第一部分：出生时间规律的传统分析方法\n\n";
  output += "严格根据出生时间规律的传统分析方法进行专业分析\n";

  // 判断日支十神（简化示例）
  const riZhi = bazi.riZhi; // 如 '丙申'
  const riGan = riZhi[0];
  const zhi = riZhi.slice(1);
  const shiShen = getShiShen(riGan, zhi); // 需实现

  output += `日柱为 ${riZhi}，日支藏干主气为 ${zhi}，对应十神为【${shiShen}】。\n`;
  output += `传统分析方法认为有……可能性。\n\n`;

  // 第二部分：现代人生规划解读
  output += "第二部分：现代人生规划解读\n\n";
  output += "本部分将传统分析转化为现代人生规划视角，侧重于趋势分析和建议。出生时间规律作为一种文化符号系统，提供个人发展的参考框架，而非绝对预测。以下解读基于统计模型和传统文化智慧的现代化应用，强调可能性和个体主动性。\n\n";

  // 根据rules.json匹配逻辑
  if (rules[shiShen]) {
    const rule = rules[shiShen];
    output += `分析显示，您日支坐【${shiShen}】，这可能意味着：\n`;
    output += `- 内在优势图谱：${rule.advantage}\n`;
    output += `- 关键领域建议：${rule.advice}\n`;
    output += `- 行动与调整建议：${rule.action}\n`;
  } else {
    output += "当前日支十神类型暂未收录详细解读。\n";
  }

  output += "\n本解读基于传统文化符号系统及大量案例的统计模型进行趋势分析，仅供参考，不构成任何决策依据。请您理性看待，结合现实情况独立判断。";

  return output;
}

// 简化：根据日干和地支返回十神（仅示例，实际需完整五行生克）
function getShiShen(riGan, diZhi) {
  // 示例映射（实际应基于完整排盘）
  const map = {
    '甲申': '七杀',
    '乙酉': '七杀',
    '丙子': '正官',
    '丁亥': '正官',
    '戊寅': '七杀',
    '己卯': '七杀',
    '庚午': '七杀',
    '辛巳': '七杀',
    '壬辰': '七杀',
    '癸丑': '七杀',
    '甲寅': '比肩',
    '乙卯': '比肩',
    '丙午': '劫财',
    '丁巳': '劫财',
    '戊辰': '比肩',
    '己未': '比肩',
    '庚申': '比肩',
    '辛酉': '比肩',
    '壬子': '劫财',
    '癸亥': '劫财',
    '甲子': '正印',
    '乙亥': '正印',
    '丙寅': '偏印',
    '丁卯': '偏印',
    '戊午': '正印',
    '己巳': '正印',
    '庚辰': '偏印',
    '辛未': '偏印',
    '壬申': '偏印',
    '癸酉': '偏印',
    '甲午': '伤官',
    '乙巳': '伤官',
    '丙申': '偏财',
    '丁酉': '偏财',
    '戊子': '正财',
    '己亥': '正财',
    '庚寅': '偏财',
    '辛卯': '偏财',
    '壬午': '正财',
    '癸巳': '正财'
  };
  return map[riGan + diZhi] || '未知';
}
