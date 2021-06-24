import arg from "arg";
import {processTSXFile} from "../codeProcessors";

const args = arg({
  "--dir": String,
  "--file": String,
});

const main = async () => {
  processArgs()
}
export const processArgs = () => {
  const { _, "--file": file, "--dir": dir } = args;
  if (file) processTSXFile(file)
};

main()