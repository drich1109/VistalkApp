import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface DashboardIconProps extends SvgProps {
  isActive?: boolean; // Add the isActive prop
}

const DashboardIcon: React.FC<DashboardIconProps> = ({ isActive = false, ...props }) => {
  const strokeColor = isActive ? "#99BC85" : "#000000"; // Set color based on isActive

  return (
    <Svg
      viewBox="0 0 25 25"
      fill="none"
      {...props}
    >
      <Path
        d="M8.57133 2.3999V21.5999M17.4856 10.6285H12.6856M17.4856 6.51419H12.6856M5.14276 6.51419H2.3999M5.14276 10.6285H2.3999M5.14276 14.7428H2.3999M6.51419 21.5999H18.857C20.3719 21.5999 21.5999 20.3719 21.5999 18.857V5.14276C21.5999 3.62792 20.3719 2.3999 18.857 2.3999H6.51419C4.99935 2.3999 3.77133 3.62792 3.77133 5.14276V18.857C3.77133 20.3719 4.99935 21.5999 6.51419 21.5999Z"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default DashboardIcon;