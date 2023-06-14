#include"assembler.h"

int main(void){
    State s;
    CodeId cid;
    Code c;
    /* 初期状態の設定 */
    s.pc = 0;
    s.ra = 10;
    s.rb = 2;
    for(int i = 0; i < MEMORY_SIZE; i++){
        s.mem[i] = 0;
    }
    s.mem[0] = encode(LoadA, 0); //0番地の値をレジスタAにロード
    s.mem[1] = encode(SaveB, 1); //レジスタBの値を2番地（1+1番地）にセーブ

    /* 状態の表示 */
    printState(&s);

    /* 一回実行し、表示 */
    cid = fetch(&s);
    c = decode(cid);
    exec(&s, &c);
    printState(&s);

    /* 一回実行し、表示 */
    cid = fetch(&s);
    c = decode(cid);
    exec(&s, &c);
    printState(&s);

    /* 一回実行し、表示 */
    cid = fetch(&s);
    c = decode(cid);
    exec(&s, &c);
    printState(&s);

    return 0;
}