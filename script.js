// 规则库 - 简化版，实际应用中需要更完整的规则
const rules = {
    // 原则1：日支坐下十神的属性
    dayBranchTenGod: {
        "正官": {
            "corePersonality": "端正自律，重规则，责任感强，保守稳重",
            "marriage": {
                "male": "妻子贤惠、持家、有教养",
                "female": "丈夫稳重、有地位、但可能古板；婚姻稳定，但少激情"
            },
            "careerWealth": "适合公职、管理、法律；收入稳定，不喜冒险",
            "health": "注意压力大导致失眠、消化问题",
            "strongBody": {
                "positive": "自律守信，领导力强，婚姻稳定，配偶为助力，事业顺遂，易得名望",
                "negative": ""
            },
            "weakBody": {
                "positive": "",
                "negative": "被规则束缚，焦虑内耗，配偶强势，感到压抑，怕犯错，不敢冒险"
            }
        },
        // 其他十神规则...
    },
    
    // 原则2：八字中哪个十神多
    tenGodDominance: {
        "官多贱": "保守、谨慎、胆小怕事，容易贫困、卑贱、老实",
        "杀多死": "容易犯凶、破财、有灾，严重容易死亡或六亲早逝",
        // 其他规则...
    },
    
    // 原则3：天干十神看外在性格
    heavenlyStemPersonality: {
        "食神": "外在墩厚老实，好说话，给人感觉实在，端正",
        // 其他规则...
    },
    
    // 其他原则...
};

// 八字分析主函数
function analyzeBazi() {
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const hour = parseInt(document.getElementById('birthHour').value);
    const isLunar = document.getElementById('isLunar').checked;
    
    try {
        // 使用lunar.js计算八字
        let solarDate;
        if (isLunar) {
            // 农历转公历
            const lunar = Lunar.fromYmd(year, month, day);
            solarDate = lunar.getSolar();
        } else {
            solarDate = Solar.fromYmd(year, month, day);
        }
        
        // 计算八字
        const bazi = getBazi(solarDate, hour);
        
        // 显示八字信息
        displayBazi(bazi);
        
        // 分析八字
        const analysis = performAnalysis(bazi);
        
        // 显示分析结果
        displayAnalysis(analysis);
        
        // 显示结果区域
        document.getElementById('resultSection').style.display = 'block';
    } catch (error) {
        alert('输入信息有误，请检查后重新输入：' + error.message);
    }
}

// 获取八字信息
function getBazi(solarDate, hour) {
    // 这里需要根据lunar.js的API获取八字
    // 简化实现，实际需要调用lunar.js的具体方法
    return {
        year: { heavenly: "甲", earthly: "子" },
        month: { heavenly: "乙", earthly: "丑" },
        day: { heavenly: "丙", earthly: "寅" },
        hour: { heavenly: "丁", earthly: "卯" },
        // 其他八字信息...
    };
}

// 执行八字分析
function performAnalysis(bazi) {
    // 这里需要根据规则库进行详细分析
    // 简化实现，实际需要调用各个规则函数
    
    const traditionalAnalysis = generateTraditionalAnalysis(bazi);
    const modernAnalysis = generateModernAnalysis(traditionalAnalysis);
    
    return {
        traditional: traditionalAnalysis,
        modern: modernAnalysis
    };
}

// 生成传统分析
function generateTraditionalAnalysis(bazi) {
    let analysis = "<p>严格根据出生时间规律的传统分析方法进行专业分析：</p>";
    
    // 分析日支坐下十神
    analysis += "<h4>日支坐下十神分析：</h4>";
    analysis += "<p>根据分析原则，日支为" + bazi.day.earthly + "，对应十神为...</p>";
    
    // 分析十神多寡
    analysis += "<h4>十神分布分析：</h4>";
    analysis += "<p>八字中...十神出现较多，传统分析方法认为有...可能性。</p>";
    
    // 分析天干十神
    analysis += "<h4>天干十神外在性格分析：</h4>";
    analysis += "<p>天干透出...十神，主...</p>";
    
    // 其他分析...
    
    return analysis;
}

// 生成现代人生规划解读
function generateModernAnalysis(traditionalAnalysis) {
    let analysis = "<p>本部分将传统分析转化为现代人生规划视角，侧重于趋势分析和建议。出生时间规律作为一种文化符号系统，提供个人发展的参考框架，而非绝对预测。以下解读基于统计模型和传统文化智慧的现代化应用，强调可能性和个体主动性。</p>";
    
    // 将传统分析转化为现代语言
    analysis += "<h4>先天特质与后天发展的整合性评估：</h4>";
    analysis += "<p>分析显示，您的出生信息呈现...特质，这可能是您...</p>";
    
    analysis += "<h4>内在优势图谱：</h4>";
    analysis += "<p>参考建议：将传统分析中的...解读为个人的核心天赋...和决策偏好...</p>";
    
    analysis += "<h4>关键领域建议：</h4>";
    analysis += "<p>在财富领域，有一种可能性是...建议重点关注...</p>";
    analysis += "<p>在事业领域，分析显示...这可能是发挥...潜能的窗口期</p>";
    
    analysis += "<h4>行动与调整建议：</h4>";
    analysis += "<p>基于分析，建议您可以考虑...的环境调整或习惯培养</p>";
    
    analysis += "<p><em>本解读基于传统文化符号系统及大量案例的统计模型进行趋势分析，仅供参考，不构成任何决策依据。请您理性看待，结合现实情况独立判断。</em></p>";
    
    return analysis;
}

// 显示八字信息
function displayBazi(bazi) {
    const baziDisplay = document.getElementById('baziDisplay');
    baziDisplay.innerHTML = `
        <p>年柱：${bazi.year.heavenly}${bazi.year.earthly}</p>
        <p>月柱：${bazi.month.heavenly}${bazi.month.earthly}</p>
        <p>日柱：${bazi.day.heavenly}${bazi.day.earthly}</p>
        <p>时柱：${bazi.hour.heavenly}${bazi.hour.earthly}</p>
    `;
}

// 显示分析结果
function displayAnalysis(analysis) {
    document.getElementById('traditionalAnalysis').innerHTML = analysis.traditional;
    document.getElementById('modernAnalysis').innerHTML = analysis.modern;
}

// 页面加载完成后绑定事件
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('analyzeBtn').addEventListener('click', analyzeBazi);
});
