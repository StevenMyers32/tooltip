import "./App.css";
import { useToolTipForTarget } from "./ToolTip";
import ScrollContext, { ScrollContextProvider } from "./ScrollContext";

function App() {
  return (
    <div className="App-content">
      {/* Toggle comments to test different anchor types */}
      {/* <Anchor contentText={"test"} /> */}
      <ScrollingAnchors />
    </div>
  );
}

interface AnchorProps {
  contentText: string;
}

const Anchor = ({ contentText }: AnchorProps) => {
  const { setTargetRefForToolTip, toolTipComponent } = useToolTipForTarget(`Tooltip for ${contentText}`);
  return (
    <>
      <div ref={setTargetRefForToolTip} className="div-anchor">
        {contentText}
      </div>
      {toolTipComponent}
    </>
  );
};

// TOOD: Fix: When there is longer content that can be hoverable, but the mid-point is below the scroll container. The tooltip is still visible
const scrollingAnchorsContent = ["A", "B", "C", "content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit"];

const ScrollingAnchors = () => (
  <ScrollContextProvider>
    <ScrollContext.Consumer>
      {({ onScroll }) => (
        <div className="scroll-container" onScroll={onScroll}>
          {scrollingAnchorsContent.map((val, idx) => (
            <Anchor key={idx} contentText={val} />
          ))}
        </div>
      )}
    </ScrollContext.Consumer>
  </ScrollContextProvider>
);

export default App;
