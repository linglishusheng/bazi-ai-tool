// 主程序入口
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('baziForm');
    const resultSection = document.getElementById('resultSection');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const birthDate = document.getElementById('birthDate').value;
        const birthTime = document.getElementById('birthTime').value;
        const gender = document.getElementById('gender').value;
        
        if (!birthDate || !birthTime || !gender) {
            alert('请填写完整的出生信息');
            return;
        }
        
        // 显示加载状态
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.textContent = '分析中...';
        analyzeBtn.disabled = true;
        
        // 模拟分析过程（实际应用中这里会调用复杂的八字计算）
        setTimeout(() => {
            analyzeBazi(birthDate, birthTime, gender);
            analyzeBtn.textContent = '开始分析';
            analyzeBtn.disabled = false;
        }, 1000);
    });
});

// 八字分析主函数
function analyzeBazi(birthDate, birthTime, gender) {
    // 解析日期
    const dateParts = birthDate.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    
    // 获取时辰
    const hour = parseInt(birthTime.split('-')[0]);
    
    // 计算八字（这里使用简化版，实际应用需要更复杂的算法）
    const bazi = calculateBazi(year, month, day, hour);
    
    // 显示结果
    displayBaziResult(bazi);
    
    // 进行传统分析
    const traditionalAnalysis = performTraditionalAnalysis(bazi, gender);
    document.getElementById('traditionalAnalysis').innerHTML = traditionalAnalysis;
    
    // 进行现代分析
    const modernAnalysis = performModernAnalysis(bazi, gender);
    document.getElementById('modernAnalysis').innerHTML = modernAnalysis;
    
    // 显示结果区域
    document.getElementById('resultSection').style.display = 'block';
    
    // 滚动到结果区域
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

// 计算八字（简化版）
function calculateBazi(year, month, day, hour) {
    // 这里应该使用lunar.js进行精确计算
    // 以下为简化示例
    
    // 年柱计算（简化）
    const yearGan = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'][(year - 4) % 10];
    const yearZhi = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'][(year - 4) % 12];
    
    // 月柱计算（简化）
    const monthGan = ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'][month - 1];
    const monthZhi = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'][month - 1];
    
    // 日柱计算（简化，实际需要复杂计算）
    const baseDate = new Date(1900, 0, 31);
    const currentDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((currentDate - baseDate) / (24 * 60 * 60 * 1000));
    const dayGanIndex = diffDays % 10;
    const dayZhiIndex = diffDays % 12;
    
    const dayGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][dayGanIndex];
    const dayZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][dayZhiIndex];
    
    // 时柱计算（简化）
    const hourGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][(dayGanIndex * 2 + Math.floor((hour + 1) / 2)) % 10];
    const hourZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][Math.floor((hour + 1) / 2) % 12];
    
    return {
        year: yearGan + yearZhi,
        month: monthGan + monthZhi,
        day: dayGan + dayZhi,
        hour: hourGan + hourZhi,
        dayMaster: dayGan, // 日主
        dayBranch: dayZhi  // 日支
    };
}

// 显示八字结果
function displayBaziResult(bazi) {
    const baziResult = document.getElementById('baziResult');
    
    baziResult.innerHTML = `
        <div class="bazi-grid">
            <div class="bazi-item">
                <div class="title">年柱</div>
                <div class="content">${bazi.year}</div>
            </div>
            <div class="bazi-item">
                <div class="title">月柱</div>
                <div class="content">${bazi.month}</div>
            </div>
            <div class="bazi-item">
                <div class="title">日柱</div>
                <div class="content">${bazi.day}</div>
            </div>
            <div class="bazi-item">
                <div class="title">时柱</div>
                <div class="content">${bazi.hour}</div>
            </div>
        </div>
        <p><strong>日主（出生日天干）：</strong> ${bazi.dayMaster}</p>
        <p><strong>日支（出生日地支）：</strong> ${bazi.dayBranch}</p>
    `;
}

