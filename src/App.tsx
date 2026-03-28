import { v4 as uuidv4 } from 'uuid';
import { useWindowStore } from './store/windowStore';
import { WindowContainer } from './components/WindowContainer';
import { BrowserApp } from './components/BrowserApp';
import { PDFApp } from './components/PDFApp';
import { VideoApp } from './components/VideoApp';
import { Taskbar, TaskbarRevealTab } from './components/Taskbar';
import { ExcalidrawBackground } from './components/ExcalidrawBackground';

function App() {
  const { windows, addWindow, isFocusMode, toggleFocusMode } = useWindowStore();

  const handleAddBrowser = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    addWindow({
      id: uuidv4(),
      type: 'browser',
      title: 'New Browser',
      url: 'https://google.com',
      x: 0,
      y: 0,
      width: Math.floor(width / 2),
      height: height,
    });
  };

  const handleAddPDF = async () => {
    try {
      const filePath = await window.swiftShuttleAPI.openFile();
      if (filePath) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        addWindow({
          id: uuidv4(),
          type: 'pdf',
          title: filePath.split('\\').pop() || 'PDF Document',
          url: filePath,
          x: width / 3,
          y: 0,
          width: width / 3,
          height: height,
        });
      }
    } catch (error) {
      console.error('Failed to open PDF:', error);
    }
  };

  const handleAddVideo = async () => {
    try {
      const filePath = await window.swiftShuttleAPI.openVideo();
      if (filePath) {
        addWindow({
          id: uuidv4(),
          type: 'video',
          title: filePath.split('\\').pop() || 'Video',
          url: filePath,
          x: 100,
          y: 100,
          width: 640,
          height: 400,
        });
      }
    } catch (error) {
      console.error('Failed to open Video:', error);
    }
  };

  const handleOpenAISite = (url: string) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    addWindow({
      id: uuidv4(),
      type: 'ai',
      title: 'AI Assistant',
      url: url,
      x: (width / 3) * 2,
      y: 0,
      width: width / 3,
      height: height,
    });
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[#f3f4f6]">
      {/* Excalidraw Background Canvas */}
      <ExcalidrawBackground />

      {/* Taskbar — slides down off-screen in focus mode */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 transition-transform duration-500 ease-in-out ${
          isFocusMode ? 'translate-y-[200%]' : 'translate-y-0'
        }`}
      >
        <Taskbar
          onAddBrowser={handleAddBrowser}
          onAddPDF={handleAddPDF}
          onAddVideo={handleAddVideo}
          onOpenAISite={handleOpenAISite}
          onToggleFocusMode={toggleFocusMode}
          isFocusMode={isFocusMode}
        />
      </div>

      {/* Reveal tab — peeks up from bottom when taskbar is hidden */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-50 transition-transform duration-500 ease-in-out ${
          isFocusMode ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <TaskbarRevealTab onClick={toggleFocusMode} />
      </div>

      {/* Windows Layer */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {windows.map((win) => (
          <WindowContainer key={win.id} window={win}>
            <div className="flex-1 w-full bg-white flex flex-col h-full">
              {(win.type === 'browser' || win.type === 'ai') && <BrowserApp window={win} />}
              {win.type === 'pdf' && <PDFApp window={win} />}
              {win.type === 'video' && <VideoApp window={win} />}
            </div>
          </WindowContainer>
        ))}
      </div>
    </div>
  );
}

export default App;
