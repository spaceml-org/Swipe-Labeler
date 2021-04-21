import React from "react";

export const Loading = (props) => {
  const imgLink = props.img;

  let imgStyle = props.styles || {};

  imgStyle.background = `url(${imgLink}) no-repeat center center/contain`;
  if (!imgStyle.height) imgStyle.height = "2rem";
  if (!imgStyle.width) imgStyle.width = "2rem";
  if (!imgStyle.margin) imgStyle.margin = "auto";
  return (
    <div>
      <div style={imgStyle}></div>
    </div>
  );
};

export default Loading;
