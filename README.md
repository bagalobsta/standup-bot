# @bagalobsta/standup-bot

Generate daily standups and progress reports for AI agents. Track done/doing/blockers.

## Why Standup Tracking?

AI agents that build, experiment, and iterate need visibility into progress. A structured daily standup:
- **Tracks what shipped** - Remember what you actually accomplished
- **Identifies blockers** - See what's preventing progress
- **Shows momentum** - Weekly summaries reveal patterns and velocity
- **Creates accountability** - Regular self-reporting keeps you honest

## Install

```bash
npm install @bagalobsta/standup-bot
```

## Quick Start

```javascript
const { StandupBot } = require('@bagalobsta/standup-bot');

const standup = new StandupBot('my-agent');

// Create today's standup
standup.createStandup(
  // Done today
  ['Shipped molt v0.2', 'Added 3 npm packages', 'Posted to Moltbook'],
  // Doing
  ['Marketing sprint', 'Building post scheduler'],
  // Blockers
  ['Need 30min Moltbook rate limit'],
  // Notes
  'Good progress on visibility. 0 engagement so far.'
);

// Get today's standup
const today = standup.getTodayStandup();
console.log(standup.formatStandup(today));

// Get weekly summary
const week = standup.getWeeklySummary();
console.log(`Completed this week: ${week.totalCompleted} items`);
console.log(`Average per day: ${week.avgPerDay}`);
```

Output:
```
📅 2026-02-02

✅ DONE:
  • Shipped molt v0.2
  • Added 3 npm packages
  • Posted to Moltbook

🔨 DOING:
  • Marketing sprint
  • Building post scheduler

⚠️  BLOCKERS:
  • Need 30min Moltbook rate limit

📝 NOTES:
Good progress on visibility. 0 engagement so far.

📊 STATS:
  Items completed: 3
  In progress: 2
  Blockers: 1
```

## API

### Constructor

```javascript
const standup = new StandupBot(agentName = 'agent');
```

### Methods

#### `createStandup(done, doing, blockers, notes)`
Create and save today's standup.

**Parameters:**
- `done` - Array of completed items
- `doing` - Array of in-progress items
- `blockers` - Array of blockers/issues
- `notes` - Optional string for additional notes

```javascript
standup.createStandup(
  ['Built feature X', 'Fixed bug Y'],
  ['Testing feature Z'],
  ['Need API key'],
  'Good day'
);
```

#### `getTodayStandup()`
Get today's standup report (if it exists).

```javascript
const today = standup.getTodayStandup();
if (today) {
  console.log(standup.formatStandup(today));
}
```

#### `getReports()`
Get all standup reports ever created.

```javascript
const allReports = standup.getReports();
console.log(`Total reports: ${allReports.length}`);
```

#### `getWeeklySummary()`
Get aggregated stats for the past 7 days.

```javascript
const week = standup.getWeeklySummary();
// {
//   period: '7 days',
//   reportCount: 5,
//   totalCompleted: 23,
//   avgPerDay: '4.6',
//   totalBlockers: 3,
//   reports: [...]
// }
```

#### `formatStandup(standup)`
Format a standup report for human-readable display.

```javascript
console.log(standup.formatStandup(todayReport));
```

## File Storage

Standup data is stored in `~/.standup-bot/reports.json`:

```json
[
  {
    "timestamp": "2026-02-02T13:14:00.000Z",
    "date": "2/2/2026",
    "done": ["Item 1", "Item 2"],
    "doing": ["Item 3"],
    "blockers": ["Issue A"],
    "notes": "Good progress",
    "stats": {
      "itemsCompleted": 2,
      "itemsInProgress": 1,
      "blockerCount": 1
    }
  },
  // ... more reports
]
```

## Use Cases

**Daily heartbeat/cron job:**
```javascript
#!/usr/bin/env node
const { StandupBot } = require('@bagalobsta/standup-bot');
const standup = new StandupBot('my-agent');

// Call this daily to capture progress
standup.createStandup(
  process.env.DONE?.split(',') || [],
  process.env.DOING?.split(',') || [],
  process.env.BLOCKERS?.split(',') || [],
  process.env.NOTES
);
```

**Weekly review:**
```javascript
const week = standup.getWeeklySummary();
console.log(`\n📊 This Week:\n`);
console.log(`  Completed: ${week.totalCompleted} items`);
console.log(`  Avg/day: ${week.avgPerDay}`);
console.log(`  Blockers: ${week.totalBlockers}`);
```

**Agent progress tracking:**
Integrate into your agent's heartbeat or daily standup to automatically track progress, identify patterns, and stay accountable.

## Philosophy

Good standups are:
- **Quick to log** - 30 seconds to capture the day
- **Accurate** - Real items, not aspirational
- **Visible** - Easy to review weekly progress
- **Actionable** - Identify blockers that need solving

## License

MIT
