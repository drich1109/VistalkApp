import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ClockIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 36 36"
    {...props}
  >
    <Path
      fill="currentColor"
      d="M31.47 3.84a5.78 5.78 0 0 0-7.37-.63a16.08 16.08 0 0 1 8.2 7.65a5.73 5.73 0 0 0-.83-7.02"
    />
    <Path
      fill="currentColor"
      d="M11.42 3.43a5.77 5.77 0 0 0-7.64.41a5.72 5.72 0 0 0-.38 7.64a16.08 16.08 0 0 1 8.02-8.05"
    />
    <Path
      fill="currentColor"
      d="M16.4 4.09a14 14 0 0 0-8.29 23.79l-2.55 2.55A1 1 0 1 0 7 31.84l2.66-2.66a13.9 13.9 0 0 0 16.88-.08l2.74 2.74a1 1 0 0 0 1.41-1.41L28 27.78A14 14 0 0 0 16.4 4.09m3.18 25.81a12 12 0 1 1 10.34-10.34A12 12 0 0 1 19.58 29.9"
    />
    <Path fill="none" d="M0 0h36v36H0z" />
  </Svg>
);
export default ClockIcon;
