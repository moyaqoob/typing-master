import { Info, Keyboard, Settings } from "lucide-react";
import { TypingTest } from "./Components/page";
function App() {
  
  return (
    <div className="min-h-screen min-w-screen bg-[#d8d2c3]">
      <div className="flex items-center gap-1">
        <div className="flex p-10 ml-5 items-center font-mono ">
          <p className="text-2xl font-semibold">typing master</p>
        </div>
        <nav className="flex gap-4 item">
          <div>
            <Keyboard />
          </div>
          <div>
            <Info />
          </div>
          <div>
            <Settings />
          </div>
        </nav>

      
      </div>
      <div>hi ther</div>
      <TypingTest/>
    </div>
  );
}

export default App;
