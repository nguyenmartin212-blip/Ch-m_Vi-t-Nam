export function parseRange(header,size){
 const m=/^bytes=(\d*)-(\d*)$/.exec(header||'');
 if(!m||(!m[1]&&!m[2])||size<=0)return null;
 const start=m[1]?Number(m[1]):Math.max(0,size-Number(m[2]));
 const end=m[1]?(m[2]?Math.min(Number(m[2]),size-1):size-1):size-1;
 return Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&start<=end&&start<size?{start,end}:null;
}
