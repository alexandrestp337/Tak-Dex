/* Read-only Nintendo DS Generation V raw saves. Layout cross-checked with PKHeX. */
(function (root) {
 'use strict';
 const layouts = [
  {size:0x24000, footer:0x8c, trainer:0x68,misc:[0x21200,0xec],events:[0x20100,0x3ec,0x27c],inventory:0x9c0,hof:0x64, versions:[20,21]},
  {size:0x26000, footer:0x94, trainer:0xb0,misc:[0x21100,0xf0],events:[0x1ff00,0x4e0,0x35e],inventory:0x9ec,hof:0x7c, versions:[22,23]}
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
 function progression(bytes,offset,layout,validBlock){
  const data=view(bytes), sequel=layout.versions.includes(23);
  const [misc,miscLength]=layout.misc,[events,eventLength,flagOffset]=layout.events;
  const result={};
  if(validBlock(offset+misc,miscLength,52)){
   const names=sequel?['Basic','Toxic','Insect','Bolt','Quake','Jet','Legend','Wave']:
    ['Trio','Basic','Insect','Bolt','Quake','Jet','Freeze','Legend'];
   result.badges=names.filter((_,i)=>bytes[offset+misc+4]&(1<<i));
   result.badgeCount=result.badges.length;
  }
  if(validBlock(offset+events,eventLength,45)){
   const flag=i=>Boolean(bytes[offset+events+flagOffset+(i>>3)]&(1<<(i&7)));
   result.events=sequel?{hallOfFame:flag(2400),trading:flag(106),seasideCaveCrustleGone:flag(868),receivedZorua:flag(289)&&flag(714)}:
    {firstGameClear:flag(2400),trading:flag(115),victoryRoadObstacleCleared:flag(652),pinwheelObstacleCleared:flag(653)};
   result.leagueCompleted=flag(2400);
   result.postgame=flag(2400);
  }
  const trainer=offset+0x19400;
  const hallOfFame=data.getUint16(trainer+0x40,true)===0xc21e&&data.getUint32(trainer+layout.hof,true)>0;
  if(hallOfFame){
   result.leagueCompleted=true;
   result.championCompleted=true;
   result.postgame=true;
  }else if(sequel&&result.events)result.championCompleted=result.events.hallOfFame;
  if(validBlock(offset+0x18400,layout.inventory,25)){
   const owned=new Set();
   for(let pos=offset+0x18a24;pos<offset+0x18bd8;pos+=4){
    const id=data.getUint16(pos,true),count=data.getUint16(pos+2,true);
    if(count&&id>=420&&id<=425)owned.add(id);
   }
   const hms=['cut','fly','surf','strength','waterfall','dive'];
   result.hms=hms.filter((_,i)=>owned.has(i+420));
  }
  return result;
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
    candidates.push({game:games[version],trainerKey:data.getUint32(trainer+0x14,true),sequence:u16(footer+layout.footer),pokemon,progression:progression(bytes,offset,layout,validBlock)});
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
