import { createCanvas, loadImage } from "canvas";
import { Color, Path, Position } from "./types";

export function getCSSColor(r: number, g: number, b: number, a: number) {
  if (a === 255) {
    return `#${[r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")}`;
  }
  return `rgba(${r},${g},${b},${a / 255})`;
}

export function Uint8ToChunk(chunkSize: number) {
  return (prev: any, current: any, index: number) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!prev[chunkIndex]) {
      prev[chunkIndex] = []; // start a new chunk
    }

    prev[chunkIndex].push(current);

    return prev;
  };
}

export function chunkToColor(width: number) {
  return (prev: any, [r, g, b, a]: any, index: number) => {
    if (a === 0) {
      return prev;
    }
    const color = getCSSColor(r, g, b, a);
    const x = index % width;
    const y = Math.floor(index / width);
    const existingColor = prev.find((value: Color) => value.color === color);
    if (existingColor) {
      existingColor.positions.push({ x, y });
    } else {
      prev.push({
        color,
        positions: [{ x, y }],
      });
    }

    return prev;
  };
}

export function colorToPath(color: Color) {
  const draws: string[] = [];
  let curPath: Position;
  let w = 1;

  // Loops through each color's pixels to optimize paths
  color.positions.forEach((values) => {
    if (curPath && values.y === curPath.y && values.x === curPath.x + w) {
      w++;
    } else {
      if (curPath) {
        draws.push(`M${curPath.x} ${curPath.y}h${w}`);
        w = 1;
      }
      curPath = values;
    }
  });

  if (curPath! && curPath.x && curPath.y) {
    draws.push(`M${curPath.x} ${curPath.y}h${w}`); // Finish last path
  }

  return {
    stroke: color.color,
    draw: draws.join(""),
  };
}

export function pathToString(path: Path) {
  return `<path stroke="${path.stroke}" d="${path.draw}" />`;
}

export function getSVGTag(width: number, height: number, content: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">\n${content}\n</svg>`;
}

export async function getUint8ImageDataFromPath(path: string) {
  const image = await loadImage(path);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  const { data: uint8 } = ctx.getImageData(0, 0, image.width, image.height);

  return uint8;
}
