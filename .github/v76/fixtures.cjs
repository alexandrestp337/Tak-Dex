const keys=['hp','attack','defense','speed','special-attack','special-defense'];
const variants=[[0x24000,0x8c,0x68],[0x26000,0x94,0xb0]];
function crc(buffer) {
 let high=255,low=255;
 for(const byte of buffer){
  let x=byte^high;
  x^=x>>>4;
  high=(low^(x>>>3)^(x<<4))&255;
  low=(x^(x<<5))&255;
 }
 return high*256+low;
}
function bank(bytes,version,offset,sequence,level,progress,roster) {
 const [size,footLength,trainerLength]=variants[version>=22?1:0];
 const party=offset+0x18e00, trainer=offset+0x19400, footer=offset+size-256;
 roster??=[{}];
 bytes[party+4]=roster.length;
 bytes[trainer+31]=version;
 for(const [index,record] of roster.entries()){
  const mon=Buffer.alloc(220);
  const personality=record.pid??0x00034003;
  mon.writeUInt32LE(personality);
  mon.writeUInt16LE(record.species??550,8);
  mon.writeUInt16LE(record.item??287,10);
  mon.writeUInt16LE(0x4000,12);
  mon[0x14]=200;
  mon[0x15]=record.ability??91;
  mon[0x18]=252;
  mon.writeUInt16LE(record.move??401,0x28);
  mon[0x30]=9;
  mon[0x34]=1;
  mon.writeUInt32LE(0x3fffffff,0x38);
  mon[0x40]=8;
  mon[0x41]=3;
  mon[0x8c]=record.level??level;
  mon.writeUInt16LE(29,0x8e);
  [120,100,73,88,65,71].forEach((n,i)=>mon.writeUInt16LE(n,0x90+2*i));
  let checksum=0;
  for(let o=8;o<136;o+=2)checksum=(checksum+mon.readUInt16LE(o))%65536;
  mon.writeUInt16LE(checksum,6);
  const clear=Buffer.from(mon);
  const order=record.pid==null?[0,2,1,3]:[0,1,2,3];
  if(record.pid!=null&&(record.pid>>>13&31)!==0)throw Error("Custom fixture PID must use identity shuffle");
  order.forEach((position,index)=>clear.copy(mon,8+position*32,8+index*32,40+index*32));
  function encrypt(start,end,seed){
   for(let o=start;o<end;o+=2){
    seed=(BigInt(seed)*0x41c64e6dn+0x6073n)%0x100000000n;
    mon.writeUInt16LE(mon.readUInt16LE(o)^Number(seed>>16n),o);
   }
  }
  encrypt(8,136,checksum);
  encrypt(136,220,personality);
  mon.copy(bytes,party+8+index*220);
 }
 const blocks=[[party,0x534,26],[trainer,trainerLength,27]];
 if(progress){
  const sequel=version>=22,misc=offset+(sequel?0x21100:0x21200),event=offset+(sequel?0x1ff00:0x20100),bag=offset+0x18400;
  bytes[misc+4]=progress.mask||0;
  if(progress.clear)bytes[event+(sequel?0x35e:0x27c)+(2400>>3)]|=1<<(2400&7);
  if(progress.surf){bytes.writeUInt16LE(422,bag+0x624);bytes.writeUInt16LE(1,bag+0x626);}
  blocks.push([misc,sequel?0xf0:0xec,52],[event,sequel?0x4e0:0x3ec,45],[bag,sequel?0x9ec:0x9c0,25]);
 }
 for(const [start,length,index] of blocks){
  const value=crc(bytes.subarray(start,start+length));
  bytes.writeUInt16LE(value,start+length+2);
  bytes.writeUInt16LE(value,footer+index*2);
 }
 bytes.writeUInt16LE(sequence,footer+footLength);
 bytes.writeUInt16LE(crc(bytes.subarray(footer,footer+footLength)),footer+footLength+14);
}
function makeSave(version=21,sequence=11,level=38,progress,roster){
 const bytes=Buffer.alloc(524288);
 bank(bytes,version,0,sequence-1&0xffff,level-1,progress,roster);
 bank(bytes,version,variants[version>=22?1:0][0],sequence,level,progress,roster);
 return bytes;
}
module.exports={makeSave,keys};
