import esbuild from "esbuild";
import htmlMinifier from "html-minifier-terser";
import fsSync from "fs";

const fs = fsSync.promises;

const esbuildProm = esbuild.build({
    entryPoints: [`${import.meta.dirname}/js/index.js`, `${import.meta.dirname}/css/index.css`],
    bundle: true,
    minify: true,
    sourcemap: process.env.NODE_ENV === "production",
    write: false,
    outdir: `${import.meta.dirname}/build/`
});
const htmlProm = fs.readFile(`${import.meta.dirname}/index.html`, "utf-8");
const [build, html] = await Promise.all([esbuildProm, htmlProm]);

let js, css;
for(let i = 0; i < build.outputFiles.length; i++){
    if(build.outputFiles[i].path.endsWith(".js")){
        js = build.outputFiles[i].text;
    }else if(build.outputFiles[i].path.endsWith(".css")){
        css = build.outputFiles[i].text;
    }
}

let data = await htmlMinifier.minify(html, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    decodeEntities: true,
    noNewlinesBeforeTagClose: true,
    removeComments: true
});

data = data.replace("<script></script>", `<script>${js}</script>`)
data = data.replace("<style></style>", `<style>${css}</style>`)

fs.writeFile(`${import.meta.dirname}/build.html`, data);
