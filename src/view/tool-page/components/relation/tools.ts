const getOffset = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset,
    width: rect.width || el.offsetWidth,
    height: rect.height || el.offsetHeight
  };
};

// connect(d1, d2, "green", 1);
export const connect = (div1, div2, color, thickness) => {
  const off1 = getOffset(div1);
  const off2 = getOffset(div2);

  const x1 = off1.left + off1.width;
  const y1 = off1.top + off1.height / 2;

  const x2 = off2.left;
  const y2 = off2.top + off2.height / 2;

  const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

  const cx = (x1 + x2) / 2 - length / 2;
  const cy = (y1 + y2) / 2 - thickness / 2;

  const angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);

  return {
    length,
    thickness,
    cx,
    cy,
    angle
  };

  // const htmlLine =
  //     "<div style='padding:0px; margin:0px; height:" +
  //     thickness +
  //     'px; background-color:' +
  //     color +
  //     '; line-height:1px; position:absolute; left:' +
  //     cx +
  //     'px; top:' +
  //     cy +
  //     'px; width:' +
  //     length +
  //     'px; -moz-transform:rotate(' +
  //     angle +
  //     'deg); -webkit-transform:rotate(' +
  //     angle +
  //     'deg); -o-transform:rotate(' +
  //     angle +
  //     'deg); -ms-transform:rotate(' +
  //     angle +
  //     'deg); transform:rotate(' +
  //     angle +
  //     "deg);' />";

  // console.log(htmlLine);

  //  document.body.innerHTML += htmlLine;
};
