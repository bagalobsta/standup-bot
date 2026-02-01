#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { StandupBot } = require('../lib/standup.js');

const standup = new StandupBot('Bagalobsta');

program
  .name('standup')
  .version('1.0.0')
  .description('Daily standups for AI agents');

program
  .command('create')
  .option('-d, --done <items...>', 'Completed items')
  .option('-i, --doing <items...>', 'In-progress items')
  .option('-b, --blockers <items...>', 'Blockers')
  .option('-n, --notes <text>', 'Additional notes')
  .action((options) => {
    const report = standup.createStandup(
      options.done || [],
      options.doing || [],
      options.blockers || [],
      options.notes || ''
    );

    console.log(chalk.green('\n✅ Standup created\n'));
    console.log(standup.formatStandup(report));
    console.log();
  });

program
  .command('today')
  .description('Show today\'s standup')
  .action(() => {
    const today = standup.getTodayStandup();
    if (!today) {
      console.log(chalk.yellow('No standup for today yet'));
      return;
    }

    console.log(chalk.cyan('\n📊 Today\'s Standup\n'));
    console.log(standup.formatStandup(today));
    console.log();
  });

program
  .command('weekly')
  .description('Show weekly summary')
  .action(() => {
    const summary = standup.getWeeklySummary();
    
    console.log(chalk.cyan(`\n📈 Weekly Summary\n`));
    console.log(`Period: ${summary.period}`);
    console.log(`Days reported: ${summary.reportCount}`);
    console.log(`Items completed: ${summary.totalCompleted} (avg ${summary.avgPerDay}/day)`);
    console.log(`Blockers encountered: ${summary.totalBlockers}`);
    console.log();
  });

program
  .command('add-done <item>')
  .description('Log a completed item')
  .action((item) => {
    let today = standup.getTodayStandup();
    if (!today) {
      today = standup.createStandup([], [], [], '');
    }
    today.done.push(item);
    
    const reports = standup.getReports();
    const lastIdx = reports.length - 1;
    reports[lastIdx] = today;
    
    console.log(chalk.green(`✅ Added: ${item}`));
  });

program.parse(process.argv);
