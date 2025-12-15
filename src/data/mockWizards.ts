import type { WizardConfig } from '../types';

export const sqlWizard: WizardConfig = {
  id: 'sql-helper',
  title: 'SQL 救急向导',
  icon: '🐛',
  description: '别管语法，告诉我你要查什么，我来写 Query。',
  // 模板中使用 {{variable}} 占位符
  systemPromptTemplate: `
Role: Senior Database Administrator
Task: Write a generic SQL query based on the requirements.

Database Type: {{dbType}}
Table Structure/Context: {{tableContext}}
Query Goal: {{queryGoal}}

Requirements:
- Use uppercase for SQL keywords.
- Optimize for performance.
- Comment complex logic.
  `,
  steps: [
    {
      id: 'step_1',
      type: 'select',
      variableName: 'dbType',
      botMessage: '首先，我们要操作哪种数据库？',
      options: [
        { label: 'MySQL / MariaDB', value: 'MySQL' },
        { label: 'PostgreSQL', value: 'PostgreSQL' },
        { label: 'SQL Server', value: 'T-SQL' },
        { label: 'SQLite', value: 'SQLite' },
      ]
    },
    {
      id: 'step_2',
      type: 'textarea',
      variableName: 'tableContext',
      botMessage: '请粘贴相关的表结构（CREATE TABLE 语句）或者简单描述表字段。',
      placeholder: '例如：users 表有 id, name, email...'
    },
    {
      id: 'step_3',
      type: 'text',
      variableName: 'queryGoal',
      botMessage: '你想查出什么数据？请用人话描述。',
      placeholder: '例如：找出上个月消费最高的前10名用户'
    }
  ]
};