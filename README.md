# Jira Kanban Board Mockup Tool

A responsive, client-side tool for mocking up Jira Data Center Kanban Board layouts. Perfect for planning board configurations, demonstrating workflows, or creating board design mockups without needing access to a Jira instance.

## Features

### Board Management
- **Editable Board Name**: Click on the board title to rename it
- **Multiple Columns**: Add, edit, reorder, and delete columns
- **Column Colors**: Customize column header colors
- **WIP Limits**: Set Work In Progress limits with visual indicators when exceeded
- **Drag & Drop**: Reorder columns and move issues between columns

### Issue Management
- **Issue Types**: Story, Bug, Task, Epic, Sub-task
- **Priority Levels**: Highest, High, Medium, Low, Lowest
- **Issue Details**:
  - Summary and Description
  - Assignee
  - Story Points
  - Labels
  - Epic Link
  - Due Date
- **Visual Indicators**: Type icons, priority icons, assignee avatars
- **Quick Actions**: Double-click to edit any issue

### Swimlanes
- Toggle swimlanes on/off
- Group by:
  - Assignee
  - Priority
  - Epic
- Collapsible swimlane headers

### Quick Filters
- All Issues
- My Issues (filtered by current user)
- Recently Updated

### Search
- Real-time search across issue keys, summaries, and labels
- Keyboard shortcut: `Ctrl/Cmd + K`

### Display Options
- Toggle visibility of:
  - Avatars
  - Priority icons
  - Labels
  - Story points
  - Due dates

### Themes
- Light theme (default)
- Dark theme

### Export/Import
- Export board configuration to JSON
- Import board from JSON file
- Preserves all settings, columns, and issues

### Responsive Design
- Desktop: Full feature set with multiple columns visible
- Tablet: Optimized toolbar and column widths
- Mobile: Single column view with hamburger menu

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + N`: Create new issue
- `Escape`: Close modals and panels

## Getting Started

### Quick Start
1. Open `index.html` in a web browser
2. The board loads with sample data for demonstration
3. Start customizing!

### Using a Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Project Structure

```
jira-board/
├── index.html    # Main HTML structure
├── styles.css    # Jira Data Center-inspired styling
├── app.js        # Application logic and state management
└── README.md     # This file
```

## Usage Guide

### Creating a Column
1. Click "Add Column" button in the toolbar
2. Or click the dashed placeholder at the end of the board
3. Enter column name, WIP limit (0 for unlimited), and color
4. Click "Add Column"

### Creating an Issue
1. Click "Create Issue" button
2. Or use `Ctrl/Cmd + N`
3. Fill in the issue details
4. Select the target column
5. Click "Create Issue"

### Editing an Issue
1. Double-click on any issue card
2. Modify the details
3. Click "Update Issue"

### Moving Issues
- Drag and drop issues between columns
- Issues snap into position automatically
- WIP limits are checked in real-time

### Configuring the Board
1. Click the gear icon in the header
2. Adjust project key, issue counter, columns
3. Toggle display options
4. Switch themes

### Exporting Your Board
1. Click the download icon in the header
2. A JSON file will be downloaded
3. Use this to share or backup your board

### Importing a Board
1. Click the upload icon in the header
2. Select a previously exported JSON file
3. The board will be restored with all data

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Data is stored in localStorage, so it persists between sessions in the same browser.

## Data Storage

All data is stored locally in your browser's localStorage. No data is sent to any server. To clear all data, either:
- Use browser developer tools to clear localStorage
- Import a fresh board configuration

## Customization

### Adding More Assignees
Edit the `sampleIssues` array and assignee options in `app.js`:
```javascript
const assigneeSelect = document.getElementById('issueAssignee');
// Add new option elements
```

### Modifying Default Columns
Edit the `defaultColumns` array in `app.js`:
```javascript
const defaultColumns = [
    { id: 'col-1', name: 'Backlog', wip: 0, color: '#42526E' },
    // Add more columns
];
```

### Changing Colors
CSS variables are defined in `styles.css` under `:root`. Modify these to change the color scheme.

## License

MIT License - Feel free to use, modify, and distribute.
