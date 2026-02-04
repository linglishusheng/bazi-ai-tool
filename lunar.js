// 八字计算库 - 完整版
class Lunar {
    constructor() {
        this.HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        this.EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        
        // 地支藏干表（主气）
        this.BRANCH_HIDDEN_STEMS = {
            '子': ['癸'],
            '丑': ['己', '癸', '辛'],
            '寅': ['甲', '丙', '戊'],
            '卯': ['乙'],
            '辰': ['戊', '乙', '癸'],
            '巳': ['丙', '庚', '戊'],
            '午': ['丁', '己'],
            '未': ['己', '丁', '乙'],
            '申': ['庚', '壬', '戊'],
            '酉': ['辛'],
            '戌': ['戊', '辛', '丁'],
            '亥': ['壬', '甲']
        };
        
        // 五行表
        this.FIVE_ELEMENTS = {
            '甲': '木', '乙': '木', '丙': '火', '丁': '火', 
            '戊': '土', '己': '土', '庚': '金', '辛': '金', 
            '壬': '水', '癸': '水'
        };
        
        // 地支五行
        this.BRANCH_ELEMENTS = {
            '寅': '木', '卯': '木', '巳': '火', '午': '火',
            '申': '金', '酉': '金', '亥': '水', '子': '水',
            '辰': '土', '戌': '土', '丑': '土', '未': '土'
        };
    }
    
    // 验证八字格式
    validateBazi(year, month, day, hour) {
        if (!year || !month || !day || !hour) {
            return { valid: false, message: '请输入完整的八字信息' };
        }
        
        if (year.length !== 2 || month.length !== 2 || day.length !== 2 || hour.length !== 2) {
            return { valid: false, message: '每柱应为两个字，例如：甲子' };
        }
        
        // 检查天干地支是否有效
        for (let pillar of [year, month, day, hour]) {
            const stem = pillar[0];
            const branch = pillar[1];
            
            if (!this.HEAVENLY_STEMS.includes(stem) || !this.EARTHLY_BRANCHES.includes(branch)) {
                return { valid: false, message: `"${pillar}" 不是有效的天干地支组合` };
            }
        }
        
        return { valid: true, message: '八字格式正确' };
    }
    
    // 获取日主（日柱的天干）
    getDayMaster(dayPillar) {
        return dayPillar[0];
    }
    
    // 获取日支（日柱的地支）
    getDayBranch(dayPillar) {
        return dayPillar[1];
    }
    
    // 获取日支对应的天干（用于判断日支十神）
    getDayBranchStem(dayBranch) {
        const hiddenStems = this.BRANCH_HIDDEN_STEMS[dayBranch];
        return hiddenStems ? hiddenStems[0] : null;
    }
    
    // 判断日主旺衰（完整版）
    getDayMasterStrength(dayMaster, monthBranch, yearPillar, hourPillar) {
        // 计算五行力量
        let strengthScore = 0;
        
        // 月支对日主的影响最大（得令）
        const monthElement = this.BRANCH_ELEMENTS[monthBranch];
        const dayMasterElement = this.FIVE_ELEMENTS[dayMaster];
        
        // 月令生助日主（同五行或生我）
        if (monthElement === dayMasterElement) {
            strengthScore += 2; // 得令
        } else if (this.isGeneratingElement(monthElement, dayMasterElement)) {
            strengthScore += 1; // 得生
        } else if (this.isControllingElement(monthElement, dayMasterElement)) {
            strengthScore -= 2; // 不得令且受克
        } else if (this.isWeakeningElement(monthElement, dayMasterElement)) {
            strengthScore -= 1; // 泄气
        }
        
        // 年柱影响
        const yearStemElement = this.FIVE_ELEMENTS[yearPillar[0]];
        const yearBranchElement = this.BRANCH_ELEMENTS[yearPillar[1]];
        
        if (yearStemElement === dayMasterElement) strengthScore += 0.5;
        if (yearBranchElement === dayMasterElement) strengthScore += 0.5;
        if (this.isGeneratingElement(yearStemElement, dayMasterElement)) strengthScore += 0.5;
        if (this.isGeneratingElement(yearBranchElement, dayMasterElement)) strengthScore += 0.5;
        
        // 时柱影响
        const hourStemElement = this.FIVE_ELEMENTS[hourPillar[0]];
        const hourBranchElement = this.BRANCH_ELEMENTS[hourPillar[1]];
        
        if (hourStemElement === dayMasterElement) strengthScore += 0.5;
        if (hourBranchElement === dayMasterElement) strengthScore += 0.5;
        if (this.isGeneratingElement(hourStemElement, dayMasterElement)) strengthScore += 0.5;
        if (this.isGeneratingElement(hourBranchElement, dayMasterElement)) strengthScore += 0.5;
        
        // 判断旺衰
        if (strengthScore >= 1.5) return '身旺';
        if (strengthScore <= -1.5) return '身弱';
        return '中和';
    }
    
