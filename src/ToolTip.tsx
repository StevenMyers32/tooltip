import { MutableRefObject, FC, useState, useCallback, CSSProperties, useContext, useRef, useEffect } from "react";
import ScrollContext from "./ScrollContext";

interface ToolTipProps {
  targetRef: MutableRefObject<HTMLDivElement | null>;
}

/**
 * Tooltip component that can be positioned based on the target ref
 */
const ToolTip: FC<ToolTipProps> = ({ targetRef, children }) => {
  const [toolTipRect, setToolTipRect] = useState<DOMRect>();
  const toolTipRef = useCallback((toolTipNode) => {
    if (toolTipNode) {
      setToolTipRect(toolTipNode.getBoundingClientRect());
    }
  }, []);

  let toolTipStyle: CSSProperties = {};
  if (targetRef.current && toolTipRect) {
    let targetBoundingRect = targetRef.current.getBoundingClientRect();

    // Position to right of target element
    // Use window scroll in case the webpage is scrollable
    toolTipStyle = {
      top: window.scrollY + targetBoundingRect.top + targetBoundingRect.height / 2 - toolTipRect.height / 2,
      left: window.scrollX + targetBoundingRect.left + targetBoundingRect.width,
    };
  }

  return (
    <div ref={toolTipRef} className="tooltip" style={toolTipStyle}>
      <div className="tooltip-text">{children}</div>
    </div>
  );
};

/**
 * Provides a hook to link a tooltip to a target.
 * Returns a ref to add to target, and a tooltip component that should be included in the render
 */
const useToolTipForTarget = (toolTipText: string) => {
  const { scrollY } = useContext(ScrollContext);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [showToolTip, setShowToolTip] = useState(false);
  const onMouseOver = useCallback(() => setShowToolTip(true), []);
  const onMouseOut = useCallback(() => setShowToolTip(false), []);

  const setTargetRefForToolTip = useCallback(
    (targetNode: HTMLDivElement | null) => {
      if (targetRef.current) {
        targetRef.current.removeEventListener("mouseover", onMouseOver);
        targetRef.current.removeEventListener("mouseout", onMouseOut);
      }

      if (targetNode) {
        targetRef.current = targetNode;
        targetRef.current.addEventListener("mouseover", onMouseOver);
        targetRef.current.addEventListener("mouseout", onMouseOut);
      }
    },
    [onMouseOut, onMouseOver]
  );

  useEffect(() => {
    setShowToolTip(false);
  }, [scrollY]);

  return {
    setTargetRefForToolTip,
    toolTipComponent: showToolTip ? <ToolTip targetRef={targetRef}>{toolTipText}</ToolTip> : null,
  };
};

export default ToolTip;
export { useToolTipForTarget };
