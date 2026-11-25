/* Read-only Nintendo DS Generation V raw saves. Layout cross-checked with PKHeX. */
(function (root) {
 'use strict';
 const layouts = [
  {size:0x24000, footer:0x8c, trainer:0x68, versions:[20,21]},
  {size:0x26000, footer:0x94, trainer:0xb0, versions:[22,23]}
 ];
 const games = {20:'White',21:'Black',22:'White 2',23:'Black 2'};
 const keys = ['hp','attack','defense','speed','special-attack','special-defense'];
 const orders = ['0123','0132','0213','0312','0231','0321','1023','1032',
  '2013','3012','2031','3021','1203','1302','2103','3102','2301','3201',
  '1230','1320','2130','3120','2310','3210'];
 const partyOffset = 0x18e00;
 const view = bytes => new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 function crc(bytes) {
  let value = 0xffff;
  for (const byte of bytes) {
   value ^= byte << 8;
   for (let bit=0;bit<8;bit++) value = ((value << 1) ^ (value & 0x8000 ? 0x1021 : 0)) & 0xffff;
  }
  return value;
 }
 function decryptWords(data,start,end,seed) {
  for (let offset=start;offset<end;offset+=2) {
   seed = (Math.imul(seed,0x41c64e6d)+0x6073) >>> 0;
   data.setUint16(offset,data.getUint16(offset,true) ^ (seed >>> 16),true);
  }
 }
 function record(encrypted) {
  const bytes = Uint8Array.from(encrypted), data = view(bytes);
  const pid = data.getUint32(0,true), checksum = data.getUint16(6,true);
  decryptWords(data,8,136,checksum);
  decryptWords(data,136,220,pid);
  const blocks = bytes.slice(8,136), order = orders[((pid >>> 13) & 31) % 24];
  for (let i=0;i<4;i++) bytes.set(blocks.subarray(+order[i]*32,(+order[i]+1)*32),8+i*32);
  let sum=0;
  for (let i=8;i<136;i+=2) sum += data.getUint16(i,true);
  if ((sum & 0xffff)!==checksum || data.getUint16(4,true)!==0) throw Error('Invalid party Pokémon checksum.');
  const species = data.getUint16(8,true), level = bytes[0x8c], nature = bytes[0x41];
  const ivWord = data.getUint32(0x38,true), egg = Boolean(ivWord & 0x40000000);
  const currentHP = data.getUint16(0x8e,true);
  const stats = Object.fromEntries(keys.map((key,i)=>[key,data.getUint16(0x90+2*i,true)]));
  if (species<1 || species>649 || nature>24 || (!egg && (level<1 || level>100 ||
      currentHP>stats.hp || Object.values(stats).some(n=>n<1)))) throw Error('Invalid party Pokémon fields.');
  const moves = Array.from({length:4},(_,i)=>{
   const id = data.getUint16(0x28+2*i,true);
   if (id>559) throw Error('Invalid Generation V move ID.');
   return id ? {id,remainingPP:bytes[0x30+i],ppUps:bytes[0x34+i]} : null;
  });
  return {species,form:bytes[0x40]>>>3,pid,egg,level,stats,currentHP,nature,moves,
   statusWord:data.getUint32(0x88,true),itemId:data.getUint16(0x0a,true),abilityId:bytes[0x15],friendship:bytes[0x14],
   shiny:((pid>>>16)^(pid&0xffff)^data.getUint16(0x0c,true)^data.getUint16(0x0e,true))<8,
   ivs:Object.fromEntries(keys.map((key,i)=>[key,(ivWord>>>(5*i))&31])),
   evs:Object.fromEntries(keys.map((key,i)=>[key,bytes[0x18+i]]))};
 }
 function parse(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (bytes.length!==0x80000) throw Error('Choose a 512 KiB raw Black, White, Black 2 or White 2 save.');
  const data = view(bytes), u16 = offset => data.getUint16(offset,true), candidates = [];
  for (const layout of layouts) for (const offset of [0,layout.size]) {
   const footer = offset+layout.size-0x100, party=offset+partyOffset, trainer=offset+0x19400;
   const version=bytes[trainer+0x1f], count=bytes[party+4];
   if (!layout.versions.includes(version) || count>6 ||
       crc(bytes.subarray(footer,footer+layout.footer))!==u16(footer+layout.footer+14)) continue;
   const validBlock=(start,length,index)=> {
    const checksum=crc(bytes.subarray(start,start+length));
    return checksum===u16(start+length+2) && checksum===u16(footer+2*index);
   };
   if (!validBlock(party,0x534,26) || !validBlock(trainer,layout.trainer,27)) continue;
   try {
    const pokemon=Array.from({length:count},(_,i)=>record(bytes.subarray(party+8+i*220,party+8+(i+1)*220)));
    candidates.push({game:games[version],trainerKey:data.getUint32(trainer+0x14,true),sequence:u16(footer+layout.footer),pokemon});
   } catch { /* An intact backup can survive corruption in the newest bank. */ }
  }
  if (!candidates.length) throw Error('No valid Generation V party and trainer blocks found.');
  return candidates.reduce((active,next)=>{
   if (active.game!==next.game) throw Error('Save contains conflicting game versions.');
   const distance=(next.sequence-active.sequence)&0xffff;
   return distance && distance<0x8000 ? next : active;
  });
 }
 const parser={parse};
 if (typeof module==='object') module.exports=parser;
 else root.takDexGen5Save=parser;
})(globalThis);
