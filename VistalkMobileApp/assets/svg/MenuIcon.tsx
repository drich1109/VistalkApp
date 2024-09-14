import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";
const MenuIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
  >
    <G fill="currentColor">
      <Path d="M8 6.983a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2zM7 12a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1m1 3.017a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z" />
      <Path
        fillRule="evenodd"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10m-2 0a8 8 0 1 1-16 0a8 8 0 0 1 16 0"
        clipRule="evenodd"
      />
    </G>
  </Svg>
);
export default MenuIcon;
