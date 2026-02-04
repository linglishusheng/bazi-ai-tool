// 修复版八字计算和AI分析
document.addEventListener('DOMContentLoaded', function() {
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

    // 天干地支定义
    const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const SHENGXIAO = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

    // 修复版八字计算函数
    function calculateBazi() {
        const birthdate = elements.birthdate.value;
        const birthtime = parseInt(elements.birthtime.value);
        
        if (!birthdate) {
            alert('请输入出生日期');
            return;
        }

        try {
            const [year, month, day] = birthdate.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            
            // 计算年柱（简化算法，实际应该考虑立春）
            const yearGanIndex = (year - 4) % 10;
            const yearZhiIndex = (year - 4) % 12;
            const yearZhu = TIANGAN[yearGanIndex] + DIZHI[yearZhiIndex];
            
            // 计算月柱（简化算法）
            const monthZhiIndex = (month + 1) % 12;
            const monthGanIndex = (yearGanIndex * 2 + monthZhiIndex) % 10;
            const monthZhu = TIANGAN[monthGanIndex] + DIZHI[monthZhiIndex];
            
            // 计算日柱（简化算法，使用固定公式）
            const baseDate = new Date(1900, 0, 31); // 1900年1月31日是甲子日
            const daysDiff = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
            const dayGanIndex = daysDiff % 10;
            const dayZhiIndex = daysDiff % 12;
            const dayZhu = TIANGAN[dayGanIndex] + DIZHI[dayZhiIndex];
            
            // 计算时柱
            const hourGanIndex = (dayGanIndex * 2 + birthtime) % 10;
            const hourZhu = TIANGAN[hourGanIndex] + DIZHI[birthtime];
            
            // 计算生肖
            const shengxiao = SHENGXIAO[(year - 4) % 12];
            
            // 命主（日干）
            const mingzhuMap = {
                "甲": "甲木", "乙": "乙木", "丙": "丙火", "丁": "丁火",
                "戊": "戊土", "己": "己土", "庚": "庚金", "辛": "辛金",
                "壬": "壬水", "癸": "癸水"
            };
            const mingzhu = mingzhuMap[dayZhu.charAt(0)] || "未知";

            // 显示结果
            elements.yearZhu.textContent = yearZhu;
            elements.monthZhu.textContent = monthZhu;
            elements.dayZhu.textContent = dayZhu;
            elements.hourZhu.textContent = hourZhu;
            elements.shengxiao.textContent = shengxiao;
            elements.mingzhu.textContent = mingzhu;
            
            elements.resultSection.style.display = 'block';
            
            // 存储数据供AI分析
            window.currentBazi = {
                year: yearZhu, month: monthZhu, day: dayZhu, hour: hourZhu,
                shengxiao: shengxiao, mingzhu: mingzhu,
                gender: elements.gender.value
            };
            
            showMessage('八字
