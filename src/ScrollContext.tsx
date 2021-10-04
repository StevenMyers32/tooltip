import { UIEventHandler, FC, useState, UIEvent, createContext } from "react";

/**
 * Scroll context enables watching an element's scroll position
 */
interface ScrollContextValue {
  onScroll: UIEventHandler<HTMLDivElement> | undefined;
  scrollY: number;
}
const ScrollContext = createContext<ScrollContextValue>({ onScroll: undefined, scrollY: 0 });

const ScrollContextProvider: FC = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollY((e.target as HTMLDivElement).scrollTop);
  };
  return <ScrollContext.Provider value={{ onScroll, scrollY }}>{children}</ScrollContext.Provider>;
};

export default ScrollContext;
export { ScrollContextProvider };
