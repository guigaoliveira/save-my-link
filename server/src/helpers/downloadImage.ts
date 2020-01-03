import fs from "fs";
import path from "path";
import axios from "axios";

const fsPromises = fs.promises;

interface DownloadImageParams {
  readonly targetUrl: string;
  readonly imageDestination: string;
  readonly imageFileName: string;
}

const createFile = async (filepath: string) => {
  try {
    await fsPromises.access(filepath, fs.constants.F_OK);
  } catch (err) {
    await fsPromises.writeFile(filepath, { flag: "wx" });
  }
};

const deleteFile = async (filepath: string) => {
  try {
    await fsPromises.unlink(filepath);
  } catch {}
};

async function downloadImage({
  targetUrl,
  imageDestination,
  imageFileName
}: DownloadImageParams) {
  if (!imageDestination || !imageFileName || !targetUrl) return;

  const filepath = path.resolve("src", imageDestination, imageFileName);

  try {
    await createFile(filepath);

    const writer = fs.createWriteStream(filepath);

    const response = await axios({
      url: targetUrl,
      method: "GET",
      responseType: "stream"
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", () => {
        deleteFile(filepath).then(reject);
      });
    });
  } catch (e) {
    await deleteFile(filepath);
    return new Promise((_, reject) => reject());
  }
}

export default downloadImage;
