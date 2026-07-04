---
title: "TODOs Application"
description: "TODOs application development tips and ideas"
pubDate: "July 04 2026"
heroImage: "../../../assets/blog-placeholder.jpg"
categories: ['projects']
---

## DB Schema

### Migrations

```php
Schema::create('todos', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('slug')->unique();
    $table->string('color')->default('#3B82F6');
    $table->string('icon')->default('list');
    $table->integer('order')->default(0);
    $table->unsignedTinyInteger('priority')->default(1); // Enum: 0 = low, 1 = medium, 2 = high, 3 = urgent
    $table->unsignedTinyInteger('status')->default(0); // Enum: 0 = pending, 1 = in_progress, 2 = completed, 3 = archived
    $table->timestamp('due_date')->nullable();
    $table->timestamp('start_date')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();

    $table->index(['status', 'due_date']);
    $table->index(['priority', 'status']);
    $table->index('order');
    $table->index('due_date');
});

Schema::create('todo_items', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('slug')->unique();
    $table->unsignedTinyInteger('priority')->default(1); // Enum: 0 = low, 1 = medium, 2 = high, 3 = urgent
    $table->unsignedTinyInteger('status')->default(0); // Enum: 0 = pending, 1 = in_progress, 2 = completed, 3 = archived
    $table->integer('order')->default(0);
    $table->timestamp('due_date')->nullable();
    $table->timestamp('start_date')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->foreignId('todo_id')->constrained('todos')->cascadeOnDelete();
    $table->timestamps();

    $table->index(['status', 'due_date']);
    $table->index(['priority', 'status']);
    $table->index(['todo_id', 'order']);
    $table->index('due_date');
});

Schema::create('reminders', function (Blueprint $table) {
    $table->id();
    $table->timestamp('remind_at');
    $table->unsignedTinyInteger('method')->default(0); // Enum: 0 = notification, 1 = email, 2 = both
    $table->boolean('is_sent')->default(false);
    $table->timestamp('sent_at')->nullable();
    $table->foreignId('todo_item_id')->constrained('todo_items')->cascadeOnDelete();
    $table->timestamps();

    $table->index(['remind_at', 'is_sent']);
    $table->index('is_sent');
});
```
