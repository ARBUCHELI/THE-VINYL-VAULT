# Markdown Editor Guide

## Overview
The post editor now includes a full-featured markdown editor with live preview and formatting toolbar. You can write rich, formatted content without leaving the editor.

## Features

### 🎨 Formatting Toolbar
Quick-access buttons for common formatting:
- **H1** - Main heading
- **H2** - Subheading
- **B** - Bold text
- **I** - Italic text
- **List** - Bullet points
- **Link** - Hyperlinks
- **Code** - Inline code

### 👁️ Live Preview
Switch between "Write" and "Preview" tabs to see exactly how your post will look when published.

## Markdown Syntax

### Headings
```markdown
# Heading 1 (Main Title)
## Heading 2 (Subtitle)
### Heading 3
#### Heading 4
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
```

### Lists
```markdown
Bullet list:
- Item 1
- Item 2
- Item 3

Numbered list:
1. First item
2. Second item
3. Third item
```

### Links
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Link title")
```

### Images
```markdown
![Alt text](https://example.com/image.jpg)
![Image with title](https://example.com/image.jpg "Image title")
```

### Quotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Code
Inline code:
```markdown
Use `code` for inline code snippets
```

Code blocks:
````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

### Horizontal Line
```markdown
---
or
***
```

## Using the Toolbar

### Formatting Selected Text
1. Select text you want to format
2. Click a toolbar button
3. The text will be wrapped with the appropriate markdown syntax

### Inserting New Formatting
1. Click where you want to insert formatted text
2. Click a toolbar button
3. Placeholder text appears - replace it with your content

### Keyboard Shortcuts
While the toolbar doesn't have keyboard shortcuts yet, you can type markdown syntax directly:
- Type `# ` at start of line for H1
- Type `## ` at start of line for H2
- Type `**` before and after text for bold
- Type `*` before and after text for italic

## Tips & Best Practices

### Structure Your Content
- Use H1 (`#`) for your main title (optional, as the post title is separate)
- Use H2 (`##`) for main sections
- Use H3 (`###`) for subsections
- Keep heading hierarchy logical

### Make It Readable
- Break content into short paragraphs
- Use lists for multiple related items
- Add horizontal lines to separate major sections
- Use blockquotes for important callouts

### Add Visual Interest
- Include images with descriptive alt text
- Use code blocks for technical content
- Mix text formatting (bold, italic) appropriately
- Don't overuse formatting - keep it clean

### Preview Before Publishing
1. Write your content in the "Write" tab
2. Click the "Preview" tab to see formatted output
3. Check for formatting errors
4. Make adjustments as needed
5. Preview again to confirm

## Example Post

Here's an example of well-formatted markdown content:

````markdown
## Introduction

Welcome to this guide on **writing great blog posts**. In this article, we'll cover:

- Content structure
- Formatting best practices
- Common mistakes to avoid

---

## Main Content

### Why Structure Matters

Good structure makes your content *easier to read* and helps readers find what they need.

> "Content is king, but structure is the kingdom."

### Code Example

Here's a simple JavaScript function:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

### Key Takeaways

1. Plan your content structure first
2. Use headings to organize sections
3. Preview before publishing

---

## Conclusion

For more information, check out [Markdown Guide](https://www.markdownguide.org).
````

## Common Issues

### Formatting Not Working?
- Check your markdown syntax
- Switch to Preview tab to see rendered output
- Look for missing closing symbols (like `**` for bold)

### Line Breaks Not Showing?
- Add two spaces at the end of a line for a soft break
- Use a blank line for a paragraph break

### Lists Not Formatting?
- Ensure there's a space after the `-` or number
- Keep list items at the same indentation level

### Images Not Displaying?
- Verify the image URL is correct and publicly accessible
- Check that the URL starts with `http://` or `https://`

## Advanced Markdown

### Nested Lists
```markdown
- Item 1
  - Nested item 1
  - Nested item 2
- Item 2
```

### Task Lists (may not render)
```markdown
- [x] Completed task
- [ ] Incomplete task
```

### Tables (may not render)
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

## Need Help?

- Click any toolbar button to see what markdown it inserts
- Use the Preview tab to check your formatting
- Common markdown syntax is shown in the placeholder text
- Remember: you can always edit and republish posts!

Happy writing! ✍️