    // 判断五行相生关系
    isGeneratingElement(sourceElement, targetElement) {
        const generatingRelations = {
            '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
        };
        return generatingRelations[sourceElement] === targetElement;
    }
    
    // 判断五行相克关系
    isControllingElement(sourceElement, targetElement) {
        const controllingRelations = {
            '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
        };
        return controllingRelations[sourceElement] === targetElement;
    }
    
    // 判断五行泄气关系（被生）
    isWeakeningElement(sourceElement, targetElement) {
        const weakeningRelations = {
            '木': '水', '水': '金', '金': '土', '土': '火', '火': '木'
        };
        return weakeningRelations[sourceElement] === targetElement;
    }
    
    // 获取十神关系
    getTenGods(dayMaster, targetStem) {
        const stemIndex = this.HEAVENLY_STEMS.indexOf(dayMaster);
        const targetIndex = this.HEAVENLY_STEMS.indexOf(targetStem);
        
        if (stemIndex === -1 || targetIndex === -1) return '未知';
        
        // 计算十神关系
        const difference = (targetIndex - stemIndex + 10) % 10;
        
        const tenGodsMap = {
            0: '比肩',
            1: '劫财',
            2: '食神',
            3: '伤官',
            4: '偏财',
            5: '正财',
            6: '七杀',
            7: '正官',
            8: '偏印',
            9: '正印'
        };
        
        return tenGodsMap[difference] || '未知';
    }
    
    // 获取地支藏干
    getBranchHiddenStems(branch) {
        return this.BRANCH_HIDDEN_STEMS[branch] || [];
    }
    
