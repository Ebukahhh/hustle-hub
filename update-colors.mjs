import { readFileSync, writeFileSync } from 'fs';

const cssPath = 'c:/Users/Sober/Desktop/hustle-hub/src/index.css';
let css = readFileSync(cssPath, 'utf8');
css = css.replace(/#F6F4F7/g, '#FAFAFA');
css = css.replace(/#1A1A1A/g, '#4A2411');
css = css.replace(/#FF0066/g, '#F59E0B');
writeFileSync(cssPath, css);

const appPath = 'c:/Users/Sober/Desktop/hustle-hub/src/App.tsx';
let app = readFileSync(appPath, 'utf8');
app = app.replace(/#F6F4F7/g, '#FAFAFA');
app = app.replace(/#1A1A1A/g, '#4A2411');
app = app.replace(/#FF0066/g, '#F59E0B');
app = app.replace(/255,0,102/g, '245,158,11'); // for the shadow rgba values
app = app.replace(/bg-black\/70/g, 'bg-[#4A2411]/80'); // Credibility section overlay to rich brown
writeFileSync(appPath, app);

console.log('Colors replaced successfully!');
