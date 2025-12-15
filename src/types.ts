export type InputType = 'text' | 'textarea' | 'select' | 'radio';

export interface Option {
  label: string;
  value: string;
}

// 定义向导的一个步骤
export interface WizardStep {
  id: string;
  type: InputType;
  botMessage: string; // 机器人的提问
  variableName: string; // 绑定的变量名
  options?: Option[]; // 针对 select/radio 的选项
  placeholder?: string;
}

// 定义一个完整的向导配置
export interface WizardConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  systemPromptTemplate: string; // 最终生成的 Prompt 模板
  steps: WizardStep[];
}

// 聊天记录结构
export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  isTyping?: boolean; // 用于打字机效果
}