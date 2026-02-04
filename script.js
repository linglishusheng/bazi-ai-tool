// 主要功能代码
document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultSection = document.getElementById('result-section');
    const traditionalResult = document.getElementById('traditional-result');
    const modernResult = document.getElementById('modern-result');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // 标签切换功能
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // 分析按钮点击事件
    analyzeBtn.addEventListener('click', function() {
        // 获取输入值
        const year = document.getElementById('year').value.trim();
        const month = document.getElementById('month').value.trim();
        const day = document.getElementById('day').value.trim();
        const hour = document.getElementById('hour').value.trim();
        
        // 验证输入
        if (!year || !month || !day || !hour) {
            alert('请输入完整的八字信息！');
            return;
        }
        
        // 验证天干地支格式
        const lunar = new Lunar();
        const validation = lunar.validateBazi(year, month, day, hour);
        if (!validation.valid) {
            alert(validation.message);
            return;
        }
        
        // 显示结果区域
        resultSection.style.display = 'block';
        
        // 生成分析结果
        const analysisResult = analyzeBazi(year, month, day, hour);
        
        // 显示传统分析结果
        traditionalResult.innerHTML = analysisResult.traditional;
        
        // 显示现代解读结果
        modernResult.innerHTML = analysisResult.modern;
        
        // 滚动到结果区域
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // 八字分析函数
    function analyzeBazi(year, month, day, hour) {
        const lunar = new Lunar();
        
        // 获取日主和日支
        const dayMaster = lunar.getDayMaster(day);
        const dayBranch = lunar.getDayBranch(day);
        
        // 判断旺衰
        const strength = lunar.getDayMasterStrength(dayMaster, month[1], year, hour);
        
        // 获取日支十神
        const dayBranchTenGod = lunar.getTenGods(dayMaster, lunar.getDayBranchStem(dayBranch));
        
        // 分析十神分布
        const tenGodsDistribution = analyzeTenGodsDistribution(year, month, day, hour);
        
        // 分析格局
        const patternAnalysis = analyzePattern(year, month, day, hour);
        
        // 传统分析结果
        const traditionalAnalysis = generateTraditionalAnalysis(
            year, month, day, hour, 
            dayMaster, dayBranch, 
            strength, dayBranchTenGod,
            tenGodsDistribution, patternAnalysis
        );
        
        // 现代解读结果
        const modernInterpretation = generateModernInterpretation(
            year, month, day, hour,
            dayMaster, dayBranch,
            strength, dayBranchTenGod,
            tenGodsDistribution, patternAnalysis
        );
        
        return {
            traditional: traditionalAnalysis,
            modern: modernInterpretation
        };
    }
    
    // 分析十神分布
    function analyzeTenGodsDistribution(year, month, day, hour) {
        const lunar = new Lunar();
        const dayMaster = lunar.getDayMaster(day);
        
        // 统计各十神数量
        const tenGodsCount = {
            '正官': 0, '七杀': 0, '正印': 0, '偏印': 0,
            '正财': 0, '偏财': 0, '食神': 0, '伤官': 0,
            '比肩': 0, '劫财': 0
        };
        
        // 分析四柱
        const pillars = [year, month, day, hour];
        pillars.forEach(pillar => {
            const stem = pillar[0];
            const branch = pillar[1];
            
            // 天干十神
            const stemTenGod = lunar.getTenGods(dayMaster, stem);
            if (tenGodsCount.hasOwnProperty(stemTenGod)) {
                tenGodsCount[stemTenGod]++;
            }
            
            // 地支藏干十神（只取主气）
            const hiddenStems = lunar.getBranchHiddenStems(branch);
            if (hiddenStems && hiddenStems.length > 0) {
                const mainStem = hiddenStems[0];
                const branchTenGod = lunar.getTenGods(dayMaster, mainStem);
                if (tenGodsCount.hasOwnProperty(branchTenGod)) {
                    tenGodsCount[branchTenGod]++;
                }
            }
        });
        
        return tenGodsCount;
    }
    
    // 分析格局
    function analyzePattern(year, month, day, hour) {
        const lunar = new Lunar();
        const dayMaster = lunar.getDayMaster(day);
        const strength = lunar.getDayMasterStrength(dayMaster, month[1], year, hour);
        
        // 检查是否为从格
        const isCongGe = lunar.checkCongGe(year, month, day, hour);
        
        // 分析特殊格局
        let patterns = [];
        
        // 检查是否有特殊格局
        if (isCongGe) {
            patterns.push("从格");
        }
        
        // 检查其他格局（简化实现）
        const tenGodsDistribution = analyzeTenGodsDistribution(year, month, day, hour);
        
        // 伤官佩印
        if (tenGodsDistribution['伤官'] > 0 && tenGodsDistribution['正印'] > 0) {
            patterns.push("伤官佩印");
        }
        
        // 食神生财
        if (tenGodsDistribution['食神'] > 0 && tenGodsDistribution['正财'] > 0) {
            patterns.push("食神生财");
        }
        
        // 官印相生
        if (tenGodsDistribution['正官'] > 0 && tenGodsDistribution['正印'] > 0) {
            patterns.push("官印相生");
        }
        
        return patterns.length > 0 ? patterns : ["普通格局"];
    }
    
    // 生成传统分析结果
    function generateTraditionalAnalysis(year, month, day, hour, dayMaster, dayBranch, strength, dayBranchTenGod, tenGodsDistribution, patternAnalysis) {
        const lunar = new Lunar();
        
        let analysisHTML = `
            <div class="analysis-section">
                <h3>第一部分：出生时间规律的传统分析方法</h3>
                <div class="analysis-content">
                    <p>严格根据出生时间规律的传统分析方法进行专业分析：</p>
                    
                    <div class="analysis-point">
                        <strong>八字信息：</strong>
                        <p>年柱：${year}，月柱：${month}，日柱：${day}，时柱：${hour}</p>
                        <p>日主：${dayMaster}，日支：${dayBranch}，旺衰：${strength}</p>
                    </div>
                    
                    <div class="analysis-point">
                        <strong>日柱分析：</strong>
                        <p>根据您提供的日柱信息 "${day}"，日支坐下为${dayBranchTenGod}。</p>
                        <p>${getDayBranchAnalysis(dayBranchTenGod, strength)}</p>
                    </div>
                    
                    <div class="analysis-point">
                        <strong>十神分布分析：</strong>
                        <div class="ten-god-analysis">
                            ${generateTenGodsDistributionAnalysis(tenGodsDistribution)}
                        </div>
                    </div>
                    
                    <div class="analysis-point">
                        <strong>格局分析：</strong>
                        <p>${patternAnalysis.join('，')}。传统分析方法认为有${getPatternAnalysisDescription(patternAnalysis)}可能性。</p>
                    </div>
                    
                    <div class="analysis-point">
                        <strong>整体评估：</strong>
                        <p>综合以上分析，传统分析方法认为此八字有${getOverallAssessment(tenGodsDistribution, patternAnalysis, strength)}可能性。</p>
                    </div>
                </div>
            </div>
        `;
        
        return analysisHTML;
    }
    
    // 生成现代解读结果
    function generateModernInterpretation(year, month, day, hour, dayMaster, dayBranch, strength, dayBranchTenGod, tenGodsDistribution, patternAnalysis) {
        let interpretationHTML = `
            <div class="analysis-section">
                <h3>第二部分：现代人生规划解读</h3>
                <div class="analysis-content">
                    <div class="analysis-point">
                        <strong>先天特质评估：</strong>
                        <p>分析显示，您可能具备${getModernTraitAnalysis(dayBranchTenGod, strength)}的特质。这可能是您内在优势图谱的一部分，在个人发展中值得关注。</p>
                    </div>
                    
                    <div class="analysis-point">
                        <strong>事业发展建议：</strong>
                        <p>参考建议：在职业选择上，有一种可能性是${getCareerAdvice(dayBranchTenGod, tenGodsDistribution)}方向可能更适合发挥您的潜能。建议重点关注${getCareerFocus(dayBranchTenGod, patternAnalysis)}领域的发展机会。</p>
                    </div>
                    
                    <div class="analysis-point">
                        <strong>财富管理策略：</strong>
                        <p>分析显示，此八字在财务规划上需更加${getWealthAdvice(dayBranchTenGod, tenGodsDistribution)}。建议采取${getWealthStrategy(dayBranchTenGod, strength)}的财务管理方式。</p>
                    </div>
                    
                    <div class="analysis-point">
                        <strong>人际关系与健康：</strong>
                        <p>在人际关系方面，分析显示您可能${getRelationshipAnalysis(dayBranchTenGod, tenGodsDistribution)}。健康方面，建议重点关注${getHealthAdvice(dayBranchTenGod, tenGodsDistribution)}。</p>
                    </div>
                    
                    <div class="analysis-point">
                        <strong>行动与调整建议：</strong>
                        <p>基于分析，有一种可能性是通过${getActionAdvice(dayBranchTenGod, patternAnalysis)}来优化个人发展路径。建议在${getTimingAdvice(month)}阶段更加注重个人成长与能力提升。</p>
                    </div>
                </div>
            </div>
        `;
        
        return interpretationHTML;
    }
    
    // 辅助函数 - 生成十神分布分析
    function generateTenGodsDistributionAnalysis(tenGodsDistribution) {
        let analysis = '';
        const rules = window.baziRules['十神多寡分析'];
        
        for (const tenGod in tenGodsDistribution) {
            if (tenGodsDistribution[tenGod] > 0) {
                const count = tenGodsDistribution[tenGod];
                let description = '';
                
                // 根据数量判断影响
                if (count >= 3) {
                    description = `过多，${getTenGodExcessDescription(tenGod)}`;
                } else if (count === 2) {
                    description = `较多，${getTenGodModerateDescription(tenGod)}`;
                } else {
                    description = `适中，${getTenGodNormalDescription(tenGod)}`;
                }
                
                analysis += `<div class="ten-god-item"><strong>${tenGod}：</strong>出现${count}次，${description}</div>`;
            }
        }
        
        return analysis;
    }
    
    // 辅助函数 - 获取十神过多描述
    function getTenGodExcessDescription(tenGod) {
        const descriptions = {
            '正官': '官多贱，保守谨慎，容易贫困',
            '七杀': '杀多死，容易犯凶破财有灾',
            '正印': '印多孤，清高孤傲，自以为是',
            '偏印': '枭多凶，容易有慢性病或隐性疾病',
            '食神': '食多愁，容易忧愁多虑，易得抑郁症',
            '伤官': '伤多害，容易发生口舌是非官非',
            '正财': '财多愚，反应迟钝，做事举棋不定',
            '偏财': '才多劳，特别勤奋勤快，劳碌奔波',
            '比肩': '比多争，竞争激烈，容易与人争执',
            '劫财': '劫多败，容易破财，合作失败'
        };
        
        return descriptions[tenGod] || '影响较为显著';
    }
    
    // 辅助函数 - 获取十神适中描述
    function getTenGodModerateDescription(tenGod) {
        const descriptions = {
            '正官': '规则意识较强，适合稳定工作',
            '七杀': '有一定魄力，能应对压力',
            '正印': '学习能力不错，有贵人相助',
            '偏印': '思维独特，有一定灵感',
            '食神': '温和有福气，生活较为安逸',
            '伤官': '聪明有才华，但需注意言辞',
            '正财': '理财观念较好，收入稳定',
            '偏财': '有机会获得额外收入',
            '比肩': '朋友较多，适合合作',
            '劫财': '讲义气，但需注意财务'
        };
        
        return descriptions[tenGod] || '影响适中';
    }
    
    // 辅助函数 - 获取十神正常描述
    function getTenGodNormalDescription(tenGod) {
        const descriptions = {
            '正官': '有一定的规则意识',
            '七杀': '能应对一定压力',
            '正印': '有基本学习能力',
            '偏印': '思维较为灵活',
            '食神': '生活较为平和',
            '伤官': '有一定表达能力',
            '正财': '有基本理财观念',
            '偏财': '偶尔有额外机会',
            '比肩': '有一定合作能力',
            '劫财': '基本讲义气'
        };
        
        return descriptions[tenGod] || '影响一般';
    }
    
    // 其他辅助函数...
    function getDayBranchAnalysis(dayBranchTenGod, strength) {
        const rules = window.baziRules['日支十神分析'];
        if (rules && rules[dayBranchTenGod]) {
            const rule = rules[dayBranchTenGod];
            const analysis = rule.旺衰分析[strength] || rule.核心性格;
            return `传统分析方法认为有${analysis}可能性。`;
        }
        return '传统分析方法认为有平衡发展的可能性。';
    }
    
    function getPatternAnalysisDescription(patterns) {
        if (patterns.includes('从格')) {
            return '特殊格局，需按从格原则分析';
        } else if (patterns.includes('伤官佩印')) {
            return '才华与学识兼备，有望成就事业';
        } else if (patterns.includes('食神生财')) {
            return '才艺可转化为财富，生活富足';
        } else if (patterns.includes('官印相生')) {
            return '有权有印，适合公职管理';
        } else {
            return '普通格局，需结合具体环境发展';
        }
    }
    
    function getOverallAssessment(tenGodsDistribution, patterns, strength) {
        // 综合评估逻辑
        let positiveCount = 0;
        let negativeCount = 0;
        
        // 评估十神分布
        for (const tenGod in tenGodsDistribution) {
            const count = tenGodsDistribution[tenGod];
            if (['正官', '正印', '正财', '食神'].includes(tenGod) && count > 0) {
                positiveCount += count;
            } else if (['七杀', '偏印', '伤官', '劫财'].includes(tenGod) && count >= 2) {
                negativeCount += count;
            }
        }
        
        // 评估格局
        if (patterns.includes('从格') || patterns.includes('伤官佩印') || 
            patterns.includes('食神生财') || patterns.includes('官印相生')) {
            positiveCount += 2;
        }
        
        // 评估旺衰
        if (strength === '身旺') {
            positiveCount += 1;
        } else {
            negativeCount += 1;
        }
        
        if (positiveCount > negativeCount + 2) {
            return '较为积极的发展趋势';
        } else if (positiveCount < negativeCount) {
            return '需注意调整的发展趋势';
        } else {
            return '平衡发展的可能性';
        }
    }
    
    function getModernTraitAnalysis(dayBranchTenGod, strength) {
        const traits = {
            '正官': '自律性和规则意识',
            '七杀': '魄力和抗压能力',
            '正印': '学习能力和包容心',
            '偏印': '独特思维和灵感',
            '食神': '温和包容与创造力',
            '伤官': '创新思维和表达能力',
            '正财': '务实和稳定性',
            '偏财': '机会把握和资源整合',
            '比肩': '合作能力和自主性',
            '劫财': '行动力和义气'
        };
        
        const strengthModifier = strength === '身旺' ? '较强' : '有一定';
        return `${strengthModifier}的${traits[dayBranchTenGod] || '多元能力'}`;
    }
    
    function getCareerAdvice(dayBranchTenGod, tenGodsDistribution) {
        const baseAdvice = {
            '正官': '管理、行政或专业领域',
            '七杀': '挑战性、高压或创业领域',
            '正印': '教育、文化或服务行业',
            '偏印': '技术、研究或特殊技能领域',
            '食神': '创意、艺术或餐饮行业',
            '伤官': '表达、咨询或设计领域',
            '正财': '财务、会计或稳定职业',
            '偏财': '商业、投资或销售领域',
            '比肩': '团队合作或自主创业',
            '劫财': '需要行动力或资源整合'
        };
        
        let advice = baseAdvice[dayBranchTenGod] || '多元化职业路径';
        
        // 根据十神分布调整建议
        if (tenGodsDistribution['正印'] > 0) {
            advice += '，结合学习能力';
        }
        if (tenGodsDistribution['正财'] > 0) {
            advice += '，注重稳定性';
        }
        
        return advice;
    }
// 继续 script.js 中的辅助函数（接上文）

function getCareerFocus(dayBranchTenGod, patternAnalysis) {
    const focusMap = {
        '正官': '规则明确、层级分明的领域',
        '七杀': '需要魄力和决断力的领域', 
        '正印': '知识积累和传承的领域',
        '偏印': '需要独特视角和创新的领域',
        '食神': '创意表达和服务他人的领域',
        '伤官': '技术突破和个性表达的领域',
        '正财': '稳定积累和务实经营的领域',
        '偏财': '机会把握和资源整合的领域',
        '比肩': '团队合作和自主创业的领域',
        '劫财': '需要行动力和资源调配的领域'
    };
    
    let focus = focusMap[dayBranchTenGod] || '个人优势与市场需求的结合点';
    
    // 根据格局调整
    if (patternAnalysis.includes('伤官佩印')) {
        focus += '，特别适合将创意与知识结合';
    }
    if (patternAnalysis.includes('食神生财')) {
        focus += '，注重将才艺转化为实际价值';
    }
    
    return focus;
}

function getWealthAdvice(dayBranchTenGod, tenGodsDistribution) {
    if (['偏财', '伤官', '七杀'].includes(dayBranchTenGod)) {
        return '审慎规划，避免过度冒险';
    } else if (['正财', '正官', '正印'].includes(dayBranchTenGod)) {
        return '稳健为主，注重长期积累';
    } else {
        return '平衡风险与收益';
    }
}

function getWealthStrategy(dayBranchTenGod, strength) {
    const strategies = {
        '正官': '定期储蓄与稳健投资相结合',
        '七杀': '高风险高回报与保底配置平衡',
        '正印': '知识变现与稳定收入并行', 
        '偏印': '独特技能变现与多元化收入',
        '食神': '才艺变现与被动收入构建',
        '伤官': '创新项目与技术服务收入',
        '正财': '工资收入与小额投资组合',
        '偏财': '机会投资与主营业务并重',
        '比肩': '合作经营与个人能力提升',
        '劫财': '资源整合与风险控制'
    };
    
    let strategy = strategies[dayBranchTenGod] || '多元化资产配置';
    
    // 根据旺衰调整
    if (strength === '身旺') {
        strategy += '，可适当增加进取型配置';
    } else {
        strategy += '，应以防御型配置为主';
    }
    
    return strategy;
}

function getRelationshipAnalysis(dayBranchTenGod, tenGodsDistribution) {
    const analyses = {
        '正官': '重视规则和承诺，人际关系较为正式',
        '七杀': '个性较强，需要学习柔性沟通',
        '正印': '温和包容，容易获得他人信任',
        '偏印': '思维独特，需要找到志同道合的伙伴',
        '食神': '温和友善，人缘较好',
        '伤官': '直言不讳，需注意表达方式',
        '正财': '务实可靠，人际关系稳定',
        '偏财': '善于交际，朋友较多',
        '比肩': '重视朋友义气，合作能力较强',
        '劫财': '讲义气但需注意界限'
    };
    
    let analysis = analyses[dayBranchTenGod] || '具备建立良好人际关系的基础';
    
    // 根据十神分布调整
    if (tenGodsDistribution['正印'] > 0) {
        analysis += '，容易获得长辈或贵人相助';
    }
    if (tenGodsDistribution['伤官'] >= 2) {
        analysis += '，需注意言语表达，避免无意伤人';
    }
    
    return analysis;
}

function getHealthAdvice(dayBranchTenGod, tenGodsDistribution) {
    const adviceMap = {
        '正官': '压力管理，注意消化系统和睡眠质量',
        '七杀': '情绪疏导，注意意外伤害和突发疾病',
        '正印': '脾胃保养，注意营养均衡',
        '偏印': '神经系统保养，避免过度思虑',
        '食神': '体重管理，注意血糖血脂',
        '伤官': '呼吸系统保养，注意情绪波动',
        '正财': '规律作息，避免过度劳累',
        '偏财': '肾气保养，注意适度休息',
        '比肩': '肝胆系统保养，注意情绪疏导',
        '劫财': '意外防护，注意安全'
    };
    
    let advice = adviceMap[dayBranchTenGod] || '保持规律作息和适度运动';
    
    // 特殊健康提示
    if (tenGodsDistribution['偏印'] >= 2) {
        advice += '，特别关注慢性疾病的预防';
    }
    if (tenGodsDistribution['七杀'] >= 2) {
        advice += '，加强安全意识，避免高风险活动';
    }
    
    return advice;
}

function getActionAdvice(dayBranchTenGod, patternAnalysis) {
    const actions = {
        '正官': '建立系统性的工作习惯和专业能力',
        '七杀': '培养决断力和抗压能力',
        '正印': '持续学习和知识积累',
        '偏印': '发展独特技能和创造性思维',
        '食神': '培养才艺和服务他人的能力',
        '伤官': '提升表达能力和技术创新',
        '正财': '完善财务管理能力和职业技能',
        '偏财': '提升机会识别和资源整合能力',
        '比肩': '加强团队合作和领导能力',
        '劫财': '提升行动力和风险控制能力'
    };
    
    let action = actions[dayBranchTenGod] || '持续学习和个人能力提升';
    
    // 根据格局调整
    if (patternAnalysis.includes('从格')) {
        action += '，适应环境变化，灵活调整策略';
    }
    if (patternAnalysis.includes('伤官佩印')) {
        action += '，注重理论与实践的结合';
    }
    
    return action;
}

function getTimingAdvice(month) {
    const monthBranch = month[1];
    const seasonMap = {
        '寅': '春季', '卯': '春季', '辰': '春季',
        '巳': '夏季', '午': '夏季', '未': '夏季', 
        '申': '秋季', '酉': '秋季', '戌': '秋季',
        '亥': '冬季', '子': '冬季', '丑': '冬季'
    };
    
    const season = seasonMap[monthBranch] || '当前';
    return `${season}发展阶段`;
}

// 加载规则库
function loadRules() {
    // 在实际应用中，这里应该从rules.json文件加载
    // 简化版直接使用内置规则
    window.baziRules = {
        // 规则内容（简化版）
        '日支十神分析': {
            '正官': {
                '核心性格': '端正自律，重规则，责任感强，保守稳重',
                '旺衰分析': {
                    '身旺': '自律守信，领导力强；婚姻稳定，配偶为助力；事业顺遂，易得名望',
                    '身弱': '被规则束缚，焦虑内耗；配偶强势，感到压抑；怕犯错，不敢冒险'
                }
            }
            // 其他十神规则...
        },
        '十神多寡分析': [
            {'十神': '官多', '特征': '保守、谨慎、胆小怕事，容易贫困、卑贱、老实', '总结': '官多贱'},
            {'十神': '杀多', '特征': '容易犯凶、破财、有灾，严重容易死亡或六亲早逝', '总结': '杀多死'}
            // 其他规则...
        ]
    };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadRules();
    // 其他初始化代码...
});
