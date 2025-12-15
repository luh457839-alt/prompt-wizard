import { create } from 'zustand';
import type { WizardConfig, ChatMessage } from '../types';

interface WizardState {
  // 当前激活的向导
  activeWizard: WizardConfig | null;
  // 当前进行到第几步 (索引)
  currentStepIndex: number;
  // 聊天历史
  history: ChatMessage[];
  // 收集到的变量 { variableName: userValue }
  collectedVariables: Record<string, string>;
  // 是否完成
  isCompleted: boolean;
  // 生成的最终 Prompt
  finalResult: string | null;

  // Actions
  startWizard: (wizard: WizardConfig) => void;
  submitAnswer: (answer: string, label?: string) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  activeWizard: null,
  currentStepIndex: 0,
  history: [],
  collectedVariables: {},
  isCompleted: false,
  finalResult: null,

  startWizard: (wizard) => {
    set({
      activeWizard: wizard,
      currentStepIndex: 0,
      collectedVariables: {},
      isCompleted: false,
      finalResult: null,
      history: [
        {
          id: 'init-1',
          sender: 'bot',
          text: wizard.steps[0].botMessage,
          isTyping: true,
        },
      ],
    });
  },

  submitAnswer: (answerValue, answerLabel) => {
    const { activeWizard, currentStepIndex, collectedVariables, history } = get();
    if (!activeWizard) return;

    const currentStep = activeWizard.steps[currentStepIndex];
    
    // 1. 记录用户的回答
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: answerLabel || answerValue, // 优先显示 Label (针对 Select)
    };

    // 2. 更新变量
    const newVariables = { ...collectedVariables, [currentStep.variableName]: answerValue };

    // 3. 判断是否有下一步
    const nextIndex = currentStepIndex + 1;
    const isFinished = nextIndex >= activeWizard.steps.length;

    if (isFinished) {
      // 生成最终结果
      let prompt = activeWizard.systemPromptTemplate;
      Object.entries(newVariables).forEach(([key, value]) => {
        prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      set({
        history: [...history, userMsg],
        collectedVariables: newVariables,
        isCompleted: true,
        finalResult: prompt,
      });
    } else {
      // 进入下一步
      const nextStep = activeWizard.steps[nextIndex];
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: nextStep.botMessage,
        isTyping: true,
      };

      set({
        history: [...history, userMsg, botMsg],
        collectedVariables: newVariables,
        currentStepIndex: nextIndex,
      });
    }
  },

  reset: () => set({ activeWizard: null, history: [] }),
}));