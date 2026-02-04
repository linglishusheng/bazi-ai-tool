/**
 * 增强版八字计算库
 * 基于lunar-javascript的完整八字分析
 */

class AdvancedBaziCalculator {
    constructor() {
        this.ShiShenMap = this.initShiShenMap();
        this.WuXingEnergy = this.initWuXingEnergy();
    }
    
    // 初始化十神映射表
    initShiShenMap() {
        return {
            // 日干与其他天干的关系
            '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
            '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
            '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
            '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
            '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
            '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
            '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
            '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
            '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
            '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
        };
    }
    
    // 初始化五行能量计算
    initWuXingEnergy() {
        return {
            '甲': {'木': 2}, '乙': {'木': 2}, '丙': {'火': 2}, '丁': {'火': 2},
            '戊': {'土': 2}, '己': {'土': 2}, '庚': {'金': 2}, '辛': {'金': 2},
            '壬': {'水': 2}, '癸': {'水': 2},
            '寅': {'木': 2, '火': 1}, '卯': {'木': 3}, '辰': {'土': 2, '木': 1},
            '巳': {'火': 2, '金': 1}, '午': {'火': 3}, '未': {'土': 2, '火': 1},
            '申': {'金': 2, '水': 1}, '酉': {'金': 3}, '戌': {'土': 2, '金': 1},
            '亥': {'水': 2, '木': 1}, '子': {'水': 3}, '丑': {'土': 2, '水': 1}
        };
    }
    
    // 计算完整八字信息
    calculateCompleteBazi(solarDate, hour, gender) {
        try {
            const solar = Solar.fromYmd(
                solarDate.getFullYear(),
                solarDate.getMonth() + 1,
                solarDate.getDate()
            );
            const lunar = solar.getLunar();
            
            // 计算四柱
            const bazi = {
                year: lunar.getYearInGanZhi(),
                month: lunar.getMonthInGanZhi(),
                day: lunar.getDayInGanZhi(),
                hour: lunar.getTimeInGanZhi(hour)
            };
            
            // 计算十神
            const shishen = this.calculateShiShen(bazi);
            
            // 计算五行能量
            const wuxing = this.calculateWuXing(bazi);
            
            // 判断日主旺衰
            const strength = this.judgeStrength(bazi, wuxing);
            
            // 计算特殊格局
            const patterns = this.analyzePatterns(bazi, shishen, strength);
            
            // 统计十神数量
            const shishenCount = this.countShiShen(shishen);
            
            return {
                ...bazi,
                shengxiao: lunar.getYearShengXiao(),
                strength: strength,
                shishen: shishen,
                shishenCount: shishenCount,
                wuxing: wuxing,
                patterns: patterns,
                gender: gender,
                lunarYear: lunar.getYear(),
                analysis: this.generateBasicAnalysis(bazi, shishen, strength, patterns)
            };
            
        } catch (error) {
            console.error('八字计算错误:', error);
            throw new Error('八字计算失败，请检查输入参数');
        }
    }
    
    // 计算十神
    calculateShiShen(bazi) {
        const dayGan = bazi.day.charAt(0); // 日干
        const shishen = {};
        
        // 年柱十神
        shishen.year = this.getShiShen(dayGan, bazi.year.charAt(0));
        
        // 月柱十神
        shishen.month = this.getShiShen(dayGan, bazi.month.charAt(0));
        
        // 日柱十神（日支）
        shishen.day = this.getShiShen(dayGan, bazi.day.charAt(1));
        
        // 时柱十神
        shishen.hour = this.getShiShen(dayGan, bazi.hour.charAt(0));
        
        return shishen;
    }
    
    // 获取十神
    getShiShen(dayGan, targetGan) {
        return this.ShiShenMap[dayGan]?.[targetGan] || '未知';
    }
    
    // 计算五行能量
    calculateWuXing(bazi) {
        const wuxing = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
        
        // 分析天干五行
        [...bazi.year, ...bazi.month, ...bazi.day, ...bazi.hour].forEach(char => {
            const energy = this.WuXingEnergy[char];
            if (energy) {
                Object.entries(energy).forEach(([element, value]) => {
                    wuxing[element] += value;
                });
            }
        });
        
        return wuxing;
    }
    
    // 判断日主旺衰
    judgeStrength(bazi, wuxing) {
        const dayGan = bazi.day.charAt(0);
        const dayElement = this.getTianGanElement(dayGan);
        const dayEnergy = wuxing[dayElement] || 0;
        
        // 简化判断：比较日主五行能量与其他五行
        const totalEnergy = Object.values(wuxing).reduce((a, b) => a + b, 0);
        const ratio = dayEnergy / totalEnergy;
        
        if (ratio > 0.3) return '身旺';
        if (ratio < 0.2) return '身弱';
        return '中和';
    }
    
    // 获取天干五行
    getTianGanElement(gan) {
        const map = {
            '甲': '木', '乙': '木', '丙': '火', '丁': '火',
            '戊': '土', '己': '土', '庚': '金', '辛': '金', 
            '壬': '水', '癸': '水'
        };
        return map[gan] || '未知';
    }
    
    // 分析特殊格局
    analyzePatterns(bazi, shishen, strength) {
        const patterns = [];
        
        // 检查从格
        if (this.isCongGe(bazi, strength)) {
            patterns.push('从格');
        }
        
        // 检查特殊十神组合
        if (shishenCount.qisha >= 2) {
            patterns.push('
