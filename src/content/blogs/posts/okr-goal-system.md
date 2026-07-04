---
title: "OKR Goal System"
description: "OKR based goal system"
pubDate: "July 04 2026"
heroImage: "../../../assets/blog-placeholder.jpg"
categories: ['projects']
---

## Quarter Based Goal Execution System (QBGES)

QBGES exists to answer one question:

"Am I making meaningful progress this year?"

Everything in the system must support:

- Clarity (what matters now)
- Progress (how far you’ve moved)
- Momentum (are you consistent)

### Core Mental Model

- Goal = destination
- Progress = distance covered
- Tasks = possible steps
- Logs = travel history

Rules:

- Goals must be measurable
- Progress is numeric
- Tasks are optional
- Logs are historical truth

- Year: broken down into 4 quarters.
- Each Quarter: has focused goals.
- Each Goal: broken into measurable outcomes.
- Each Outcome: backed by tasks.

Instead of starting with features, start with the question:

- "What makes someone open this every week?"

Answer:

- Progress visibility
- Reflection
- Momentum

Build around that.

### Problem Statement

Most apps fail because:

- They dump everything into one list
- No time framing
- No feedback loop
- No sense of progress over months

QBGES Solves this by:

- Time-bound structure (quarters)
- Forced prioritization
- Visual progress across the year
- Reflection + adjustment system

What Will Make It Succeed:

- It’s simple enough to use daily
- It forces clarity (not flexibility)
- It shows progress visually
- It builds a habit loop

If you overbuild:

- It dies

If you simplify + focus:

- It sticks

