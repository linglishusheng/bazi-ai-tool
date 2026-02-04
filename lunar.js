/**
 * 简易八字计算库
 * 基于公历日期计算八字
 */

// 天干
const TianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
// 地支
const DiZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
// 生肖
const ShengXiao = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
// 五行
const WuXing = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
// 月支对应表
const MonthZhi = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];

class LunarCalculator {
    constructor() {
        this.rules = this.loadRules();
    }
    
    // 计算年柱
    calculateYearGanZhi(year) {
        // 简化计算：以立春为界
        const ganIndex = (year - 4) % 10;
        const zhiIndex = (year - 4) % 12;
        return TianGan[ganIndex] + DiZhi[zhiIndex];
    }
    
    // 计算月柱
    calculateMonthGanZhi(year, month) {
        // 月支固定
        const zhi = MonthZhi[month - 1];
        
        // 年干对应月干（五虎遁）
        const yearGan = (year - 4) % 10;
        const monthGanTable = [
            ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"], // 甲己年
            ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"], // 乙庚年
            ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"], // 丙辛年
            ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"], // 丁壬年
            ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"]  // 戊癸年
        ];
        
        const tableIndex = yearGan % 5;
        const gan = monthGanTable[tableIndex][month - 1];
        
        return gan + zhi;
    }
    