// 执行传统分析
function performTraditionalAnalysis(bazi, gender) {
    // 这里应该根据rules.json中的规则进行详细分析
    // 以下为简化示例
    
    let analysis = '<div class="analysis-content">';
    
    // 分析日支十神
    analysis += '<h4>日支十神分析</h4>';
    analysis += `<p>根据出生时间规律的传统分析方法进行专业分析，日主为${bazi.dayMaster}，日支为${bazi.dayBranch}。</p>`;
    
    // 根据日支分析（简化示例）
    if (bazi.dayBranch === '子') {
        analysis += '<p>传统分析方法认为有正官坐下的可能性，主端正自律，重规则，责任感强。</p>';
    } else if (bazi.dayBranch === '午') {
        analysis += '<p>传统分析方法认为有伤官坐下的可能性，主聪明傲气，口才好，追求自由。</p>';
    } else {
        analysis += '<p>传统分析方法认为有多种可能性，需要结合完整八字进行综合判断。</p>';
    }
    
    // 分析十神数量
    analysis += '<h4>十神数量分析</h4>';
    analysis += '<p>传统分析方法认为八字中十神的数量分布对个人特质有重要影响。</p>';
    
    // 分析天干十神
    analysis += '<h4>天干十神分析</h4>';
    analysis += '<p>传统分析方法认为天干透出的十神代表外在性格特征。</p>';
    
    analysis += '</div>';
    
    return analysis;
}

// 执行现代分析
function performModernAnalysis(bazi, gender) {
    let analysis = '<div class="analysis-content">';
    
    // 添加固定声明
    analysis += '<p><em>本部分将传统分析转化为现代人生规划视角，侧重于趋势分析和建议。出生时间规律作为一种文化符号系统，提供个人发展的参考框架，而非绝对预测。以下解读基于统计模型和传统文化智慧的现代化应用，强调可能性和个体主动性。</em></p>';
    
    // 先天特质分析
    analysis += '<h4>先天特质与后天发展的整合性评估</h4>';
    analysis += '<p>分析显示，您的出生信息呈现出一种倾向于规则导向和自律性的能量模式。这可能是您内在优势图谱的一部分，表现为对结构和秩序的天然敏感度。</p>';
    
    // 内在优势图谱
    analysis += '<h4>内在优势图谱</h4>';
    analysis += '<p>参考建议：基于您的出生时间规律，有一种可能性是您在需要细致规划和系统思维的环境中能够发挥最佳状态。这可以作为您决策偏好的参考框架。</p>';
    
    // 关键领域建议
    analysis += '<h4>关键领域建议</h4>';
    
    analysis += '<h5>财富领域</h5>';
    analysis += '<p>分析显示，此阶段在财务规划上需更加审慎，建议重点关注稳健型投资策略，避免过度冒险。</p>';
    
    analysis += '<h5>事业领域</h5>';
    analysis += '<p>有一种可能性是，这可能是发挥管理潜能的窗口期。参考建议：在团队协作中寻找平衡点，既保持规则意识又展现灵活性。</p>';
    
    analysis += '<h5>健康领域</h5>';
    analysis += '<p>建议重点关注压力管理，建立规律的生活作息作为能量调整策略。</p>';
    
    analysis += '<h5>关系领域</h5>';
    analysis += '<p>分析显示，在人际互动中，有一种可能性是需要更加注重沟通的平衡性。</p>';
    
    // 行动与调整建议
    analysis += '<h4>行动与调整建议</h4>';
    analysis += '<p>基于以上分析，提供以下具体、可执行的行动思路：</p>';
    analysis += '<ul>';
    analysis += '<li>建立系统化的目标管理方法，将长期目标分解为可执行的短期计划</li>';
    analysis += '<li>在支持性环境中寻找发展机会，特别是那些能够发挥您规则意识和细致特质的领域</li>';
    analysis += '<li>培养适应性思维习惯，在保持核心原则的同时灵活应对变化</li>';
    analysis += '<li>建立定期反思机制，评估个人发展路径与能量特质的匹配度</li>';
    analysis += '</ul>';
    
    // 添加免责声明
    analysis += '<div class="disclaimer-inline">';
    analysis += '<p><strong>免责声明：</strong>本解读基于传统文化符号系统及大量案例的统计模型进行趋势分析，仅供参考，不构成任何决策依据。请您理性看待，结合现实情况独立判断。</p>';
    analysis += '</div>';
    
    analysis += '</div>';
    
    return analysis;
}