NB: Tasks (Things I need to do). Progress (How far I've moved toward a result).

Don't assume (more tasks completed = more progress).

#### Core Features

##### A. Year Dashboard

Shows:

- Current quarter
- Overall yearly progress %
- Goals per quarter
- Completion heatmap

##### B. Quarterly Planning System

Each quarter:

- Max 3–5 goals (forced constraint = good UX)
- Each goal must have:
  - Description
  - Why it matters
  - Measurable target

###### C. Goal -> Milestone -> Task Breakdown

Structure:

```text
Year
 └── Quarter (Q1)
      └── Goal (Get Fit)
           └── Milestones (Lose 5kg)
                └── Tasks (Gym 3x/week)
```

Key Principle: Tasks are optional, outcomes are mandatory.

#### D. Progress Tracking

Each goal should show:

- % completion
- weekly activity
- trend (up/down)

Avoid:

- Just checking tasks.
Instead:
- Measure progress numerically.

#### E. Weekly Check-in System (Your Secret Weapon)

This is where most apps fail.

Every week:

- What did you do?
- What moved forward?
- What’s blocked?

System updates:

- Goal progress
- Momentum score

This creates:

- Accountability loop

#### F. Quarterly Review (Retention Engine)

At end of quarter:

- What worked?
- What failed?
- Carry forward goals?

This makes it feel like:

- A system, not a tool.

### UX Philosophy

If this feels like work, users quit.

So:

- Minimal input fields
- Strong defaults
- Opinionated limits (max goals)
- Visual > text

Think:

- Calm, focused, almost like a journal

### Add On Features

- Smart reminders
- AI suggestions (break goals into tasks)
- Visual timeline of the year
- Streak tracking
- Mobile companion

### User Lifecycle (How the App Is Used)

This is the most important section.

🟢 Phase 1: Year Setup (Once per Year)
User Action:
Opens app for the first time in a new year
System Behavior:
Creates a new Year
Auto-generates 4 quarters
Output:
User sees full year structure
🟡 Phase 2: Quarterly Planning
User Action:
Starts a new quarter
User Defines:
3–5 goals (forced constraint)

Each goal must have:

Title
Target value (e.g. 12 books)
Unit (books, $, kg, etc)

Optional:

Description
Start/Due dates
System Behavior:
Validates max goals (≤ 5)
Stores goals under the quarter
🔵 Phase 3: Execution (Daily / Weekly Use)

This is where retention lives.

A. User Works via Tasks (Optional)
Adds tasks under goals
Marks tasks complete

👉 Tasks help execution, NOT progress

B. User Updates Progress (Critical Action)

User manually logs progress:

Example:
+1 book
+5kg lost
+10% project completion
System Behavior:

1. Create ProgressLog
2. Increment goal.current_value
Result:
Progress = current_value / target_value
🟣 Phase 4: Weekly Interaction (Lightweight)

(Keep simple for MVP)

User May:
Review goals
Adjust progress
Add notes (optional)

👉 No forced complexity

🔴 Phase 5: Quarterly Review
User Reflects:
Which goals completed?
Which failed?
What to carry forward?
System Behavior:
Marks goals as:
completed
abandoned
Locks quarter (optional future feature)

### Core Screens & Responsibilities

🏠 1. Year Dashboard
Purpose:

High-level overview

Displays:
Current quarter
Year progress %
Goals summary
Activity trend (optional later)
📅 2. Quarter View
Purpose:

Focus zone

Displays:
Active goals
Progress bars
Goal statuses
🎯 3. Goal Detail View
Purpose:

Execution + tracking

Displays:
Progress (numeric + %)
Tasks list
Progress history (logs)
✅ 4. Task View (Inline or modal)
Purpose:

Break down work

📈 5. Progress Input UI
Purpose:

Update progress quickly

UX:
Simple input (+value)
Optional note
Instant feedback

### Core Business Rules

Goals
Max 5 per quarter
Must have target_value to show progress %
Can exist without tasks
Progress
Always numeric
Updated manually
Stored as:
current_value (fast access)
progress_logs (history)
Tasks
Unlimited
Optional
Do NOT determine progress
Logs
Incremental values
Optional notes
Used for:
future analytics
trends
insights

### Data Flow (Critical for Devs)

When Updating Progress
User Input → +X

→ Create progress_logs entry
→ Update goals.current_value += X
→ Return updated progress %
When Viewing Goal
Fetch goal
→ Calculate % (current / target)
→ Load tasks
→ Load recent logs

### UX Principles (Execution Rules)

1. Reduce Friction
No unnecessary fields
Fast interactions
Minimal clicks
2. Force Clarity
Limit goals
Require measurable targets
3. Visual Feedback
Progress bars
Percentages
Simple indicators
4. Calm Interface
No clutter
No overload
Journal-like feel

### What We Explicitly Avoid

❌ Task-based progress
❌ Over-automation
❌ Complex analytics (for MVP)
❌ Too many features
❌ Abstract goals

### MVP Scope (Strict)

MUST HAVE:
Year → Quarter → Goal structure
Goal creation
Progress updates
Task management
Basic dashboard
NICE TO HAVE (Later):
Weekly reviews
Charts / graphs
Smart reminders
AI suggestions

### Success Criteria

The app succeeds if:

User opens it weekly
User updates progress easily
User understands where they stand instantly

### Final Guiding Principle

If it doesn’t help the user see or improve progress, it doesn’t belong.

### QBGES — User Stories & System Behavior Specification

#### 1. Actors

Primary Actor:

- User (single-user, offline)

Secondary Actor:

- System (local app logic)

#### 2. User Stories (Functional)

##### YEAR MANAGEMENT

User Stories:

- User can create a new year
- User can view existing years
- User can select a year to work on

System Behavior

- When a year is created:
  - System creates 4 quarters automatically (Q1–Q4)
  - Each quarter gets:
    - quarter (1–4)
    - start_date
    - end_date

#### QUARTER MANAGEMENT

User Stories:

- User can view all quarters for a year
- User can select a quarter
- User can see goals within a quarter

System Behavior

System ensures:

- Only 4 quarters per year
- Each quarter is uniquely identified

#### GOAL MANAGEMENT

User Stories:

- User can create a goal within a quarter
- User can update a goal
- User can delete a goal
- User can reorder goals
- User can mark goal as:
  - pending
  - in progress
  - completed
  - archived

Goal Creation Requirements

User must provide:

- title
- target_value (optional but recommended)
- unit (optional)

System Behavior

On goal creation:

- current_value = 0
- status = pending
- System enforces:
- Max 5 goals per quarter (business rule)

### TASK MANAGEMENT

User Stories:

- User can add tasks to a goal
- User can update a task
- User can delete a task
- User can reorder tasks
- User can mark task as completed

System Behavior

Tasks:

- Belong to a goal
- Are optional
- Do NOT affect goal progress

### PROGRESS TRACKING (CORE FEATURE)

User Stories

- User can manually update goal progress
- User can view current progress
- User can view progress history (optional UI)

System Behavior

When user updates progress:

- Input: +X value

System performs:

1. Insert into progress_logs:
   - goal_id
   - value = X
   - logged_at = now()

2. Update goals table:
   - current_value += X

Progress Calculation
progress % = (current_value / target_value) * 100

Edge Handling

If target_value is null:

System does NOT compute percentage

UI shows raw value only

### REMINDERS

User Stories

- User can set reminder for a task
- User can update reminder
- User can delete reminder

System Behavior

System checks:

- remind_at <= now
- is_sent = false

Then:

- Triggers notification (future implementation)

Marks:

- is_sent = true
- sent_at = now()

### DASHBOARD

User Stories

- User can view yearly overview
- User can view current quarter progress
- User can see all goals with progress

System Behavior

System computes:
Goal Progress:

- goal_progress = current_value / target_value

Quarter Progress:

- quarter_progress = average(goal_progress)

Year Progress:

- year_progress = average(quarter_progress)

## System Rules (Critical)

Rule 1: Progress is Independent of Tasks
Tasks ≠ Progress

Rule 2: Progress is Always Numeric

- Stored in:
  - goals.current_value
  - progress_logs.value

Rule 3: Logs Are Source of Truth (History)

- Every update SHOULD create a log entry
- Logs are append-only

Rule 4: Slugs Are Scoped

- Goals: unique per quarter
- Tasks: unique per goal

Rule 5: Data Integrity

- current_value >= 0
- target_value >= 0

## Key Workflows

Workflow 1: Create Goal

- User → Create Goal

System:

- Validate input
- Save goal
- Set current_value = 0

Workflow 2: Add Task

- User → Add Task

System:

- Attach to goal
- Set status = pending

Workflow 3: Update Progress (CORE)

- User → Inputs +X

System:

- Begin transaction
- Insert progress_log
- Increment goal.current_value
- Commit transaction

Workflow 4: Complete Goal

- User → Marks goal completed

System:

- status = completed
- completed_at = now()

## Edge Cases (Handled)

Case 1: No target_value

- No percentage shown
- Only raw progress displayed

Case 2: Over-completion

- current_value > target_value
Allowed
- UI can show >100%

Case 3: Negative input

- Should be rejected at validation level

## Non-Functional Requirements

Performance

- Use indexed queries
- Avoid recalculating logs for every request
- Offline Support
- Entire system runs locally
- No authentication required
- Simplicity
- No unnecessary steps
- Minimal UI friction

## Acceptance Criteria (MVP)

User must be able to:

- Create a year
- See 4 quarters
- Create goals per quarter
- Add tasks to goals
- Update progress manually
- See progress percentage
- View goals in dashboard

## DB Schema

```php
years {
    id();
    integer('year')->unique();
    foreignId('user_id')->constrained('users')->cascadeOnDelete();
    timestamps();
}

quarters {
    id();
    string('label');
    date('start_date');
    date('end_date');
    foreignId('year_id')->constrained('years')->cascadeOnDelete();
    timestamps();

    // Prevent duplicate labels for the same year.
    unique(['year_id', 'label']);
}

objectives {
    id();
    uuid()->unique();
    string('label');
    text('description')->nullable();

    string('color')->default('#3B82F6');
    string('icon')->default('list');

    integer('sort_order')->default(0);
    unsignedTinyInteger('priority')->default(0);
    unsignedTinyInteger('status')->default(0);

    timestamp('due_date')->nullable();
    timestamp('start_date')->nullable();
    timestamp('completed_at')->nullable();

    foreignId('quarter_id')->constrained('quarters')->cascadeOnDelete();
    timestamps();

    index(['quarter_id', 'status']);
    index(['status', 'quarter_id']);
    index(['quarter_id', 'sort_order']);
    index(['status', 'due_date']);
    index(['priority', 'status']);
    index('sort_order');
}

key_results {
    id();
    uuid()->unique();
    string('label');

    // Outcome tracking
    // Example:
    // Read 12 books. target_value: 12, current_value: 2, unit: books
    // So now it shows: 2 / 12 books.
    decimal('target_value', 10, 2)->nullable();
    decimal('current_value', 10, 2)->default(0);
    string('unit')->nullable(); // "users", "kg", "hours", "$", '%'

    decimal('confidence_score', 3, 2)->default(0.50); // 0-1 scale

    unsignedTinyInteger('priority')->default(0);
    unsignedTinyInteger('status')->default(0);

    unsignedTinyInteger('check_in_frequency')->default(1);
    timestamp('next_check_in_at')->nullable();
    timestamp('last_check_in_at')->nullable();

    integer('sort_order')->default(0);
    foreignId('objective_id')->constrained('objectives')->cascadeOnDelete();
    timestamps();

    index('objective_id');
    index(['objective_id', 'sort_order']);
    index(['objective_id', 'status']);
}

initiatives {
    id();
    uuid()->unique();
    string('label');
    text('description')->nullable();

    unsignedTinyInteger('priority')->default(0);
    unsignedTinyInteger('status')->default(0);
    integer('sort_order')->default(0);

    timestamp('start_date')->nullable();
    timestamp('due_date')->nullable();
    timestamp('completed_at')->nullable();
    
    foreignId('parent_initiative_id')->nullable()->constrained('initiatives')->cascadeOnDelete();
    foreignId('key_result_id')->constrained('key_results')->cascadeOnDelete();
    timestamps();

    index(['key_result_id', 'sort_order']);
    index(['status', 'due_date']);
    index(['priority', 'status']);
    index(['key_result_id', 'status']);
    index(['parent_initiative_id', 'sort_order']);
}

reminders {
    id();
    timestamp('remind_at');
    unsignedTinyInteger('method')->default(0);
    boolean('is_sent')->default(false);
    timestamp('sent_at')->nullable();
    
    // Polymorphic relationship
    unsignedBigInteger('remindable_id');
    string('remindable_type'); // 'objective', 'key_result', 'initiative'
    
    timestamps();
    
    index(['remindable_id', 'remindable_type']);
    index(['remind_at', 'is_sent']);
}

progress_logs {
    id();
    decimal('value', 10, 2); // Amount added this log entry (e.g., +5 users). NOT running total
    text('notes')->nullable();
    decimal('confidence_score', 3, 2);
    
    foreignId('key_result_id')->constrained('key_results')->cascadeOnDelete();
    timestamp('logged_at')->useCurrent();
    timestamps();

    index(['key_result_id', 'logged_at']);
    index(['logged_at']);
}

quarter_grades {
    id();
    decimal('grade', 3, 2); // 0.00 - 1.00
    text('reflection')->nullable();
    foreignId('quarter_id')->constrained()->cascadeOnDelete();
    foreignId('objective_id')->constrained()->cascadeOnDelete();
    timestamp('graded_at')->useCurrent();
    timestamps();
}

tags {
    id();
    string('name'); // "health", "work", "learning"
    string('color')->nullable(); // #FF0000
    timestamps();
};

// Polymorphic pivot table (tags can attach to goals OR tasks)
taggables {
    id();
    foreignId('tag_id')->constrained('tags')->cascadeOnDelete();
    unsignedBigInteger('taggable_id');
    string('taggable_type');
    timestamps();

    index(['taggable_id', 'taggable_type']);
    index(['taggable_type', 'taggable_id']);
};
```

## Enums

```php
Priority = [
    0 = low,
    1 = medium,
    2 = high,
    3 = urgent
]

Status = [
    0 = todo,
    1 = doing,
    2 = done,
    3 = archived
]

CheckinFrequency = [
    0 => daily,
    1 => weekly,
    2 => biweekly
]

ReminderMethods = [
    0 => notification
]
```

## EOF
