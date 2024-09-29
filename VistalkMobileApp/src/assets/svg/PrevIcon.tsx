import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const PrevIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 1024 1024"
    {...props}
  >
    <Path
      fill="currentColor"
      d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0"
    />
  </Svg>
);
export default PrevIcon;
