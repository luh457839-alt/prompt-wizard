// React import removed because JSX runtime is automatic (react-jsx)
import { useWizardStore } from './store/wizardStore';
import { WizardEngine } from './components/WizardEngine';
import { Sidebar } from './components/Sidebar';
import { sqlWizard } from './data/mockWizards';
import { MessageSquareDashed } from 'lucide-react';
import { clsx } from 'clsx';

const AVAILABLE_WIZARDS = [sqlWizard];

function App() {
  const { activeWizard, startWizard } = useWizardStore();

  return (
    // 外层容器：使用 h-screen 锁定全屏，防止滚动溢出
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      
      {/* 区域 1: Sidebar (列表) 
        逻辑: Mobile 下如果没选中 Wizard 则显示；Desktop 下永远显示
      */}
      <aside className={clsx(
        "flex-shrink-0 w-full md:w-80 lg:w-96 transition-all duration-300",
        // Mobile Logic:
        activeWizard ? "hidden md:flex" : "flex" 
      )}>
        <Sidebar 
          wizards={AVAILABLE_WIZARDS}
          activeWizardId={activeWizard?.id}
          onSelect={startWizard}
          className="w-full h-full"
        />
      </aside>

      {/* 区域 2: Main Content (引擎)
        逻辑: Mobile 下如果选中 Wizard 则显示；Desktop 下永远显示
      */}
      <main className={clsx(
        "flex-1 relative bg-gray-50",
        // Mobile Logic:
        activeWizard ? "flex" : "hidden md:flex"
      )}>
        {activeWizard ? (
          // 渲染引擎
          <WizardEngine 
            className="w-full h-full" 
            isMobile={true} // 其实在 desktop 模式下，我们会通过 CSS 隐藏 back button，或者你可以传入 window width 判断
          />
        ) : (
          // Empty State (仅 Desktop 可见，因为 Mobile 会切到列表)
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <MessageSquareDashed size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Ready to assist</h2>
            <p className="max-w-xs text-center text-sm">
              Select a wizard from the sidebar to start crafting your perfect prompt.
            </p>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;