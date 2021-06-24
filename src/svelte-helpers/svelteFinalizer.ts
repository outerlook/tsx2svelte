import prettier from "prettier";

export const finalizeSvelteCode = (code: string) => {
  let out = code;
  out = out.replace(/<HTMLxBlock>\{\"/g, "");
  out = out.replace(/\"}<\/HTMLxBlock>/g, "");
  out = out.replace(/\\n/g, "\n");
  out = out.replace(/\\r/g, "\r");
  out = out.replace(/<\/?Fragment>/g, "");
  out = out.replace(/\\"/g, '"');
  out = out.replace(/<\/?>/g, "");


  out = prettier.format(out, {
    plugins: ["prettier-plugin-svelte"],
    parser: "svelte",
  });
  return out;
};