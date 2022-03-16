import React from "react";
import { styled } from "@mui/material/styles";
interface NumberDisplayProps {
  value: number;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ value }) => {
  return (
    <StyledDiv className="NumberDisplay">
      {value < 0
        ? `-${Math.abs(value).toString().padStart(2, "0")}`
        : value.toString().padStart(3, "0")}
    </StyledDiv>
  );
};

const StyledDiv = styled("div")`
  width: 80px;
  height: 48px;
  color: #ff0701;
  background: black;
  text-align: center;
  font-size: 40px;
`;

export default NumberDisplay;
