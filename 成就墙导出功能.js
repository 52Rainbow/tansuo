// 数字秘境 - 成就墙导出功能
// 在游戏中添加此功能可以导出成就墙为图片

// 成就墙导出功能
function exportAchievementWall() {
    // 创建canvas元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    canvas.width = 800;
    canvas.height = 600;
    
    // 设置背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a12');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 添加边框
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // 标题
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 数字秘境 - 成就墙', canvas.width / 2, 60);
    
    // 副标题
    ctx.font = '16px "Courier New", monospace';
    ctx.fillStyle = '#00cc7a';
    const achievementCount = gameState.achievements.length;
    const totalAchievements = achievementsData.length;
    const percentage = Math.round((achievementCount / totalAchievements) * 100);
    ctx.fillText(`完成度: ${achievementCount}/${totalAchievements} (${percentage}%)`, canvas.width / 2, 90);
    
    // 绘制成就格子
    const gridCols = 5;
    const gridRows = 3;
    const achievementSize = 80;
    const spacing = 20;
    const startX = (canvas.width - (gridCols * achievementSize + (gridCols - 1) * spacing)) / 2;
    const startY = 120;
    
    let achievementIndex = 0;
    
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (achievementIndex >= achievementsData.length) break;
            
            const achievement = achievementsData[achievementIndex];
            const isUnlocked = gameState.achievements.includes(achievement.id);
            
            const x = startX + col * (achievementSize + spacing);
            const y = startY + row * (achievementSize + spacing);
            
            // 绘制成就背景
            ctx.save();
            if (isUnlocked) {
                // 已解锁 - 金色渐变
                const gradient = ctx.createRadialGradient(x + achievementSize/2, y + achievementSize/2, 0, 
                                                         x + achievementSize/2, y + achievementSize/2, achievementSize/2);
                gradient.addColorStop(0, '#ffd700');
                gradient.addColorStop(1, '#ffed4e');
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#ffd700';
            } else {
                // 未解锁 - 灰色
                const gradient = ctx.createRadialGradient(x + achievementSize/2, y + achievementSize/2, 0, 
                                                         x + achievementSize/2, y + achievementSize/2, achievementSize/2);
                gradient.addColorStop(0, '#444');
                gradient.addColorStop(1, '#222');
                ctx.fillStyle = gradient;
                ctx.strokeStyle = '#666';
            }
            
            // 绘制圆形背景
            ctx.beginPath();
            ctx.arc(x + achievementSize/2, y + achievementSize/2, achievementSize/2 - 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 绘制成就图标
            ctx.font = '24px "Courier New", monospace';
            ctx.fillStyle = isUnlocked ? '#333' : '#999';
            ctx.textAlign = 'center';
            ctx.fillText(achievement.icon, x + achievementSize/2, y + achievementSize/2 + 8);
            
            // 绘制难度星级
            const stars = '⭐'.repeat(achievement.difficulty);
            ctx.font = '8px "Courier New", monospace';
            ctx.fillText(stars, x + achievementSize/2, y + achievementSize - 8);
            
            ctx.restore();
            achievementIndex++;
        }
    }
    
    // 添加底部信息
    ctx.fillStyle = '#00ff88';
    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('数字秘境 - 终极科技解谜之旅', canvas.width / 2, canvas.height - 40);
    ctx.fillText(`导出时间: ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height - 20);
    
    return canvas;
}

// 下载成就墙图片
function downloadAchievementWall() {
    try {
        const canvas = exportAchievementWall();
        
        // 创建下载链接
        const link = document.createElement('a');
        link.download = `数字秘境_成就墙_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showMessage('🎉 成就墙导出成功！', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showMessage('❌ 导出失败，请重试', 'error');
    }
}

// 分享成就墙（生成分享文本）
function shareAchievementWall() {
    const achievementCount = gameState.achievements.length;
    const totalAchievements = achievementsData.length;
    const percentage = Math.round((achievementCount / totalAchievements) * 100);
    
    // 生成成就emoji网格
    let achievementGrid = '';
    const gridCols = 5;
    
    for (let i = 0; i < achievementsData.length; i++) {
        if (i > 0 && i % gridCols === 0) {
            achievementGrid += '\n';
        }
        
        const achievement = achievementsData[i];
        const isUnlocked = gameState.achievements.includes(achievement.id);
        achievementGrid += isUnlocked ? achievement.icon : '🔒';
    }
    
    const shareText = `🏆 我在《数字秘境》中的成就墙！
    
完成度: ${achievementCount}/${totalAchievements} (${percentage}%)

${achievementGrid}

🎮 数字秘境 - 终极科技解谜之旅
⚡ 探索数字世界，挑战科技谜题！`;

    // 复制到剪贴板
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showMessage('📋 成就墙文本已复制到剪贴板！', 'success');
        }).catch(() => {
            showShareModal(shareText);
        });
    } else {
        showShareModal(shareText);
    }
}

