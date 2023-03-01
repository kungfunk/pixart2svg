import fs from "node:fs";
import { Command, InvalidArgumentError } from "commander";
import { imageSize } from "image-size";
import { name, version } from "../package.json";
import {
  chunkToColor,
  colorToPath,
  getSVGTag,
  getUint8ImageDataFromPath,
  pathToString,
  arrayToChunks,
} from "./utils";

const program = new Command();

program
  .name(name)
  .version(version)
  .description("Converts pixel art images to SVG with perfect quality")
  .argument("<file>", "file to convert")
  .action(async (path: string) => {
    if (!fs.existsSync(path)) {
      throw new InvalidArgumentError("File doesnt exist.");
    }
    const { width, height, type } = imageSize(path);
    if (type !== "png") {
      throw new InvalidArgumentError("The file is not a valid PNG image.");
    }
    if (!width || !height) {
      throw new InvalidArgumentError("File dimensions are not correct.");
    }

    const uint8 = await getUint8ImageDataFromPath(path);

    const content = Array.from(uint8)
      .reduce(arrayToChunks(4), [])
      .reduce(chunkToColor(width), [])
      .map(colorToPath)
      .map(pathToString)
      .join("\n");

    const svg = getSVGTag(width, height, content);
    console.log(svg);
  });

program.parse();
