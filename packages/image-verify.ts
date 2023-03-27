/**
 * 图片验证hook
 * @param width 图片宽度
 * @param height 图片高度
 * @param container 容器元素
 * @returns
 */
const useImageVerify = (width: number, height: number, container?: HTMLElement | null) => {
  const canvas = document.createElement("canvas");

  const { imgCode } = drawImage(width, height, canvas);
  if (container) {
    container.appendChild(canvas);
  }

  const getImage = (type: "base64" | "url") => {
    if (type === "base64") {
      return canvas.toDataURL("image/png");
    }
    if (type === "url") {
      let url = "";
      const blob = base64ToBlob(canvas.toDataURL());
      url = URL.createObjectURL(blob);
      return url;
    }
  };

  return {
    code: imgCode,
    getImage,
  };
};

/**
 * base64转blob对象
 * @param base64 base64字符串
 * @returns
 */
function base64ToBlob(base64: string) {
  const mime = base64.match(/(?<=data:).*(?=;base64)/)?.[0] ?? "image/png";
  const byte = atob(base64.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byte.length);
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byte.length; i++) {
    uintArray[i] = byte.charCodeAt(i);
  }
  const blob = new Blob([uintArray], { type: mime });
  return blob;
}

/**
 * 获取 [min, max] 区间内的随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 获取 rgb 三色处于 [min, max] 区间内的随机颜色
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
function getRandomColor(min: number, max: number) {
  const r = getRandomInt(min, max);
  const g = getRandomInt(min, max);
  const b = getRandomInt(min, max);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 通过canvas在容器内画出相应尺寸的验证图片
 * @param width 图片宽度
 * @param height 图片高度
 * @param container 容器元素
 */
function drawImage(width: number, height: number, cvs: HTMLCanvasElement) {
  const WORDS_MAP = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let imgCode = "";

  cvs.width = width;
  cvs.height = height;
  const ctx = cvs.getContext("2d")!;
  ctx.fillStyle = getRandomColor(180, 240);
  ctx.fillRect(0, 0, width, height);

  // 画字符
  for (let i = 0; i < 4; i++) {
    const text = WORDS_MAP[getRandomInt(0, WORDS_MAP.length - 1)];
    imgCode += text;
    const fontSize = getRandomInt(height / 2, height);
    const rDeg = getRandomInt(-20, 20);
    ctx.font = `${fontSize}px Simhei`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = getRandomColor(80, 150);
    ctx.save();
    ctx.rotate(rDeg / 180);
    ctx.translate((width / 4) * i + fontSize / 10, 0);
    ctx.fillText(text, 0, height / 2);
    ctx.restore();
  }

  // 画干扰线
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(getRandomInt(0, width), getRandomInt(0, height));
    ctx.strokeStyle = getRandomColor(80, 150);
    ctx.lineTo(getRandomInt(0, width), getRandomInt(0, height));
    ctx.closePath();
    ctx.stroke();
  }

  // 画干扰点
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.fillStyle = getRandomColor(80, 150);
    ctx.arc(getRandomInt(0, width), getRandomInt(0, height), getRandomInt(2, 4), 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  return {
    imgCode,
  };
}

export { useImageVerify };
