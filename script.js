// 主逻辑文件
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const birthdateInput = document.getElementById('birthdate');
    const birthtimeSelect = document.getElementById('birthtime');
    const genderSelect = document.getElementById('gender');
    const calculateBtn = document.getElementById('calculateBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultSection = document.getElementById('resultSection');
    const answerBox = document.getElementById('answerBox');
    const answerContent = document.getElementById('answerContent');
    const loading = document.getElementById('loading');
    
    // 八字结果显示元素
    const yearZhu = document.getElementById('yearZhu');
    const monthZhu = document.getElementById('monthZhu');
    const dayZhu = document.getElementById('dayZhu');
    const hourZhu = document.getElementById('hourZhu');
    const wuxing = document.getElementById('wuxing');
    const shengxiao = document.getElementById('shengxiao');
    const mingzhu = document.getElementById('mingzhu');
    
    // 问题输入
    const questionInput = document.getElementById('question');
    
    // 设置默认日期为25年前
    const today = new Date();
    const defaultDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const defaultDateStr = defaultDate.toISOString().split('T')[0];
    birthdateInput.value = defaultDateStr;
    
    // 计算八字按钮点击事件
    calculateBtn.addEventListener('click', function() {
        calculateBazi();
    });
    
    // AI分析按钮点击事件
    analyzeBtn.addEventListener('click', function() {
        analyzeBazi();
    });
    
    // 回车键触发计算
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (questionInput === document.activeElement) {
                analyzeBazi();
            } else {
                calculateBazi();
            }
        }
    });
    
    // 计算八字函数
    function calculateBazi() {
        const birthdate = birthdateInput.value;
        const birthtime = parseInt(birthtimeSelect.value);
        const gender = genderSelect.value;
        
        if (!birthdate) {
            alert('请输入出生日期');
            return;
        }
        
        // 解析日期
        const [year, month, day] = birthdate.split('-').map(num => parseInt(num));
        
        // 计算八字
        const yearGanZhi = lunarCalculator.calculateYearGanZhi(year);
        const monthGanZhi = lunarCalculator.calculateMonthGanZhi(year, month);
        const dayGanZhi = lunarCalculator.calculateDayGanZhi(year, month, day);
        const hourGanZhi = lunarCalculator.calculateHourGanZhi(dayGanZhi, birthtime);
        
        // 计算五行
        const wuxingYear = lunarCalculator.calculateWuXing(yearGanZhi);
        const wuxingMonth = lunarCalculator.calculateWuXing(monthGanZhi);
        const wuxingDay = lunarCalculator.calculateWuXing(dayGanZhi);
        const wuxingHour = lunarCalculator.calculateWuXing(hourGanZhi);
        
        // 计算生肖
        const shengxiaoResult = lunarCalculator.calculateShengXiao(year);
        
        // 命主
        const mingzhuResult = lunarCalculator.getMingZhu(dayGanZhi);
        
        // 显示结果
        yearZhu.textContent = yearGanZhi;
        monthZhu.textContent = monthGanZhi;
        dayZhu.textContent = dayGanZhi;
        hourZhu.textContent = hourGanZhi;
        wuxing.textContent = `${wuxingYear.gan}${wuxingYear.zhi} ${wuxingMonth.gan}${wuxingMonth.zhi} ${wuxingDay.gan}${wuxingDay.zhi} ${wuxingHour.gan}${wuxingHour.zhi}`;
        shengxiao.textContent = shengxiaoResult;
        mingzhu.textContent = mingzhuResult;
        
        // 显示结果区域
        resultSection.style.display = 'block';
        
        // 滚动到结果区域
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
        // 存储八字信息供AI分析使用
        window.currentBazi = {
            year: yearGanZhi,
            month: monthGanZhi,
            day: dayGanZhi,
            hour: hourGanZhi,
            wuxing: {
                year: wuxingYear,
                month: wuxingMonth,
                day: wuxingDay,
                hour: wuxingHour
            },
            shengxiao: shengxiaoResult,
            mingzhu: mingzhuResult,
            gender: gender
        };
        
        // 显示成功消息
        showMessage('八字计算完成！现在可以在下方提问进行AI分析', 'success');
    }
    
    // AI分析函数
    async function analyzeBazi() {
        if (!window.currentBazi) {
            alert('请先计算八字');
            return;
        }
        
        const question = questionInput.value.trim();
        if (!question) {
            alert('请输入您的问题');
            return;
        }
        
        // 显示加载动画
        loading.style.display = 'flex';
        answerBox.style.display = 'none';
        
        try {
            // 模拟AI分析（实际使用时可以替换为真正的AI API）
            const analysis = await simulateAIanalysis(window.currentBazi, question);
            
            // 显示分析结果
            answerContent.innerHTML = formatAnalysis(analysis);
            answerBox.style.display = 'block';
            
            // 滚动到结果区域
            answerBox.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('分析失败:', error);
            showMessage('分析失败，请稍后重试', 'error');
        } finally {
            // 隐藏加载动画
            loading.style.display = 'none';
        }
    }
    
    // 模拟AI分析（这里可以替换为真实的AI API调用）
    async function simulateAIanalysis(bazi, question) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const { year, month, day, hour, gender, shengxiao, mingzhu } = bazi;
        
        // 根据问题类型生成不同的分析
        let analysis = '';
        
        if (question.includes('事业') || question.includes('工作') || question.includes('职业')) {
            analysis = generateCareerAnalysis(bazi);
        } else if (question.includes('财运') || question.includes('财富') || question.includes('金钱')) {
            analysis = generateWealthAnalysis(bazi);
        } else if (question.includes('感情') || question.includes('婚姻') || question.includes('爱情')) {
            analysis = generateRelationshipAnalysis(bazi);
        } else if (question.includes('健康') || question.includes('身体') || question.includes('疾病')) {
            analysis = generateHealthAnalysis(bazi);
        } else if (question.includes('性格') || question.includes('个性') || question.includes('脾气')) {
            analysis = generatePersonalityAnalysis(bazi);
        } else {
            analysis = generateGeneralAnalysis(bazi, question);
        }
        
        return analysis;
    }
    
    // 生成事业分析
    function generateCareerAnalysis(bazi) {
        const { year, month, day, hour, mingzhu } = bazi;
        
        const careerAdvice = [
            `${mingzhu}命主，通常适合需要${getElementFromMingzhu(mingzhu)}属性的行业。`,
            `年柱${year}显示您有${lunarCalculator.getInterpretation(year).split('，')[1]}`,
            `日柱${day}表明您${getPersonalityFromDay(day.charAt(0))}`,
            `建议在${getLuckyDirections(day)}方向发展事业`,
            `适合的职业：${getSuitableCareers(mingzhu)}`,
            `需要注意：${getCareerWarning(year)}`
        ];
        
        return `根据您的八字分析，以下是关于事业方面的解读：\n\n` +
               `${careerAdvice.join('\n\n')}\n\n` +
               `总的来说，您的事业发展潜力很大，关键是要找到适合自己的方向，并持之以恒。`;
    }
    
    // 生成财运分析
    function generateWealthAnalysis(bazi) {
        const { year, month, day } = bazi;
        
        return `根据您的八字分析，以下是关于财运方面的解读：\n\n` +
               `您的八字显示财运趋势：\n` +
               `1. 年柱${year}：主${lunarCalculator.getInterpretation(year).split('，')[0]}，财运基础${getWealthLevel(year)}\n` +
               `2. 日柱${day}：您的命主为${day.charAt(0)}，财运特点${getWealthCharacteristic(day.charAt(0))}\n` +
               `3. 五行分析：${getWealthElement(bazi)}\n\n` +
               `财运建议：\n` +
               `• ${getWealthAdvice1(day)}\n` +
               `• ${getWealthAdvice2(year)}\n` +
               `• ${getWealthAdvice3(month)}\n\n` +
               `重要提醒：财运虽重要，但健康、家庭和人际关系同样宝贵。`;
    }
    
    // 生成感情分析
    function generateRelationshipAnalysis(bazi) {
        const { year, day, gender } = bazi;
        
        return `根据您的八字分析，以下是关于感情婚姻的解读：\n\n` +
               `您的感情特点：\n` +
               `1. 年柱${year}显示您${getRelationshipTrait(year, gender)}\n` +
               `2. 日柱${day}表明您在感情中${getRelationshipStyle(day.charAt(0))}\n` +
               `3. 五行搭配：${getRelationshipElement(bazi)}\n\n` +
               `感情建议：\n` +
               `• ${getRelationshipAdvice1(day)}\n` +
               `• ${getRelationshipAdvice2(year)}\n` +
               `• ${getRelationshipAdvice3(gender)}\n\n` +
               `真爱需要时间培养，相互理解和支持是长久关系的基础。`;
    }
    
    // 辅助函数
    function getElementFromMingzhu(mingzhu) {
        if (mingzhu.includes('木')) return '木';
        if (mingzhu.includes('火')) return '火';
        if (mingzhu.includes('土')) return '土';
        if (mingzhu.includes('金')) return '金';
        if (mingzhu.includes('水')) return '水';
        return '稳定';
    }
    
    function getPersonalityFromDay(gan) {
        const map = {
            '甲': '有领导力，做事果断',
            '乙': '温和体贴，善解人意',
            '丙': '热情开朗，积极向上',
            '丁': '细心谨慎，考虑周全',
            '戊': '稳重可靠，值得信赖',
            '己': '适应力强，善于变通',
            '庚': '正直公正，原则性强',
            '辛': '追求完美，注重细节',
            '壬': '聪明灵活，适应变化',
            '癸': '敏感细腻，富有同情心'
        };
        return map[gan] || '性格温和，待人和善';
    }
    
    // 更多辅助函数...
    function getLuckyDirections(day) {
        const directions = ['东方', '南方', '西方', '北方', '东南', '东北', '西南', '西北'];
        return directions[Math.floor(Math.random() * directions.length)];
    }
    
    function getSuitableCareers(mingzhu) {
        const careers = {
            '木': '教育、文化、艺术、设计',
            '火': '销售、传媒、娱乐、餐饮',
            '土': '建筑、房地产、管理、咨询',
            '金': '金融、法律、技术、制造',
            '水': '贸易、物流、旅游、服务'
        };
        
        for (const [element, career] of Object.entries(careers)) {
            if (mingzhu.includes(element)) {
                return career;
            }
        }
        return '多种行业都适合，关键要发挥自身优势';
    }
    
    // 格式化分析结果
    function formatAnalysis(text) {
        return text.split('\n').map(line => {
            if (line.trim() === '') return '<br>';
            return `<p>${line}</p>`;
        }).join('');
    }
    
    // 显示消息
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .message {
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);
});

// 分享功能
function shareToWechat() {
    alert('请点击微信右上角的分享按钮');
}

function shareToWeibo() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('八字AI分析工具 - 免费在线测算');
    window.open(`http://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert('链接已复制到剪贴板！'))
        .catch(() => {
            // 兼容旧浏览器
            const input = document.createElement('input');
            input.value = window.location.href;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            alert('链接已复制到剪贴板！');
        });
}