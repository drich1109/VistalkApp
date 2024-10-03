import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const PlayIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 16 16"
    {...props}
  >
    <Path
      fill="currentColor"
      d="m11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"
    />
  </Svg>
);
export default PlayIcon;
