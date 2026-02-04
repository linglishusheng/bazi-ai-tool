// 八字AI分析工具 - 修复版
document.addEventListener('DOMContentLoaded', function() {
    console.log('八字AI工具加载完成');
    
    // 获取DOM元素
    const elements = {
        birthdate: document.getElementById('birthdate'),
        birthtime: document.getElementById('birthtime'),
        gender: document.getElementById('gender'),
        calculateBtn: document.getElementById('calculateBtn'),
        analyzeBtn: document.getElementById('analyzeBtn'),
        resultSection: document.getElementById('resultSection'),
        answerBox: document.getElementById('answerBox'),
        answerContent: document.getElementById('answerContent'),
        loading: document.getElementById('loading'),
        yearZhu: document.getElementById('yearZhu'),
        monthZhu: document.getElementById('monthZhu'),
        dayZhu: document.getElementById('dayZhu'),
        hourZhu: document.getElementById('hourZhu'),
        shengxiao: document.getElementById('shengxiao'),
        mingzhu: document.getElementById('mingzhu'),
        question: document.getElementById('question')
    };

    // 设置默认日期为25年前
    const today = new Date();
    const defaultDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    elements.birthdate.value = defaultDate.toISOString().split('T')[0];

    // 计算八字按钮点击事件
    elements.calculateBtn.addEventListener('click', calculateBazi);
    
    // AI分析按钮点击事件
    elements.analyzeBtn.addEventListener('click', analyzeBazi);
    
    // 回车键支持
    elements.question.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            analyzeBazi();
        }
    });

    // 显示消息
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            padding: 10px 20px; background: ${type === 'error' ? '#f44336' : '#4CAF50'}; 
            color: white; border-radius: 5px; z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }

    // 计算八字
    async function calculateBazi() {
        const birthdate = elements.birthdate.value;
        const birthtime = parseInt(elements.birthtime.value);
        
        if (!birthdate) {
            showMessage('请输入出生日期', 'error');
            return;
        }

        elements.loading.style.display = 'block';
        
        try {
            const [year, month, day] = birthdate.split('-').map(Number);
            
            // 使用修复版的八字计算
            const bazi = await calculateBaziFix(year, month, day, birthtime);
            
            // 显示结果
            elements.yearZhu.textContent = bazi.year || '-';
            elements.monthZhu.textContent = bazi.month || '-';
            elements.dayZhu.textContent = bazi.day || '-';
            elements.hourZhu.textContent = bazi.hour || '-';
            elements.shengxiao.textContent = bazi.shengxiao || '-';
            elements.mingzhu.textContent = bazi.mingzhu || '-';
            
            elements.resultSection.style.display = 'block';
            
            // 保存数据供AI分析
            window.currentBazi = bazi;
            
            showMessage('八字计算完成！', 'success');
            
        } catch (error) {
            console.error('八字计算错误:', error);
            showMessage('八字计算失败，请稍后重试', 'error');
        } finally {
            elements.loading.style.display = 'none';
        }
    }

    // 修复版八字计算函数
    async function calculateBaziFix(year, month, day, hour) {
        return new Promise((resolve) => {
            // 天干地支
            const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
            const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
            const SHENGXIAO = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
            
            // 计算年柱（简化算法）
            const yearGanIndex = (year - 4) % 10;
            const yearZhiIndex = (year - 4) % 12;
            const yearZhu = TIANGAN[yearGanIndex] + DIZHI[yearZhiIndex];
            
            // 计算月柱（简化算法）
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
            const hourGanIndex = (dayGanIndex * 2 + hour) % 10;
            const hourZhu = TIANGAN[hourGanIndex] + DIZHI[hour];
            
            // 计算生肖
            const shengxiao = SHENGXIAO[(year - 4) % 12];
            
            // 命主（日干）
            const mingzhuMap = {
                "甲": "甲木", "乙": "乙木", "丙": "丙火", "丁": "丁火",
                "戊": "戊土", "己": "己土", "庚": "庚金", "辛": "辛金",
                "壬": "壬水", "癸": "癸水"
            };
            const mingzhu = mingzhuMap[dayZhu.charAt(0)] || "未知";

            resolve({
                year: yearZhu,
                month: monthZhu,
                day: dayZhu,
                hour: hourZhu,
                shengxiao: shengxiao,
                mingzhu: mingzhu,
                gender: elements.gender.value
            });
        });
    }

    // AI分析
    async function analyzeBazi() {
        if (!window.currentBazi) {
            showMessage('请先计算八字', 'error');
            return;
        }
        
        const question = elements.question.value.trim();
        if (!question) {
            showMessage('请输入您的问题', 'error');
            return;
        }
        
        elements.loading.style.display = 'block';
        elements.answerBox.style.display = 'none';
        
        try {
            // 模拟AI分析
            const analysis = await simulateAIAnalysis(window.currentBazi, question);
            
            elements.answerContent.innerHTML = formatAnalysis(analysis);
            elements.answerBox.style.display = 'block';
            
        } catch (error) {
            console.error('分析失败:', error);
            showMessage('分析失败，请稍后重试', 'error');
        } finally {
            elements.loading.style.display = 'none';
        }
    }

    // 模拟AI分析
    async function simulateAIAnalysis(bazi, question) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const { year, month, day, hour, mingzhu, shengxiao } = bazi;
        
        // 根据问题类型生成分析
        let analysis = '';
        
        if (question.includes('事业') || question.includes('工作')) {
            analysis = `根据您的八字「${year} ${month} ${day} ${hour}」分析：\n\n` +
                       `💼 **事业运势**\n\n` +
                       `您的命主为${mingzhu}，适合稳定的职业发展。\n\n` +
                       `**年柱${year}**：事业基础稳固，有贵人相助。\n` +
                       `**月柱${month}**：中年时期会有不错的发展机遇。\n` +
                       `**日柱${day}**：个人能力强，适合专业领域发展。\n` +
                       `**时柱${hour}**：晚年运势良好，积累有成。\n\n` +
                       `💡 **建议**：把握35-45岁之间的发展黄金期。`;
            
        } else if (question.includes('财运') || question.includes('金钱')) {
            analysis = `根据您的八字「${year} ${month} ${day} ${hour}」分析：\n\n` +
                       `💰 **财运分析**\n\n` +
                       `您的财运趋势整体向好，建议：\n` +
                       `• 稳健投资，避免高风险\n` +
                       `• 多元化收入来源\n` +
                       `• 注重长期规划`;
            
        } else if (question.includes('感情') || question.includes('婚姻')) {
            analysis = `根据您的八字「${year} ${month} ${day} ${hour}」分析：\n\n` +
                       `❤️ **感情运势**\n\n` +
                       `感情方面需要主动经营，建议：\n` +
                       `• 多沟通交流\n` +
                       `• 相互理解支持\n` +
                       `• 共同成长进步`;
            
        } else {
            analysis = `针对您的问题「${question}」，基于您的八字分析：\n\n` +
                       `📊 **综合分析**\n\n` +
                       `您的八字显示运势平稳，建议保持积极心态，脚踏实地。\n\n` +
                       `**近期建议**：\n` +
                       `• 注重健康养生\n` +
                       `• 加强学习提升\n` +
                       `• 把握机遇时机`;
        }
        
        return analysis;
    }

    // 格式化分析文本
    function formatAnalysis(text) {
        return text.split('\n').map(line => {
            if (line.trim() === '') return '<br>';
            if (line.includes('**') && line.includes('**')) {
                return `<h4>${line.replace(/\*\*/g, '')}</h4>`;
            }
            return `<p>${line}</p>`;
        }).join('');
    }
});
