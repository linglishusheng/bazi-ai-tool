/**
 * 八字AI分析工具 - 主逻辑脚本
 * 纯前端实现，零成本部署
 */

// 全局变量
let currentBazi = null;
let analysisHistory = [];

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('八字AI分析工具正在初始化...');
    
    // 初始化页面
    initPage();
    
    // 初始化事件监听
    initEventListeners();
    
    // 设置默认日期（25年前）
    setDefaultDate();
    
    // 加载历史记录
    loadHistory();
    
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
        'resultSection', 'analyzeBtn', 'question',
        'answerContainer'
    ];
    
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`未找到元素: #${id}`);
        }
    });
    
    // 初始化五行图表
    initWuxingChart();
    
    // 检查八字计算库是否加载
    if (typeof ChineseLunar === 'undefined') {
        console.warn('八字计算库未正确加载');
        showMessage('八字计算库加载中，请稍候...', 'warning');
    }
}

/**
 * 初始化五行图表
 */
function initWuxingChart() {
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
            // 使用动画效果
            setTimeout(() => {
                bar.style.width = `${percentage}%`;
                valueSpan.textContent = `${percentage}%`;
            }, index * 200);
        }
    });
}

/**
 * 加载历史记录
 */
function loadHistory() {
    try {
        const savedHistory = localStorage.getItem('baziAnalysisHistory');
        if (savedHistory) {
            analysisHistory = JSON.parse(savedHistory);
        }
    } catch (error) {
        console.error('加载历史记录失败:', error);
        analysisHistory = [];
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
        answer: answer.substring(0, 100) + '...'
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
    const birthtime = parseInt(document.getElementById('birthtime').value);
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
        
        console.log(`计算参数: ${year}年${month}月${day}日 ${birthtime}时 ${gender}`);
        
        // 使用chinese-lunar库计算农历
        const solarDate = new Date(year, month - 1, day);
        
        // 检查库是否可用
        if (typeof ChineseLunar === 'undefined') {
            throw new Error('八字计算库未正确加载');
        }
        
        // 计算农历
        const lunar = ChineseLunar.solarToLunar(solarDate);
        
        if (!lunar) {
            throw new Error('农历转换失败');
        }
        
        // 计算八字
        const bazi = calculateBaziFromLunar(lunar, birthtime, year);
        
        // 计算五行
        const wuxing = calculateWuXing(bazi);
        
        // 计算五行能量
        const wuxingEnergy = calculateWuxingEnergy(wuxing);
        
        // 保存当前八字信息
        currentBazi = {
            ...bazi,
            wuxing: wuxing,
            wuxingEnergy: wuxingEnergy,
            gender: gender
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
        showMessage('八字计算失败，请检查输入格式或稍后重试', 'error');
        
        // 如果库加载失败，使用备用算法
        if (error.message === '八字计算库未正确加载') {
            calculateBaziBackup();
        }
    } finally {
        showGlobalLoading(false);
    }
}

/**
 * 备用八字计算算法
 */
function calculateBaziBackup() {
    console.log('使用备用八字计算算法...');
    
    const birthdate = document.getElementById('birthdate').value;
    const birthtime = parseInt(document.getElementById('birthtime').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    const [year, month, day] = birthdate.split('-').map(Number);
    
    // 天干地支
    const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const SHENGXIAO = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
    
    try {
        // 计算年柱
        const yearGanIndex = (year - 4) % 10;
        const yearZhiIndex = (year - 4) % 12;
        const yearZhu = TIANGAN[yearGanIndex] + DIZHI[yearZhiIndex];
        
        // 计算月柱
        const monthZhiIndex = (month - 1) % 12;
        const monthGanIndex = (yearGanIndex * 2 + monthZhiIndex + 2) % 10;
        const monthZhu = TIANGAN[monthGanIndex] + DIZHI[monthZhiIndex];
        
        // 计算日柱（简化算法）
        const baseDate = new Date(1900, 0, 31);
        const currentDate = new Date(year, month - 1, day);
        const daysDiff = Math.floor((currentDate - baseDate) / (1000 * 60 * 60 * 24));
        const dayGanIndex = (daysDiff + 9) % 10;
        const dayZhiIndex = (daysDiff + 11) % 12;
        const dayZhu = TIANGAN[dayGanIndex] + DIZHI[dayZhiIndex];
        
        // 计算时柱
        const hourGanIndex = (dayGanIndex * 2 + birthtime) % 10;
        const hourZhu = TIANGAN[hourGanIndex] + DIZHI[birthtime];
        
        // 计算生肖
        const shengxiao = SHENGXIAO[(year - 4) % 12];
        
        // 命主
        const mingzhuMap = {
            "甲": "甲木", "乙": "乙木", "丙": "丙火", "丁": "丁火",
            "戊": "戊土", "己": "己土", "庚": "庚金", "辛": "辛金",
            "壬": "壬水", "癸": "癸水"
        };
        const mingzhu = mingzhuMap[dayZhu.charAt(0)] || "未知";
        
        // 五行
        const wuxing = {
            year: getElementByGan(yearZhu.charAt(0)),
            month: getElementByGan(monthZhu.charAt(0)),
            day: getElementByGan(dayZhu.charAt(0)),
            hour: getElementByGan(hourZhu.charAt(0))
        };
        
        // 计算五行能量
        const wuxingEnergy = calculateWuxingEnergy(wuxing);
        
        // 保存数据
        currentBazi = {
            year: yearZhu,
            month: monthZhu,
            day: dayZhu,
            hour: hourZhu,
            shengxiao: shengxiao,
            mingzhu: mingzhu,
            wuxing: wuxing,
            wuxingEnergy: wuxingEnergy,
            gender: gender
        };
        
        // 更新显示
        updateBaziDisplay(currentBazi);
        updateWuxingChart(wuxingEnergy);
        document.getElementById('resultSection').style.display = 'block';
        
        showMessage('八字计算完成！', 'success');
        
    } catch (error) {
        console.error('备用算法失败:', error);
        showMessage('八字计算失败，请刷新页面重试', 'error');
    }
}

/**
 * 根据农历计算八字
 */
function calculateBaziFromLunar(lunar, hour, solarYear) {
    // 天干地支
    const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const SHENGXIAO = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
    
    const lunarYear = lunar.lunarYear;
    const lunarMonth = lunar.lunarMonth;
    const lunarDay = lunar.lunarDay;
    
    // 计算年柱
    const yearGanIndex = (lunarYear - 4) % 10;
    const yearZhiIndex = (lunarYear - 4) % 12;
    const yearZhu = TIANGAN[yearGanIndex] + DIZHI[yearZhiIndex];
    
    // 计算月柱（简化）
    const monthZhiIndex = (lunarMonth - 1) % 12;
    const monthGanIndex = (yearGanIndex * 2 + monthZhiIndex + 2) % 10;
    const monthZhu = TIANGAN[monthGanIndex] + DIZHI[monthZhiIndex];
    
    // 计算日柱（简化）
    const baseDate = new Date(1900, 0, 31);
    const currentDate = new Date(solarYear, lunar.month - 1, lunar.day);
    const daysDiff = Math.floor((currentDate - baseDate) / (1000 * 60 * 60 * 24));
    const dayGanIndex = (daysDiff + 9) % 10;
    const dayZhiIndex = (daysDiff + 11) % 12;
    const dayZhu = TIANGAN[dayGanIndex] + DIZHI[dayZhiIndex];
    
    // 计算时柱
    const hourGanIndex = (dayGanIndex * 2 + hour) % 10;
    const hourZhu = TIANGAN[hourGanIndex] + DIZHI[hour];
    
    // 生肖
    const shengxiao = SHENGXIAO[(lunarYear - 4) % 12];
    
    // 命主
    const mingzhuMap = {
        "甲": "甲木", "乙": "乙木", "丙": "丙火", "丁": "丁火",
        "戊": "戊土", "己": "己土", "庚": "庚金", "辛": "辛金",
        "壬": "壬水", "癸": "癸水"
    };
    const mingzhu = mingzhuMap[dayZhu.charAt(0)] || "未知";
    
    return {
        year: yearZhu,
        month: monthZhu,
        day: dayZhu,
        hour: hourZhu,
        shengxiao: shengxiao,
        mingzhu: mingzhu
    };
}

/**
 * 获取天干对应的五行
 */
function getElementByGan(gan) {
    const map = {
        "甲": "木", "乙": "木", "丙": "火", "丁": "火",
        "戊": "土", "己": "土", "庚": "金", "辛": "金",
        "壬": "水", "癸": "水"
    };
    return map[gan] || "未知";
}

/**
 * 计算五行
 */
function calculateWuXing(bazi) {
    return {
        year: getElementByGan(bazi.year.charAt(0)),
        month: getElementByGan(bazi.month.charAt(0)),
        day: getElementByGan(bazi.day.charAt(0)),
        hour: getElementByGan(bazi.hour.charAt(0))
    };
}

/**
 * 计算五行能量
 */
function calculateWuxingEnergy(wuxing) {
    const energy = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    
    // 统计五行出现次数
    Object.values(wuxing).forEach(element => {
        if (element.includes('木')) energy['木'] += 2;
        if (element.includes('火')) energy['火'] += 2;
        if (element.includes('土')) energy['土'] += 2;
        if (element.includes('金')) energy['金'] += 2;
        if (element.includes('水')) energy['水'] += 2;
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
    analysis += `> ⚠️ **重要提示**：本分析基于传统八字理论和算法生成，仅供娱乐参考。命运掌握在自己手中，请理性看待，切勿沉迷。如需专业指导，可+VX: linglishusheng`;
    
    return analysis;
}

/**
 * 提取关键词
 */
function extractKeywords(question) {
    const keywords = [];
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('事业') || lowerQuestion.includes('工作') || lowerQuestion.includes('职业')) {
        keywords.push('事业');
    }
    if (lowerQuestion.includes('财运') || lowerQuestion.includes('财富') || lowerQuestion.includes('金钱')) {
        keywords.push('财运');
    }
    if (lowerQuestion.includes('感情') || lowerQuestion.includes('婚姻') || lowerQuestion.includes('爱情')) {
        keywords.push('感情');
    }
    if (lowerQuestion.includes('健康') || lowerQuestion.includes('身体') || lowerQuestion.includes('疾病')) {
        keywords.push('健康');
    }
    
    return keywords;
}

/**
 * 生成事业分析
 */
function generateCareerAnalysis(bazi, question) {
    const { year, month, day, hour, mingzhu } = bazi;
    
    const careerMap = {
        "甲木": "适合管理、教育、文化行业，发展方向宜向东",
        "乙木": "适合艺术、设计、咨询行业，有创意天赋", 
        "丙火": "适合销售、传媒、能源行业，善于表达",
        "丁火": "适合技术、研究、医疗行业，细心专注",
        "戊土": "适合建筑、房地产、金融行业，稳重可靠",
        "己土": "适合农业、服务、教育行业，耐心细致",
        "庚金": "适合法律、机械、体育行业，果断刚毅",
        "辛金": "适合金融、珠宝、精密行业，追求完美",
        "壬水": "适合贸易、物流、旅游行业，灵活变通",
        "癸水": "适合咨询、艺术、服务行业，细腻敏感"
    };
    
    return `根据您的八字「${year} ${month} ${day} ${hour}」分析：\n\n` +
           `💼 **事业运势分析**\n\n` +
           `您的命主为${mingzhu}，${careerMap[mingzhu] || "适合多样化发展，关键要发挥自身优势"}。\n\n` +
           `**年柱${year}**：事业基础稳固，有贵人相助，早年运势平稳。\n` +
           `**月柱${month}**：中年时期会有不错的发展机遇，需把握时机。\n` +
           `**日柱${day}**：个人能力突出，适合发挥专长，独立发展。\n` +
           `**时柱${hour}**：晚年运势良好，积累有成，适合传承经验。\n\n` +
           `💡 **建议**：把握35-45岁之间的黄金发展期，多学习新技能，建立良好的人脉关系。`;
}

/**
 * 生成财运分析
 */
function generateWealthAnalysis(bazi, question) {
    const { year, month, day, hour, mingzhu } = bazi;
    
    const wealthMap = {
        "甲木": "财运稳定增长，适合长期投资，不宜冒险投机",
        "乙木": "财运细水长流，适合合作求财，注意理财规划",
        "丙火": "财运起伏较大，适合把握时机，见好就收",
        "丁火": "财运稳定，适合专业技能变现，避免贪心",
        "戊土": "财运稳定增长，适合实业投资，保守为宜",
        "己土": "财运平稳上升，适合稳健理财，积少成多",
        "庚金": "财运波动中增长，适合把握机遇，注意风险控制",
        "辛金": "财运平稳发展，适合专业领域深耕，精进技能",
        "壬水": "财运变化较多，适合灵活投资，及时调整策略",
        "癸水": "财运稳定积累，适合长期规划，避免冲动消费"
    };
    
    return `根据您的八字「${year} ${month} ${day} ${hour}」分析：\n\n` +
           `💰 **财运分析**\n\n` +
           `您的命主为${mingzhu}，${wealthMap[mingzhu] || "财运趋势整体向好，建议稳健为主"}。\n\n` +
           `**财富特征**：\n` +
           `• 正财运：稳定收入来源良好\n` +
           `• 偏财运：需谨慎把握机会\n` +
           `• 理财能力：有较强的理财意识\n\n` +
           `💡 **建议**：\n` +
           `1
