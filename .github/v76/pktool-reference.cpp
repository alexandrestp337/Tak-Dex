#include <algorithm>
#include <array>
#include <cstdio>
#include <fstream>
#include <iterator>
#include <vector>
#include "core/saves/gen5_save.h"
#include "core/pokemon/pk5.h"
#include "core/util/bytes.h"
using namespace pktool;
int main(int argc, char** argv) {
    if(argc != 2) return 1;
    std::ifstream in(argv[1],std::ios::binary);
    std::vector<uint8_t> data(std::istreambuf_iterator<char>(in),{});
    const auto game=saves::Gen5Save::detect(data);
    const std::size_t span=game==saves::Game::Black2White2?0x26000:0x24000;
    if (data.size()!=0x80000) return 2;
    auto block=[&](size_t b) {return util::readU16(data.data()+b+span-0x100+(span==0x26000?0x94:0x8c));};
    const auto delta=static_cast<uint16_t>(block(span)-block(0));
    if(delta && delta<0x8000) std::swap_ranges(data.begin(),data.begin()+span,data.begin()+span);
    saves::Gen5Save save;
    if(save.load(data)!=saves::LoadResult::Ok||!save.checksumsValid()) return 3;
    std::printf("%u\n",save.gameVersion());
    for(int i=0;i<save.partyCount();++i) {
        std::array<uint8_t,220> pk;
        if(save.readPartySlot(i,pk.data())!=saves::SlotState::Valid) return 4;
        const auto p=pokemon::pk5::toPokemon(pk.data(),pk.size());
        std::printf("%u,%u,%u,%u,%u,%u,%u,%u",p.species,p.form,pk[0x8c],util::readU16(pk.data()+0x8e),p.nature,p.heldItem,p.ability,p.shiny);
        for(auto value:p.ivs) std::printf(",%u",value);
        for(auto value:p.evs) std::printf(",%u",value);
        for(int pos=0x90;pos<=0x9a;pos+=2) std::printf(",%u",util::readU16(pk.data()+pos));
        for(int slot=0;slot<4;++slot) std::printf(",%u,%u,%u",util::readU16(pk.data()+0x28+2*slot),pk[0x30+slot],pk[0x34+slot]);
        std::puts("");
    }
}
