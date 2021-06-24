import { getTestPath } from "./testUtils";
import { processTSXFile } from "../src/codeProcessors";

test("processFullFile", () => {
  const path = getTestPath("e2e/ModalManipulacao.tsx");
  processTSXFile(path);
});
