/**
 * 八字AI分析工具 - 主逻辑脚本
 * 纯前端实现，零成本部署
 */

// 全局变量
let currentBazi = null;
let analysisHistory = [];
let rulesData = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('八字AI分析工具正在初始化...');
    
    // 初始化页面
    initPage();
    
    // 加载规则库
    loadRules();
    
    // 加载历史记录
    loadHistory();
    
    // 初始化事件监听
    initEventListeners();
    
    // 设置默认日期（25年前）
    setDefaultDate();
    
    console.log('工具初始化完成！');
});

/**
 * 页面初始化
 */
function initPage() {
    console.log('初始化页面...');
    
    // 检查必要的DOM元素
    const requiredElements = [
        'birthdate', 'birthtime', 'calculateBtn',
        'resultSection', 'analyzeBtn', 'question'
    ];
    
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`未找到元素: #${id}`);
        }
    });
    
    // 初始化五行图表
    initWuxingChart();
}

/**
 * 加载规则库
 */
async function loadRules() {
    try {
        // 尝试从rules.json加载
        const response = await fetch('rules.json');
        if (response.ok) {
            rulesData = await response.json();
            console.log('规则库加载成功:', rulesData);
        } else {
            // 如果加载失败，使用默认规则
            rulesData = getDefaultRules();
            console.log('使用默认规则库');
        }
    } catch (error) {
        console.error('加载规则库失败:', error);
        rulesData = getDefaultRules();
    }
}

/**
 * 获取默认规则库
 */
function getDefaultRules() {
    return {
        elements: {
            "木": "代表生长、发展，主仁，方向为东，季节为春",
            "火": "代表炎热、向上，主礼，方向为南，季节为夏", 
            "土": "代表承载、化育，主信，方向为中，季节为长夏",
            "金": "代表清洁、收敛，主义，方向为西，季节为秋",
            "水": "代表寒凉、滋润，主智，方向为北，季节为冬"
        },
        analysisTemplates: {
            career: [
                "根据您的八字分析，事业方面有较大发展潜力。",
                "您适合需要{skill}的行业，建议向{direction}方向发展。",
                "近期可能有不错的工作机会，注意把握。"
            ],
            wealth: [
                "财运方面，您有稳定的收入基础。",
                "投资理财建议采取{approach}策略。",
                "注意合理规划开支，避免冲动消费。"
            ],
            relationship: [
                "感情方面，您需要更多的时间和耐心。",
                "建议多参加社交活动，扩大交际圈。",
                "真诚沟通是维系关系的关键。"
            ],
            health: [
                "健康方面，需要注意{organ}的保养。",
                "建议保持规律的作息和饮食。",
                "适当运动有助于提升整体健康水平。"
            ]
        },
        quickResponses: {
            "木": "木主仁，您性格仁慈，有领导力，适合管理岗位。",
            "火": "火主礼，您热情开朗，善于交际，适合销售行业。",
            "土": "土主信，您诚实稳重，值得信赖，适合金融行业。",
            "金": "金主义，您正直果断，原则性强，适合法律行业。",
            "水": "水主智，您聪明灵活，适应力强，适合技术行业。"
        }
    };
}

/**
 * 加载历史记录
 */
function loadHistory() {
    try {
        const savedHistory = localStorage.getItem('baziAnalysisHistory');
        if (savedHistory) {
            analysisHistory = JSON.parse(savedHistory);
            updateHistoryDisplay();
        }
    } catch (error) {
        console.error('加载历史记录失败:', error);
        analysisHistory = [];
    }
}

