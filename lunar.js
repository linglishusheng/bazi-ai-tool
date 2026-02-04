// 简化的农历和八字计算库
// 注意：这是一个简化版本，实际应用需要更精确的算法

class LunarCalendar {
    constructor() {
        this.HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        this.EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        this.MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
    }
    
    // 计算年柱
    getYearColumn(year) {
        const stemIndex = (year - 4) % 10;
        const branchIndex = (year - 4) % 12;
        return {
            stem: this.HEAVENLY_STEMS[stemIndex],
            branch: this.EARTHLY_BRANCHES[branchIndex],
            value: this.HEAVENLY_STEMS[stemIndex] + this.EARTHLY_BRANCHES[branchIndex]
        };
    }
    
    // 计算月柱（简化版）
    getMonthColumn(year, month) {
        // 实际应用需要结合节气精确计算
        const yearColumn = this.getYearColumn(year);
        const stemIndex = (yearColumn.stem * 2 + month) % 10;
        const branchIndex = (month + 1) % 12;
        
        return {
            stem: this.HEAVENLY_STEMS[stemIndex],
            branch: this.EARTHLY_BRANCHES[branchIndex],
            value: this.HEAVENLY_STEMS[stemIndex] + this.EARTHLY_BRANCHES[branchIndex]
        };
    }
    
    // 计算日柱（简化版）
    getDayColumn(year, month, day) {
        // 实际应用需要复杂计算，这里使用简化公式
        const baseDate = new Date(1900, 0, 31);
        const currentDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((currentDate - baseDate) / (24 * 60 * 60 * 1000));
        
        const stemIndex = diffDays % 10;
        const branchIndex = diffDays % 12;
        
        return {
            stem: this.HEAVENLY_STEMS[stemIndex],
            branch: this.EARTHLY_BRANCHES[branchIndex],
            value: this.HEAVENLY_STEMS[stemIndex] + this.EARTHLY_BRANCHES[branchIndex]
        };
    }
    
    // 计算时柱
    getHourColumn(dayColumn, hour) {
        // 日上起时法
        const dayStem = dayColumn.stem;
        const dayStemIndex = this.HEAVENLY_STEMS.indexOf(dayStem);
        
        // 甲己还加甲，乙庚丙作初...
        const startStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const startIndex = startStems.indexOf(dayStem);
        
        const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
        const hourStemIndex = (startIndex * 2 + hourBranchIndex) % 10;
        
        return {
            stem: this.HEAVENLY_STEMS[hourStemIndex],
            branch: this.EARTHLY_BRANCHES[hourBranchIndex],
            value: this.HEAVENLY_STEMS[hourStemIndex] + this.EARTHLY_BRANCHES[hourBranchIndex]
        };
    }
    
    // 获取完整八字
    getBazi(year, month, day, hour) {
        const yearColumn = this.getYearColumn(year);
        const monthColumn = this.getMonthColumn(year, month);
        const dayColumn = this.getDayColumn(year, month, day);
        const hourColumn = this.getHourColumn(dayColumn, hour);
        
        return {
            year: yearColumn,
            month: monthColumn,
            day: dayColumn,
            hour: hourColumn,
            full: yearColumn.value + monthColumn.value + dayColumn.value + hourColumn.value
        };
    }
}

// 创建全局实例
const lunarCalendar = new LunarCalendar();