    // 检查是否为从格
    checkCongGe(year, month, day, hour) {
// 检查是否为从格
    checkCongGe(year, month, day, hour) {
        const dayMaster = this.getDayMaster(day);
        const strength = this.getDayMasterStrength(dayMaster, month[1], year, hour);
        
        // 简化版从格判断
        // 实际应从格判断更复杂，需要看全局生扶克泄情况
        if (strength === '身弱') {
            // 检查是否全局克泄耗多而无生扶
            const pillars = [year, month, day, hour];
            let helpCount = 0;  // 生扶日主的力量
            let controlCount = 0; // 克泄耗日主的力量
            
            for (let pillar of pillars) {
                const stem = pillar[0];
                const branch = pillar[1];
                
                // 天干十神
                const stemTenGod = this.getTenGods(dayMaster, stem);
                if (['正印', '偏印', '比肩', '劫财'].includes(stemTenGod)) {
                    helpCount++;
                } else {
                    controlCount++;
                }
                
                // 地支藏干
                const hiddenStems = this.getBranchHiddenStems(branch);
                for (let hiddenStem of hiddenStems) {
                    const branchTenGod = this.getTenGods(dayMaster, hiddenStem);
                    if (['正印', '偏印', '比肩', '劫财'].includes(branchTenGod)) {
                        helpCount += 0.5;
                    } else {
                        controlCount += 0.5;
                    }
                }
            }
            
            // 如果克泄耗力量远大于生扶力量，可能为从格
            if (controlCount > helpCount * 2) {
                return true;
            }
        }
        
        return false;
    }
    
    // 获取天干五行
    getStemElement(stem) {
        return this.FIVE_ELEMENTS[stem] || '未知';
    }
    
    // 获取地支五行
    getBranchElement(branch) {
        return this.BRANCH_ELEMENTS[branch] || '未知';
    }
    
    // 判断地支相冲
    checkClash(branch1, branch2) {
        const clashes = {
            '子': '午', '午': '子',
            '丑': '未', '未': '丑',
            '寅': '申', '申': '寅',
            '卯': '酉', '酉': '卯',
            '辰': '戌', '戌': '辰',
            '巳': '亥', '亥': '巳'
        };
        return clashes[branch1] === branch2;
    }
    
    // 判断地支相合
    checkHarmony(branch1, branch2) {
        const harmonies = {
            '子': '丑', '丑': '子',
            '寅': '亥', '亥': '寅',
            '卯': '戌', '戌': '卯',
            '辰': '酉', '酉': '辰',
            '巳': '申', '申': '巳',
            '午': '未', '未': '午'
        };
        return harmonies[branch1] === branch2;
    }
    
    // 判断地支相刑
    checkPunishment(branch1, branch2) {
        const punishments = {
            '寅': ['巳', '申'], '巳': ['申', '寅'], '申': ['寅', '巳'],
            '丑': ['戌', '未'], '戌': ['未', '丑'], '未': ['丑', '戌'],
            '子': '卯', '卯': '子',
            '辰': '辰', '午': '午', '酉': '酉', '亥': '亥'
        };
        
        if (Array.isArray(punishments[branch1])) {
            return punishments[branch1].includes(branch2);
        }
        return punishments[branch1] === branch2;
    }
    
    // 判断地支相害
    checkHarm(branch1, branch2) {
        const harms = {
            '子': '未', '未': '子',
            '丑': '午', '午': '丑',
            '寅': '巳', '巳': '寅',
            '卯': '辰', '辰': '卯',
            '申': '亥', '亥': '申',
            '酉': '戌', '戌': '酉'
        };
        return harms[branch1] === branch2;
    }
    
    // 获取驿马星
    getTravelingHorse(branch) {
        const horses = {
            '申': '寅', '子': '寅', '辰': '寅',
            '寅': '申', '午': '申', '戌': '申',
            '巳': '亥', '酉': '亥', '丑': '亥',
            '亥': '巳', '卯': '巳', '未': '巳'
        };
        return horses[branch] || '无';
    }
    
    // 获取桃花星
    getPeachBlossom(branch) {
        const blossoms = {
            '申': '酉', '子': '酉', '辰': '酉',
            '寅': '午', '午': '卯', '戌': '卯',
            '巳': '午', '酉': '子', '丑': '午',
            '亥': '子', '卯': '子', '未': '子'
        };
        return blossoms[branch] || '无';
    }
    
    // 判断是否坐四桃花
    isFourPeachBlossom(branch) {
        return ['子', '午', '卯', '酉'].includes(branch);
    }
    
    // 判断是否坐四墓库
    isFourTomb(branch) {
        return ['辰', '戌', '丑', '未'].includes(branch);
    }
    
    // 判断是否坐四驿马
    isFourTravelingHorse(branch) {
        return ['寅', '申', '巳', '亥'].includes(branch);
    }
    
    // 获取天干相合
    getStemCombination(stem1, stem2) {
        const combinations = {
            '甲': '己', '己': '甲',
            '乙': '庚', '庚': '乙',
            '丙': '辛', '辛': '丙',
            '丁': '壬', '壬': '丁',
            '戊': '癸', '癸': '戊'
        };
        return combinations[stem1] === stem2;
    }
    
    // 获取天干相冲
    getStemClash(stem1, stem2) {
        const clashes = {
            '甲': '庚', '庚': '甲',
            '乙': '辛', '辛': '乙',
            '丙': '壬', '壬': '丙',
            '丁': '癸', '癸': '丁'
        };
        return clashes[stem1] === stem2;
    }
    
    // 计算八字中阳干阳支数量
    countYangStemsBranches(year, month, day, hour) {
        const yangStems = ['甲', '丙', '戊', '庚', '壬'];
        const yangBranches = ['子', '寅', '辰', '午', '申', '戌'];
        
        let count = 0;
        const pillars = [year, month, day, hour];
        
        for (let pillar of pillars) {
            const stem = pillar[0];
            const branch = pillar[1];
            
            if (yangStems.includes(stem)) count++;
            if (yangBranches.includes(branch)) count++;
        }
        
        return count;
    }
    
    // 计算八字中阴干阴支数量
    countYinStemsBranches(year, month, day, hour) {
        const yinStems = ['乙', '丁', '己', '辛', '癸'];
        const yinBranches = ['丑', '卯', '巳', '未', '酉', '亥'];
        
        let count = 0;
        const pillars = [year, month, day, hour];
        
        for (let pillar of pillars) {
            const stem = pillar[0];
            const branch = pillar[1];
            
            if (yinStems.includes(stem)) count++;
            if (yinBranches.includes(branch)) count++;
        }
        
        return count;
    }
    
    // 检查是否有特殊格局（简化版）
    checkSpecialPatterns(year, month, day, hour) {
        const patterns = [];
        const dayMaster = this.getDayMaster(day);
        const tenGodsDistribution = this.analyzeTenGodsDistribution(year, month, day, hour);
        
        // 伤官佩印
        if (tenGodsDistribution['伤官'] > 0 && tenGodsDistribution['正印'] > 0) {
            patterns.push('伤官佩印');
        }
        
        // 食神生财
        if (tenGodsDistribution['食神'] > 0 && tenGodsDistribution['正财'] > 0) {
            patterns.push('食神生财');
        }
        
        // 官印相生
        if (tenGodsDistribution['正官'] > 0 && tenGodsDistribution['正印'] > 0) {
            patterns.push('官印相生');
        }
        
        // 杀印相生
        if (tenGodsDistribution['七杀'] > 0 && tenGodsDistribution['正印'] > 0) {
            patterns.push('杀印相生');
        }
        
        // 从儿格（食伤极旺）
        if (tenGodsDistribution['食神'] + tenGodsDistribution['伤官'] >= 3) {
            patterns.push('从儿格');
        }
        
        return patterns;
    }
    
    // 分析十神分布（供内部使用）
    analyzeTenGodsDistribution(year, month, day, hour) {
        const dayMaster = this.getDayMaster(day);
        const tenGodsCount = {
            '正官': 0, '七杀': 0, '正印': 0, '偏印': 0,
            '正财': 0, '偏财': 0, '食神': 0, '伤官': 0,
            '比肩': 0, '劫财': 0
        };
        
        const pillars = [year, month, day, hour];
        pillars.forEach(pillar => {
            const stem = pillar[0];
            const branch = pillar[1];
            
            // 天干十神
            const stemTenGod = this.getTenGods(dayMaster, stem);
            if (tenGodsCount.hasOwnProperty(stemTenGod)) {
                tenGodsCount[stemTenGod]++;
            }
            
            // 地支藏干十神（只取主气）
            const hiddenStems = this.getBranchHiddenStems(branch);
            if (hiddenStems && hiddenStems.length > 0) {
                const mainStem = hiddenStems[0];
                const branchTenGod = this.getTenGods(dayMaster, mainStem);
                if (tenGodsCount.hasOwnProperty(branchTenGod)) {
                    tenGodsCount[branchTenGod]++;
                }
            }
        });
        
        return tenGodsCount;
    }
    
    // 检查四凶神无制化
    checkFourEvilGods(tenGodsDistribution) {
        const evilGods = ['七杀', '偏印', '伤官', '劫财'];
        let evilCount = 0;
        let controlled = false;
        
        for (let god of evilGods) {
            if (tenGodsDistribution[god] > 0) {
                evilCount++;
            }
        }
        
        // 简化判断：如果有印星或食神，则认为有制化
        if (tenGodsDistribution['正印'] > 0 || tenGodsDistribution['食神'] > 0) {
            controlled = true;
        }
        
        return {
            evilCount: evilCount,
            isControlled: controlled,
            description: evilCount >= 2 && !controlled ? '四凶神多无制化，需注意性格调整' : '凶神有制，相对平衡'
        };
    }
}

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Lunar;
}