// 显示分享模态框
function showShareModal(shareText) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📤 分享成就墙</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div>
                <p>复制以下文本分享你的成就：</p>
                <textarea style="width: 100%; height: 200px; background: #1a1a2e; color: #00ff88; border: 1px solid #00ff88; border-radius: 5px; padding: 10px; font-family: 'Courier New', monospace;" readonly>${shareText}</textarea>
                <div style="margin-top: 15px; text-align: center;">
                    <button class="game-btn" onclick="
                        this.closest('.modal').querySelector('textarea').select();
                        document.execCommand('copy');
                        showMessage('📋 已复制到剪贴板！', 'success');
                        this.closest('.modal').remove();
                    ">📋 复制文本</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 导出详细成就报告
function exportAchievementReport() {
    const achievementCount = gameState.achievements.length;
    const totalAchievements = achievementsData.length;
    const percentage = Math.round((achievementCount / totalAchievements) * 100);
    
    let report = `# 数字秘境 - 个人成就报告

## 📊 总体统计
- **完成度**: ${achievementCount}/${totalAchievements} (${percentage}%)
- **游戏时间**: ${getGameTimeString()}
- **导出时间**: ${new Date().toLocaleString()}

## 🏆 已获得成就

`;

    // 按类型分组显示成就
    const achievementsByType = {
        'basic': [],
        'exploration': [],
        'collection': [],
        'skill': [],
        'special': [],
        'master': []
    };
    
    gameState.achievements.forEach(achievementId => {
        const achievement = achievementsData.find(a => a.id === achievementId);
        if (achievement) {
            const type = achievement.type || 'basic';
            achievementsByType[type].push(achievement);
        }
    });
    
    const typeNames = {
        'basic': '基础成就',
        'exploration': '探索成就',
        'collection': '收集成就',
        'skill': '技能成就',
        'special': '特殊成就',
        'master': '大师成就'
    };
    
    Object.keys(typeNames).forEach(type => {
        if (achievementsByType[type].length > 0) {
            report += `### ${typeNames[type]}\n\n`;
            achievementsByType[type].forEach(achievement => {
                const stars = '⭐'.repeat(achievement.difficulty);
                report += `- **${achievement.icon} ${achievement.name}** ${stars}\n  ${achievement.description}\n\n`;
            });
        }
    });
    
    // 未获得的成就
    const unlockedAchievements = achievementsData.filter(a => !gameState.achievements.includes(a.id));
    if (unlockedAchievements.length > 0) {
        report += `## 🔒 待解锁成就\n\n`;
        unlockedAchievements.forEach(achievement => {
            if (!achievement.hidden) {
                const stars = '⭐'.repeat(achievement.difficulty);
                report += `- **${achievement.icon} ${achievement.name}** ${stars}\n  ${achievement.description}\n\n`;
            }
        });
        
        const hiddenCount = unlockedAchievements.filter(a => a.hidden).length;
        if (hiddenCount > 0) {
            report += `### 隐藏成就\n还有 ${hiddenCount} 个隐藏成就等待发现...\n\n`;
        }
    }
    
    report += `## 📈 游戏进度

### 节点探索
- **已解锁**: ${gameState.unlockedNodes.length}/${networkNodes.length}
- **已完成**: ${gameState.completedNodes.length}/${networkNodes.length}

### 线索收集
- **已收集**: ${gameState.clues.length}/${cluesData.length}

---
*由数字秘境游戏自动生成*`;
    
    // 下载报告
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `数字秘境_成就报告_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMessage('📝 成就报告导出成功！', 'success');
}

// 在游戏中添加导出按钮的函数
function addExportButtons() {
    // 在控制栏添加导出按钮
    const controls = document.getElementById('controls');
    if (controls) {
        const exportBtn = document.createElement('button');
        exportBtn.className = 'control-btn';
        exportBtn.innerHTML = '📤';
        exportBtn.title = '导出成就墙';
        exportBtn.onclick = showExportMenu;
        controls.appendChild(exportBtn);
    }
}

// 显示导出菜单
function showExportMenu() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📤 导出成就墙</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div>
                <p>选择导出方式：</p>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
                    <button class="game-btn" onclick="downloadAchievementWall(); this.closest('.modal').remove();">
                        🖼️ 导出为图片
                    </button>
                    <button class="game-btn" onclick="shareAchievementWall(); this.closest('.modal').remove();">
                        📱 分享文本格式
                    </button>
                    <button class="game-btn" onclick="exportAchievementReport(); this.closest('.modal').remove();">
                        📝 导出详细报告
                    </button>
                </div>
                <p style="font-size: 0.9em; color: #666; margin-top: 20px;">
                    💡 提示：图片格式适合保存纪念，文本格式适合社交分享，详细报告包含完整游戏统计。
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 自动添加导出功能到游戏中
document.addEventListener('DOMContentLoaded', () => {
    // 延迟添加导出按钮，确保游戏界面已加载
    setTimeout(addExportButtons, 1000);
});