    // 计算日柱（简化版）
    calculateDayGanZhi(year, month, day) {
        // 这里使用简化公式，实际应该用更精确的算法
        // 注意：这是简化版本，精确计算需要完整公式
        const baseYear = 1900;
        const baseGanZhi = "甲子";
        
        const days = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(baseYear, 0, 31)) / 86400000);
        const ganIndex = days % 10;
        const zhiIndex = days % 12;
        
        return TianGan[ganIndex] + DiZhi[zhiIndex];
    }
    
    // 计算时柱
    calculateHourGanZhi(dayGan, hour) {
        const hourZhi = DiZhi[hour];
        
        // 日上起时（五鼠遁）
        const dayGanIndex = TianGan.indexOf(dayGan.charAt(0));
        const hourGanTable = [
            ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙"], // 甲己日
            ["丙", "丁", "戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁"], // 乙庚日
            ["戊", "己", "庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"], // 丙辛日
            ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"], // 丁壬日
            ["壬", "癸", "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]  // 戊癸日
        ];
        
        const tableIndex = dayGanIndex % 5;
        const hourGan = hourGanTable[tableIndex][hour];
        
        return hourGan + hourZhi;
    }
    
    // 计算五行
    calculateWuXing(ganZhi) {
        const gan = ganZhi.charAt(0);
        const zhi = ganZhi.charAt(1);
        
        const ganIndex = TianGan.indexOf(gan);
        const ganWuXing = WuXing[ganIndex];
        
        // 地支五行简化
        const zhiWuXingMap = {
            "子": "水", "亥": "水",
            "寅": "木", "卯": "木",
            "巳": "火", "午": "火",
            "申": "金", "酉": "金",
            "辰": "土", "戌": "土", "丑": "土", "未": "土"
        };
        
        const zhiWuXing = zhiWuXingMap[zhi] || "土";
        
        return {
            gan: ganWuXing,
            zhi: zhiWuXing,
            combination: `${ganWuXing}${zhiWuXing}`
        };
    }
    
    // 计算生肖
    calculateShengXiao(year) {
        const index = (year - 4) % 12;
        return ShengXiao[index];
    }
    
    // 命主（日柱天干）
    getMingZhu(dayGanZhi) {
        const gan = dayGanZhi.charAt(0);
        const mingZhuMap = {
            "甲": "甲木", "乙": "乙木", "丙": "丙火", "丁": "丁火",
            "戊": "戊土", "己": "己土", "庚": "庚金", "辛": "辛金",
            "壬": "壬水", "癸": "癸水"
        };
        return mingZhuMap[gan] || "未知";
    }
    
    // 加载规则库
    loadRules() {
        return {
            // 年柱解释
            "甲子": "海中金，聪明好学，智勇双全",
            "乙丑": "海中金，温和诚实，勤奋努力",
            "丙寅": "炉中火，热情开朗，积极向上",
            "丁卯": "炉中火，温和体贴，富有同情心",
            "戊辰": "大林木，诚实稳重，有责任感",
            "己巳": "大林木，聪明灵活，适应力强",
            "庚午": "路旁土，正直果断，有领导力",
            "辛未": "路旁土，细致谨慎，追求完美",
            "壬申": "剑锋金，聪明机智，善于变通",
            "癸酉": "剑锋金，敏感细腻，艺术天赋",
            "甲戌": "山头火，独立自主，有创造力",
            "乙亥": "山头火，温和善良，人缘好",
            "丙子": "涧下水，聪明机敏，适应力强",
            "丁丑": "涧下水，踏实稳重，有耐心",
            "戊寅": "城头土，诚实可靠，有担当",
            "己卯": "城头土，温和体贴，善解人意",
            "庚辰": "白蜡金，正直果断，执行力强",
            "辛巳": "白蜡金，聪明细致，追求完美",
            "壬午": "杨柳木，灵活变通，适应力强",
            "癸未": "杨柳木，温和善良，有同情心",
            "甲申": "泉中水，聪明好学，智勇双全",
            "乙酉": "泉中水，温和诚实，勤奋努力",
            "丙戌": "屋上土，热情开朗，积极向上",
            "丁亥": "屋上土，温和体贴，富有同情心",
            "戊子": "霹雳火，诚实稳重，有责任感",
            "己丑": "霹雳火，聪明灵活，适应力强",
            "庚寅": "松柏木，正直果断，有领导力",
            "辛卯": "松柏木，细致谨慎，追求完美",
            "壬辰": "长流水，聪明机智，善于变通",
            "癸巳": "长流水，敏感细腻，艺术天赋",
            "甲午": "砂石金，独立自主，有创造力",
            "乙未": "砂石金，温和善良，人缘好",
            "丙申": "山下火，聪明机敏，适应力强",
            "丁酉": "山下火，踏实稳重，有耐心",
            "戊戌": "平地木，诚实可靠，有担当",
            "己亥": "平地木，温和体贴，善解人意",
            "庚子": "壁上土，正直果断，执行力强",
            "辛丑": "壁上土，聪明细致，追求完美",
            "壬寅": "金箔金，灵活变通，适应力强",
            "癸卯": "金箔金，温和善良，有同情心",
            "甲辰": "佛灯火，聪明好学，智勇双全",
            "乙巳": "佛灯火，温和诚实，勤奋努力",
            "丙午": "天河水，热情开朗，积极向上",
            "丁未": "天河水，温和体贴，富有同情心",
            "戊申": "大驿土，诚实稳重，有责任感",
            "己酉": "大驿土，聪明灵活，适应力强",
            "庚戌": "钗钏金，正直果断，有领导力",
            "辛亥": "钗钏金，细致谨慎，追求完美",
            "壬子": "桑柘木，聪明机智，善于变通",
            "癸丑": "桑柘木，敏感细腻，艺术天赋",
            "甲寅": "大溪水，独立自主，有创造力",
            "乙卯": "大溪水，温和善良，人缘好",
            "丙辰": "沙中土，聪明机敏，适应力强",
            "丁巳": "沙中土，踏实稳重，有耐心",
            "戊午": "天上火，诚实可靠，有担当",
            "己未": "天上火，温和体贴，善解人意",
            "庚申": "石榴木，正直果断，执行力强",
            "辛酉": "石榴木，聪明细致，追求完美",
            "壬戌": "大海水，灵活变通，适应力强",
            "癸亥": "大海水，温和善良，有同情心"
        };
    }
    
    // 获取解释
    getInterpretation(ganZhi) {
        return this.rules[ganZhi] || "（暂无详细解释）";
    }
    
    // 综合分析
    comprehensiveAnalysis(bazi, gender) {
        const { year, month, day, hour } = bazi;
        
        // 这里可以添加更复杂的分析逻辑
        let analysis = `您的八字为：${year} ${month} ${day} ${hour}\n\n`;
        
        // 年柱分析
        analysis += `年柱${year}：${this.getInterpretation(year)}\n`;
        
        // 月柱分析
        analysis += `月柱${month}：${this.getInterpretation(month)}\n`;
        
        // 日柱分析
        analysis += `日柱${day}：${this.getInterpretation(day)}\n`;
        
        // 时柱分析
        analysis += `时柱${hour}：${this.getInterpretation(hour)}\n\n`;
        
        // 五行分析
        const wuxingYear = this.calculateWuXing(year);
        const wuxingMonth = this.calculateWuXing(month);
        const wuxingDay = this.calculateWuXing(day);
        const wuxingHour = this.calculateWuXing(hour);
        
        analysis += `五行分析：\n`;
        analysis += `年柱五行：${wuxingYear.combination}\n`;
        analysis += `月柱五行：${wuxingMonth.combination}\n`;
        analysis += `日柱五行：${wuxingDay.combination}\n`;
        analysis += `时柱五行：${wuxingHour.combination}\n\n`;
        
        // 简单性格分析
        const dayGan = day.charAt(0);
        const personalityMap = {
            "甲": "有领导才能，积极进取，但可能过于刚强",
            "乙": "温和体贴，适应力强，但可能缺乏主见",
            "丙": "热情开朗，乐于助人，但可能急躁冲动",
            "丁": "温和细腻，富有同情心，但可能多愁善感",
            "戊": "诚实稳重，有责任感，但可能过于固执",
            "己": "温和谨慎，适应力强，但可能缺乏自信",
            "庚": "正直果断，执行力强，但可能过于严厉",
            "辛": "聪明细致，追求完美，但可能过于挑剔",
            "壬": "聪明机智，善于变通，但可能缺乏恒心",
            "癸": "敏感细腻，有艺术天赋，但可能过于敏感"
        };
        
        analysis += `性格特点：${personalityMap[dayGan] || "需要结合八字综合分析"}\n\n`;
        
        // 建议
        analysis += `建议：\n`;
        analysis += `1. 发挥自身优势，弥补不足之处\n`;
        analysis += `2. 保持积极心态，把握人生机遇\n`;
        analysis += `3. 注意身体健康，平衡工作生活\n`;
        analysis += `4. 多交良师益友，共同进步成长`;
        
        return analysis;
    }
}

// 创建全局实例
window.lunarCalculator = new LunarCalculator();