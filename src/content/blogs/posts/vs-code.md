---
title: 'VS Code'
description: 'Working with VS Code'
pubDate: 'July 04 2026'
heroImage: '../../../assets/blog-placeholder.jpg'
categories: ['vscode']
---

## Settings

Common settings for the `.vscode/settings.json` file:

```json
{
    // Editor settings
    "editor.tabSize": 4,
    "editor.insertSpaces": true,
    "editor.detectIndentation": false,

    // Treat all css files as tailwind
    "files.associations": {
        "*.css": "tailwindcss"
    }
}
```

## Code Snippets

Vue Code Snippets '.vscode/vue.code-snippets'

```json
{
    "Simple Vue Script and Template": {
        "prefix": "script-template",
        "body": [
            "<script setup lang=\"ts\">",
            "",
            "</script>",
            "",
            "<template>",
            "    <div>",
            "        <h1>${1:Hello!}</h1>",
            "    </div>",
            "</template>",
            ""
        ]
    },
    "Show data as JSON stringified": {
        "prefix": "json-stringify",
        "body": [
            "<pre>{{  JSON.stringify(products, null, 2)  }}</pre>"
        ]
    }
}
```
