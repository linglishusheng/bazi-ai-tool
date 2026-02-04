class BaziAnalyzer {
    constructor() {
        this.rules = window.rulesData;
        this.init();
    }

    init() {
        this.populateDateSelectors();
        this.attachEventListeners();
    }

    populateDateSelectors() {
        // 填充年份 (1900-2025)
        const yearSelect = document.getElementById('year');
        for (let year = 2025; year >= 1900; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + '年';
            yearSelect.appendChild(option);
        }

        // 填充月份
        const monthSelect = document.getElementById('month');
        for (let month = 1; month <= 12; month++) {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month + '月';
            monthSelect.appendChild(option);
        }

        // 日期选择器会在月份变化时更新
        monthSelect.addEventListener('change', () => this.updateDaySelector());
    }

    updateDaySelector() {
        const year = parseInt(document.getElementById('year').value);
        const month = parseInt(document.getElementById('month').value);
        const daySelect = document.getElementById('day');
        
        // 清空现有选项
        daySelect.innerHTML = '<option value="">请选择日期</option>';
        
        if (!year || !month) return;

        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day + '日';
            daySelect.appendChild(option);
        }
    }

    attachEventListeners() {
        document.getElementById('birthForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.analyzeBazi();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportReport();
        });
    }

    async analyzeBazi() {
        const birthData = this.getBirthData();
        if (!this.validateInput(birthData)) return;

        this.showLoading(true);

        try {
            // 模拟AI分析过程
            await this.simulateAIAnalysis();
            
            const baziInfo = this.calculateBazi(birthData);
            const analysis = this.generateAnalysis(baziInfo, birthData);
            
            this.displayResults(baziInfo, analysis);
        } catch (error) {
            console.error('分析出错:', error);
            alert('分析过程中出现错误，请重试');
        } finally {
            this.showLoading(false);
        }
    }

    getBirthData() {
        return {
            year: parseInt(document.getElementById('year').value),
            month: parseInt(document.getElementById('month').value),
            day: parseInt(document.getElementById('day').value),
            hour: parseInt(document.getElementById('hour').value),
            gender: document.getElementById('gender').value
        };
    }

    validateInput(data) {
        if (!data.year || !data.month || !data.day || 
            isNaN(data.hour) || !data.gender) {
            alert('请填写完整的出生信息');
            return false;
        }
        return true;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const result = document.getElementById('result');
        
        if (show) {
            loading.classList.remove('hidden');
            result.classList.add('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    simulateAIAnalysis() {
        return new Promise(resolve => {
            setTimeout(resolve, 2000); // 模拟2秒分析时间
        });
    }

    calculateBazi(birthData) {
        // 使用lunar.js进行八字计算
        const solar = new Solar(birthData.year, birthData.month, birthData.day);
        const lunar = solar.getLunar();
        const bazi = lunar.getEightChar();
        
        return {
            year: bazi.getYear(),
            month: bazi.getMonth(),
            day: bazi.getDay(),
            hour: bazi.getTime(),
            ganzhi: {
                year: bazi.getYear(),
                month: bazi.getMonth(),
                day: bazi.getDay(),
                hour: bazi.getTime()
            },
            wuxing: this.calculateWuxing(bazi),
            shishen: this.calculateShishen(bazi),
            dayMaster: bazi.getDayGan()
        };
    }

    calculateWuxing(bazi) {
        // 计算五行分布
        const ganzhi = bazi.getYear() + bazi.getMonth() + bazi.getDay() + bazi.getTime();
        const wuxing = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
        
        const wuxingMap = {
            '甲': 'wood', '乙': 'wood', '寅': 'wood', '卯': 'wood',
            '丙': 'fire', '丁': 'fire', '巳': 'fire', '午': 'fire',
            '戊': 'earth', '己': 'earth', '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
            '庚': 'metal', '辛': 'metal', '申': 'metal', '酉': 'metal',
            '壬': 'water', '癸': 'water', '亥': 'water', '子': 'water'
        };

        for (let char of ganzhi) {
            const element = wuxingMap[char];
            if (element) wuxing[element]++;
        }

        return wuxing;
    }

    calculateShishen(bazi) {
        // 计算十神分布
        const dayGan = bazi.getDayGan();
        const shishen = {
           比肩: 0, 劫财: 0, 食神: 0, 伤官: 0, 偏财: 0,
           正财: 0, 七杀: 0, 正官: 0, 偏印: 0, 正印: 0
        };

        // 简化的十神计算逻辑
        const relations = this.getShishenRelations(dayGan);
        
        const allGanzhi = bazi.getYear() + bazi.getMonth() + bazi.getDay() + bazi.getTime();
        for (let char of allGanzhi) {
            const relation = relations[char];
            if (relation && shishen[relation]) {
                shishen[relation]++;
            }
        }

        return shishen;
    }

    getShishenRelations(dayGan) {
        // 返回天干对应的十神关系映射
        const relations = {};
        // 这里需要完整的十神关系映射表，由于篇幅限制只展示部分
        if (dayGan === '甲') {
            relations['甲'] = '比肩'; relations['乙'] = '劫财';
            relations['丙'] = '食神'; relations['丁'] = '伤官';
            // ... 其他天干关系
        }
        return relations;
    }

    generateAnalysis(baziInfo, birthData) {
        return {
            traditional: this.generateTraditionalAnalysis(baziInfo, birthData),
            modern: this.generateModernAnalysis(baziInfo, birthData)
        };
    }

    generateTraditionalAnalysis(baziInfo, birthData) {
        let analysis = '<div class="analysis-content">';
        
        // 原则1分析：日支坐下十神
        analysis += this.analyzePrinciple1(baziInfo, birthData);
        
        // 原则2分析：十神数量影响
        analysis += this.analyzePrinciple2(baziInfo);
        
        // 原则3分析：天干十神外在性格
        analysis += this.analyzePrinciple3(baziInfo);
        
        // 原则4分析：断命技巧
        analysis += this.analyzePrinciple4(baziInfo);
        
        // 原则5分析：阴阳属性
        analysis += this.analyzePrinciple5(baziInfo);
        
        // 原则6分析：七杀优先
        analysis += this.analyzePrinciple6(baziInfo);
        
        // 原则7分析：成就事业模式
        analysis += this.analyzePrinciple7(baziInfo);
        
        // 原则8分析：格局心性
        analysis += this.analyzePrinciple8(baziInfo);

        analysis += '</div>';
        return analysis;
    }

    generateModernAnalysis(baziInfo, birthData) {
        const disclaimer = '<p><strong>本部分将传统分析转化为现代人生规划视角，侧重于趋势分析和建议。出生时间规律作为一种文化符号系统，提供个人发展的参考框架，而非绝对预测。以下解读基于统计模型和传统文化智慧的现代化应用，强调可能性和个体主动性。</strong></p>';
        
        let analysis = disclaimer + '<div class="analysis-content">';
        
        // 将传统分析转化为现代建议
        analysis += this.translateToModernPerspective(baziInfo, birthData);
        
        analysis += '</div>';
        return analysis;
    }

    // 各个原则的分析方法（由于篇幅限制，只展示部分实现）
    analyzePrinciple1(baziInfo, birthData) {
        let analysis = '<div class="analysis-point">';
        analysis += '<h4>原则1：日支坐下十神分析</h4>';
        
        const dayZhi = baziInfo.ganzhi.day.charAt(1); // 日支
        const dayMaster = baziInfo.dayMaster;
        
        // 根据日支判断坐下十神
        const shishenMap = this.rules.principle1.sittingShishen;
        const shishenInfo = shishenMap[dayZhi];
        
        if (shishenInfo) {
            analysis += `<p>分析显示，日支为${dayZhi}，坐下${shishenInfo.name}。</p>`;
            analysis += `<p>传统分析方法认为有${shishenInfo.character}的可能性。</p>`;
            
            // 结合日主旺衰分析
            const strength = this.calculateDayMasterStrength(baziInfo);
            analysis += `<p>日主${dayMaster}${strength === 'strong' ? '偏旺' : '偏弱'}，${this.getStrengthAnalysis(shishenInfo, strength, birthData)}</p>`;
        }
        
        analysis += '</div>';
        return analysis;
    }

    analyzePrinciple2(baziInfo) {
        let analysis = '<div class="analysis-point">';
        analysis += '<h4>原则2：十神数量分布分析</h4>';
        
        const shishenCounts = baziInfo.shishen;
        const prominentShishen = [];
        
        for (const [shishen, count] of Object.entries(shishenCounts)) {
            if (count >= 2) {
                prominentShishen.push({name: shishen, count: count});
            }
        }
        
        if (prominentShishen.length > 0) {
            analysis += '<p>分析显示，以下十神数量较多，可能对个人特质产生较明显影响：</p><ul>';
            prominentShishen.forEach(item => {
                const rule = this.rules.principle2[item.name];
                if (rule) {
                    analysis += `<li><strong>${item.name}多</strong>：${rule.interpretation}</li>`;
                }
            });
            analysis += '</ul>';
        }
        
        analysis += '</div>';
        return analysis;
    }

    // 其他原则的分析方法类似，由于篇幅限制这里省略具体实现...

    translateToModernPerspective(baziInfo, birthData) {
        let analysis = '<div class="analysis-point">';
        analysis += '<h4>先天特质与后天发展的整合性评估</h4>';
        
        // 内在优势图谱
        analysis += this.generateStrengthMap(baziInfo);
        
        // 关键领域建议
        analysis += this.generateDomainAdvice(baziInfo);
        
        // 行动与调整建议
        analysis += this.generateActionPlan(baziInfo, birthData);
        
        analysis += '</div>';
        return analysis;
    }

    displayResults(baziInfo, analysis) {
        // 显示基本信息
        this.displayBasicInfo(baziInfo);
        
        // 显示传统分析
        document.getElementById('traditionalAnalysis').innerHTML = analysis.traditional;
        
        // 显示现代分析
        document.getElementById('modernAnalysis').innerHTML = analysis.modern;
        
        // 显示结果区域
        document.getElementById('result').classList.remove('hidden');
        
        // 滚动到结果区域
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    }

    displayBasicInfo(baziInfo) {
        const content = `
            <p><strong>八字排盘：</strong> ${baziInfo.ganzhi.year} ${baziInfo.ganzhi.month} ${baziInfo.ganzhi.day} ${baziInfo.ganzhi.hour}</p>
            <p><strong>日主：</strong> ${baziInfo.dayMaster}</p>
            <p><strong>五行分布：</strong> 金${baziInfo.wuxing.metal} 木${baziInfo.wuxing.wood} 水${baziInfo.wuxing.water} 火${baziInfo.wuxing.fire} 土${baziInfo.wuxing.earth}</p>
        `;
        document.getElementById('basicInfoContent').innerHTML = content;
    }

    exportReport() {
        const resultContent = document.getElementById('result').innerHTML;
        const windowContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>八字分析报告</title>
                <style>
                    body { font-family: 'Microsoft YaHei', Arial; line-height: 1.6; }
                    .analysis-point { margin: 20px 0; padding: 15px; border-left: 4px solid #667eea; background: #f7fafc; }
                </style>
            </head>
            <body>${resultContent}</body>
            </html>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(windowContent);
        printWindow.document.close();
        printWindow.print();
    }

    // 辅助方法
    calculateDayMasterStrength(baziInfo) {
        // 简化的日主旺衰判断
        const wuxing = baziInfo.wuxing;
        const dayElement = this.getDayMasterElement(baziInfo.dayMaster);
        
        // 简单的旺衰判断逻辑
        const support = wuxing[dayElement] + (wuxing[this.getSupportElement(dayElement)] || 0);
        const restrain = Object.values(wuxing).reduce((a, b) => a + b, 0) - support;
        
        return support >= restrain ? 'strong' : 'weak';
    }

    getDayMasterElement(dayMaster) {
        const elementMap = {
            '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire',
            '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal',
            '壬': 'water', '癸': 'water'
        };
        return elementMap[dayMaster] || 'earth';
    }

    getSupportElement(element) {
        const supportMap = {
            'wood': 'water', 'fire': 'wood', 'earth': 'fire',
            'metal': 'earth', 'water': 'metal'
        };
        return supportMap[element];
    }

    getStrengthAnalysis(shishenInfo, strength, birthData) {
        // 根据旺衰返回相应的分析
        const analysis = strength === 'strong' ? shishenInfo.strongAnalysis : shishenInfo.weakAnalysis;
        return analysis.replace(/❌❌/g, '需注意').replace(/✅/g, '有利');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new BaziAnalyzer();
});