/**
 * 更新历史记录显示
 */
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (analysisHistory.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                <i class="fas fa-history"></i>
                <p>暂无分析记录</p>
            </div>
        `;
        return;
    }
    
    // 只显示最近5条记录
    const recentHistory = analysisHistory.slice(0, 5);
    
    historyList.innerHTML = recentHistory.map((item, index) => `
        <div class="history-item" onclick="loadHistoryItem(${index})">
            <div class="history-question">${item.question}</div>
            <div class="history-date">${formatDate(item.timestamp)}</div>
        </div>
    `).join('');
}

/**
 * 格式化日期
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * 加载历史记录项
 */
function loadHistoryItem(index) {
    if (analysisHistory[index]) {
        const item = analysisHistory[index];
        document.getElementById('question').value = item.question;
        
        // 如果有八字信息，可以重新计算
        if (item.baziData) {
            // 这里可以重新显示之前的八字结果
        }
        
        showMessage('已加载历史记录', 'success');
    }
}

/**
 * 保存历史记录
 */
function saveToHistory(baziData, question, answer) {
    const historyItem = {
        timestamp: Date.now(),
        baziData: baziData,
        question: question,
        answer: answer.substring(0, 100) + '...' // 只保存前100个字符
    };
    
    analysisHistory.unshift(historyItem);
    
    // 只保留最近20条记录
    if (analysisHistory.length > 20) {
        analysisHistory = analysisHistory.slice(0, 20);
    }
    
    // 保存到本地存储
    try {
        localStorage.setItem('baziAnalysisHistory', JSON.stringify(analysisHistory));
    } catch (error) {
        console.error('保存历史记录失败:', error);
    }
    
    updateHistoryDisplay();
}

/**
 * 初始化五行图表
 */
function initWuxingChart() {
    // 图表已在HTML中定义，这里可以添加动画效果
    const bars = ['woodBar', 'fireBar', 'earthBar', 'metalBar', 'waterBar'];
    bars.forEach(barId => {
        const bar = document.getElementById(barId);
        if (bar) {
            bar.style.width = '0%';
        }
    });
}

/**
 * 更新五行图表
 */
function updateWuxingChart(wuxingData) {
    if (!wuxingData) return;
    
    const elements = ['木', '火', '土', '金', '水'];
    const barIds = ['woodBar', 'fireBar', 'earthBar', 'metalBar', 'waterBar'];
    const valueIds = ['woodValue', 'fireValue', 'earthValue', 'metalValue', 'waterValue'];
    
    // 计算百分比
    const total = Object.values(wuxingData).reduce((sum, val) => sum + val, 0);
    
    elements.forEach((element, index) => {
        const value = wuxingData[element] || 0;
        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
        
        const bar = document.getElementById(barIds[index]);
        const valueSpan = document.getElementById(valueIds[index]);
        
        if (bar && valueSpan) {
            // 使用setTimeout创建动画效果
            setTimeout(() => {
                bar.style.width = `${percentage}%`;
                valueSpan.textContent = `${percentage}%`;
            }, index * 200);
        }
    });
}

/**
 * 初始化事件监听
 */
function initEventListeners() {
    console.log('初始化事件监听...');
    
    // 计算八字按钮
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateBazi);
    }
    
    // AI分析按钮
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeWithAI);
    }
    
    // 复制答案按钮
    const copyAnswerBtn = document.getElementById('copyAnswer');
    if (copyAnswerBtn) {
        copyAnswerBtn.addEventListener('click', copyAnswerToClipboard);
    }
    
    // 快速提问按钮
    const quickBtns = document.querySelectorAll('.btn-quick');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            document.getElementById('question').value = question;
        });
    });
    
    // 输入框回车事件
    const questionInput = document.getElementById('question');
    if (questionInput) {
        questionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                analyzeWithAI();
            }
        });
    }
    
    // 日期变化时自动计算
    const birthdateInput = document.getElementById('birthdate');
    if (birthdateInput) {
        birthdateInput.addEventListener('change', function() {
            // 可以添加实时预览功能
        });
    }
}

/**
 * 设置默认日期
 */
function setDefaultDate() {
    const today = new Date();
    const defaultDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const dateInput = document.getElementById('birthdate');
    
    if (dateInput) {
        dateInput.value = defaultDate.toISOString().split('T')[0];
    }
}

/**
 * 计算八字
 */
function calculateBazi() {
    console.log('开始计算八字...');
    
    // 获取输入值
    const birthdate = document.getElementById('birthdate').value;
    const birthtime = document.getElementById('birthtime').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    if (!birthdate) {
        showMessage('请输入出生日期', 'error');
        return;
    }
    
    // 显示加载状态
    showGlobalLoading(true);
    
    try {
        // 解析日期
        const [year, month, day] = birthdate.split('-').map(Number);
        const hour = parseInt(birthtime);
        
        console.log(`计算参数: ${year}年${month}月${day}日 ${hour}时 ${gender}`);
        
        // 使用lunar-javascript库计算八字
        const solar = Solar.fromYmd(year, month, day);
        const lunar = solar.getLunar();
        
        // 计算四柱
        const bazi = {
            year: lunar.getYearInGanZhi(),      // 年柱
            month: lunar.getMonthInGanZhi(),    // 月柱
            day: lunar.getDayInGanZhi(),        // 日柱
            hour: lunar.getTimeInGanZhi(hour)   // 时柱
        };
        
        // 获取生肖
        const shengxiao = lunar.getYearShengXiao();
        
        // 获取五行
        const wuxing = {
            year: lunar.getYearWuXing(),
            month: lunar.getMonthWuXing(),
            day: lunar.getDayWuXing(),
            hour: lunar.getTimeWuXing(hour)
        };
        
        // 日主（日干）
        const rizhu = bazi.day.charAt(0);
        
        // 命主
        const mingzhuMap = {
            "甲": "甲木", "乙": "乙木", "丙": "丙火", "丁": "丁火",
            "戊": "戊土", "己": "己土", "庚": "庚金", "辛": "辛金",
            "壬": "壬水", "癸": "癸水"
        };
        const mingzhu = mingzhuMap[rizhu] || "未知";
        
        // 计算五行能量
        const wuxingEnergy = calculateWuxingEnergy(wuxing);
        
        // 保存当前八字信息
        currentBazi = {
            ...bazi,
            shengxiao: shengxiao,
            wuxing: wuxing,
            mingzhu: mingzhu,
            rizhu: rizhu,
            gender: gender,
            wuxingEnergy: wuxingEnergy
        };
        
        // 更新显示
        updateBaziDisplay(currentBazi);
        
        // 更新五行图表
        updateWuxingChart(wuxingEnergy);
        
        // 显示结果区域
        document.getElementById('resultSection').style.display = 'block';
        
        // 滚动到结果区域
        document.getElementById('resultSection').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        showMessage('八字计算完成！', 'success');
        
    } catch (error) {
        console.error('八字计算错误:', error);
        showMessage('八字计算失败，请检查输入格式', 'error');
    } finally {
        showGlobalLoading(false);
    }
}

/**
 * 计算五行能量
 */
function calculateWuxingEnergy(wuxing) {
    const energy = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    
    // 统计每个五行的出现次数
    Object.values(wuxing).forEach(element => {
        if (element.includes('木')) energy['木'] += 2;
        if (element.includes('火')) energy['火'] += 2;
        if (element.includes('土')) energy['土'] += 2;
        if (element.includes('金')) energy['金'] += 2;
        if (element.includes('水')) energy['水'] += 2;
        
        // 考虑生克关系
        if (element.includes('木')) {
            energy['火'] += 0.5; // 木生火
            energy['土'] -= 0.5; // 木克土
        }
        if (element.includes('火')) {
            energy['土'] += 0.5; // 火生土
            energy['金'] -= 0.5; // 火克金
        }
        if (element.includes('土')) {
            energy['金'] += 0.5; // 土生金
            energy['水'] -= 0.5; // 土克水
        }
        if (element.includes('金')) {
            energy['水'] += 0.5; // 金生水
            energy['木'] -= 0.5; // 金克木
        }
        if (element.includes('水')) {
            energy['木'] += 0.5; // 水生木
            energy['火'] -= 0.5; // 水克火
        }
    });
    
    // 确保最小值为0
    Object.keys(energy).forEach(key => {
        energy[key] = Math.max(0, energy[key]);
    });
    
    return energy;
}

/**
 * 更新八字显示
 */
function updateBaziDisplay(bazi) {
    // 更新四柱
    document.getElementById('yearZhu').textContent = bazi.year;
    document.getElementById('monthZhu').textContent = bazi.month;
    document.getElementById('dayZhu').textContent = bazi.day;
    document.getElementById('hourZhu').textContent = bazi.hour;
    
    // 更新五行元素
    document.getElementById('yearElement').textContent = bazi.wuxing.year;
    document.getElementById('monthElement').textContent = bazi.wuxing.month;
    document.getElementById('dayElement').textContent = bazi.wuxing.day;
    document.getElementById('hourElement').textContent = bazi.wuxing.hour;
    
    // 更新详细信息
    document.getElementById('fullBazi').textContent = `${bazi.year} ${bazi.month} ${bazi.day} ${bazi.hour}`;
    document.getElementById('shengxiao').textContent = bazi.shengxiao;
    document.getElementById('mingzhu').textContent = bazi.mingzhu;
    document.getElementById('rizhu').textContent = bazi.rizhu;
    
    // 计算五行统计
    const wuxingCount = {};
    Object.values(bazi.wuxing).forEach(element => {
        if (element.includes('木')) wuxingCount['木'] = (wuxingCount['木'] || 0) + 1;
        if (element.includes('火')) wuxingCount['火'] = (wuxingCount['火'] || 0) + 1;
        if (element.includes('土')) wuxingCount['土'] = (wuxingCount['土'] || 0) + 1;
        if (element.includes('金')) wuxingCount['金'] = (wuxingCount['金'] || 0) + 1;
        if (element.includes('水')) wuxingCount['水'] = (wuxingCount['水'] || 0) + 1;
    });
    
    const wuxingText = Object.entries(wuxingCount)
        .map(([element, count]) => `${element}×${count}`)
        .join(' ');
    
    document.getElementById('wuxing').textContent = wuxingText || '平衡';
}

/**
 * AI分析
 */
async function analyzeWithAI() {
    console.log('开始AI分析...');
    
    // 检查是否有八字数据
    if (!currentBazi) {
        showMessage('请先计算八字', 'error');
        document.getElementById('calculateBtn').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // 获取问题
    const question = document.getElementById('question').value.trim();
    if (!question) {
        showMessage('请输入您的问题', 'error');
        document.getElementById('question').focus();
        return;
    }
    
    // 显示分析容器
    const answerContainer = document.getElementById('answerContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const aiAnswer = document.getElementById('aiAnswer');
    
    answerContainer.style.display = 'block';
    loadingIndicator.style.display = 'flex';
    aiAnswer.style.display = 'none';
    
    // 更新分析时间
    document.getElementById('answerTime').textContent = new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // 滚动到分析结果
    answerContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    try {
        // 模拟AI分析延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 生成AI分析结果
        const analysis = generateAIAnalysis(currentBazi, question);
        
        // 显示结果
        loadingIndicator.style.display = 'none';
        aiAnswer.style.display = 'block';
        aiAnswer.innerHTML = formatAnalysisText(analysis);
        
        // 保存到历史记录
        saveToHistory(currentBazi, question, analysis);
        
        showMessage('AI分析完成！', 'success');
        
    } catch (error) {
        console.error('AI分析失败:', error);
        loadingIndicator.style.display = 'none';
        aiAnswer.innerHTML = '<p style="color: #f44336;">分析失败，请稍后重试。</p>';
        aiAnswer.style.display = 'block';
        showMessage('分析失败，请稍后重试', 'error');
    }
}

/**
 * 生成AI分析结果
 */
function generateAIAnalysis(bazi, question) {
    console.log('生成AI分析结果...');
    
    // 提取问题关键词
    const keywords = extractKeywords(question);
    const primaryKeyword = keywords[0] || 'general';
    
    // 基于八字和问题生成分析
    let analysis = '';
    
    // 添加八字信息
    analysis += `📅 **八字信息**\n`;
    analysis += `您的八字为：**${bazi.year} ${bazi.month} ${bazi.day} ${bazi.hour}**\n`;
    analysis += `命主：${bazi.mingzhu} | 生肖：${bazi.shengxiao}\n\n`;
    
    // 根据问题类型生成不同分析
    switch(primaryKeyword) {
        case '事业':
        case '工作':
        case '职业':
            analysis += generateCareerAnalysis(bazi, question);
            break;
            
        case '财运':
        case '财富':
        case '金钱':
            analysis += generateWealthAnalysis(bazi, question);
            break;
            
        case '感情':
        case '婚姻':
        case '爱情':
            analysis += generateRelationshipAnalysis(bazi, question);
            break;
            
        case '健康':
        case '身体':
        case '疾病':
            analysis += generateHealthAnalysis(bazi, question);
            break;
            
        default:
            analysis += generateGeneralAnalysis(bazi, question);
    }
    
    // 添加通用建议
    analysis += `\n---\n`;
    analysis += `💡 **通用建议**\n`;
    analysis += `1. 保持积极乐观的心态\n`;
    analysis += `2. 注重身体健康，规律作息\n`;
    analysis += `3. 持续学习，提升自我\n`;
    analysis += `4. 珍惜当下，把握机会\n\n`;
    
    // 添加免责声明
    analysis += `> ⚠️ **免责声明**：本分析基于传统八字理论和算法生成，仅供娱乐参考。命运掌握在自己手中，请理性看待，切勿沉迷。`;
    
    return analysis;
}

/**
 * 生成事业分析
 */
function generateCareerAnalysis(bazi, question) {
