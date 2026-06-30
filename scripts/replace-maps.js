const fs = require('fs');
const path = require('path');

const OLD = 'https://maps.app.goo.gl/fqT4UEaVkkmBihck9';
const NEW = 'https://maps.app.goo.gl/nVDpi9ybAbu87Piz8';
const OLD_ESC = OLD.replace(/&/g, '&amp;');

const skip = ['node_modules', '.git', 'dist', 'build', '.next', 'public/assets', 'vendor', 'scripts'];
const exts = ['.html','.htm','.md','.txt','.js','.ts','.tsx','.jsx','.json','.css','.scss','.sass','.xml','.yml','.yaml','.env','.ejs'];

function isBinary(buf){
  for(let i=0;i<buf.length && i<8000;i++){
    if(buf[i]===0) return true;
  }
  return false;
}

function walk(dir){
  let entries = fs.readdirSync(dir,{withFileTypes:true});
  for(const e of entries){
    const full = path.join(dir,e.name);
    if(skip.some(s=>full.includes(path.join(path.sep,s)))) continue;
    // avoid modifying this script file
    if(path.resolve(full) === path.resolve(__filename)) continue;
    if(e.isDirectory()){
      walk(full);
    } else if(e.isFile()){
      const ext = path.extname(e.name).toLowerCase();
      if(!exts.includes(ext) && ext!=='' && ext.length>0) continue;
      try{
        const buf = fs.readFileSync(full);
        if(isBinary(buf)) continue;
        let s = buf.toString('utf8');
        let changed = false;
        if(s.includes(OLD)){
          s = s.split(OLD).join(NEW);
          changed = true;
        }
        if(s.includes(OLD_ESC)){
          s = s.split(OLD_ESC).join(NEW);
          changed = true;
        }
        // also replace URL-encoded &amp; in different forms
        const oldAmp = OLD.replace(/&/g,'&amp;');
        if(s.includes(oldAmp) && !s.includes(NEW)){
          s = s.split(oldAmp).join(NEW);
          changed = true;
        }
        if(changed){
          fs.writeFileSync(full,s,'utf8');
          console.log('Replaced in', full);
        }
      }catch(err){
        // skip files we can't read
      }
    }
  }
}

const target = process.argv[2] || path.join(__dirname,'..');
console.log('Scanning', target);
walk(target);
console.log('Done.');
