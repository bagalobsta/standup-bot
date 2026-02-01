const fs = require('fs-extra');
const path = require('path');

class StandupBot {
  constructor(agentName = 'agent') {
    this.agentName = agentName;
    this.dataDir = path.join(process.env.HOME || '/tmp', '.standup-bot');
    this.reportsFile = path.join(this.dataDir, 'reports.json');
    fs.ensureDirSync(this.dataDir);
  }

  // Create a new standup
  createStandup(done = [], doing = [], blockers = [], notes = '') {
    const standup = {
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      done,
      doing,
      blockers,
      notes,
      stats: {
        itemsCompleted: done.length,
        itemsInProgress: doing.length,
        blockerCount: blockers.length
      }
    };

    const reports = this.getReports();
    reports.push(standup);
    fs.writeJsonSync(this.reportsFile, reports, { spaces: 2 });
    
    return standup;
  }

  // Get all reports
  getReports() {
    if (fs.existsSync(this.reportsFile)) {
      return fs.readJsonSync(this.reportsFile);
    }
    return [];
  }

  // Get today's standup
  getTodayStandup() {
    const reports = this.getReports();
    const today = new Date().toLocaleDateString();
    return reports.find(r => r.date === today);
  }

  // Get weekly summary
  getWeeklySummary() {
    const reports = this.getReports();
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weekReports = reports.filter(r => new Date(r.timestamp) > oneWeekAgo);

    return {
      period: '7 days',
      reportCount: weekReports.length,
      totalCompleted: weekReports.reduce((sum, r) => sum + r.stats.itemsCompleted, 0),
      avgPerDay: (weekReports.reduce((sum, r) => sum + r.stats.itemsCompleted, 0) / 7).toFixed(1),
      totalBlockers: weekReports.reduce((sum, r) => sum + r.stats.blockerCount, 0),
      reports: weekReports
    };
  }

  // Format standup for display
  formatStandup(standup) {
    const lines = [];
    lines.push(`📅 ${standup.date}`);
    lines.push('');
    
    if (standup.done.length > 0) {
      lines.push('✅ DONE:');
      standup.done.forEach(item => lines.push(`  • ${item}`));
      lines.push('');
    }

    if (standup.doing.length > 0) {
      lines.push('🔨 DOING:');
      standup.doing.forEach(item => lines.push(`  • ${item}`));
      lines.push('');
    }

    if (standup.blockers.length > 0) {
      lines.push('🚧 BLOCKERS:');
      standup.blockers.forEach(item => lines.push(`  • ${item}`));
      lines.push('');
    }

    if (standup.notes) {
      lines.push('📝 NOTES:');
      lines.push(`  ${standup.notes}`);
    }

    return lines.join('\n');
  }
}

module.exports = { StandupBot };
