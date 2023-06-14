/**
 * @file assembler.c
 * @author Makoto TANABE (tanabe@ube-k.ac.jp)
 * @brief アセンブリ言語（簡易）のシミュレータ
 * @version 0.1
 * @date 2022-07-04
 * 
 * @copyright Copyright (c) 2022
 * 
 */
#include"assembler.h"
#include<stdio.h>
#include<string.h>

CodeId fetch(Statep sp){
    Pc p = sp->pc; //プログラムカウンターを確認
    CodeId cid = sp->mem[p]; //メモリ上の値を取得
    return cid; //コードIdを返す
};

Code decode(CodeId cid) {  //コードIDからコードオブジェクトに変換
    Code code;
    code.com = (cid >> OPERAND_BITS) & COMMAND_MASK; //コマンド部分を取り出し
    code.op = cid & OPERAND_MASK ; //オペランド部分を取り出し
    return code;
}

CodeId encode(Command com, Operand op){ //コードオブジェクトからコードIDに変換
    CodeId cid = ((com & COMMAND_MASK) << COMMAND_BITS) | (op & OPERAND_MASK); 
    return cid;
}; 

void exec(Statep sp, const Code *cp){
    switch(cp->com) { //コマンド名による場合分け
        case NOTHING: //何もしない
            sp->pc++;
            break;
        case SaveA: // N : レジスタAから値を取って「自アドレス＋N」番地に保存する。
            sp->mem[sp->pc + cp->op] = sp->ra;
            sp->pc++;
            break;
        case SaveB: // N : レジスタAから値を取って「自アドレス＋N」番地に保存する。
            sp->mem[sp->pc + cp->op] = sp->rb;
            sp->pc++;
            break;
        case LoadA: // N : 「自アドレス+N」番地のデータをレジスタAにロードする。
            sp->ra = sp->mem[sp->pc + cp->op];
            sp->pc++;
            break;
        case LoadB: // N : 「自アドレス+N」番地のデータをレジスタBにロードする。
            sp->rb = sp->mem[sp->pc + cp->op];
            sp->pc++;
            break;
        case AddA: // N : 「自アドレス+N」番地のデータとレジスタAのデータを足し算し、結果をレジスタAにロードする。
            sp->ra += sp->mem[sp->pc + cp->op] ;
            sp->pc++;
            break;
        case AddB: // N : 「自アドレス+N」番地のデータとレジスタBのデータを足し算し、結果をレジスタAにロードする。
            sp->rb += sp->mem[sp->pc + cp->op] ;
            sp->pc++;
            break;
        case Jump: // N : PC値をN番地増やす
            sp->pc += cp->op;
            break;
        case IfA: // N :  レジスタAの値が0以外であればPC値をN番地増やす。そうでなければ何もしない。
            if(sp->ra){
                sp->pc += cp->op;
            }
            else{
                sp->pc++;
            }
            break;
        case IfB: // N :  レジスタBの値が0以外であればPC値をN番地増やす。そうでなければ何もしない。
            if(sp->rb){
                sp->pc += cp->op;
            }
            else{
                sp->pc++;
            }
            break;
        case End: // N :  プログラムを終了する（Nは任意）。
            printf("ENDは実装されていないよ\n");
        default: //対応するコマンドが無いため何もしない
            sp->pc++;
            break;
    }
};

static char commandName[][20] = {
"NOTHING",
"SaveA",
"SaveB",
"LoadA", 
"LoadB", 
"AddA", 
"AddB",
"Jump",
"IfA", 
"IfB",
"End",
};

static void command2string(Command com, char * str){
    strcpy(str, commandName[com]);
}

void printMemory(CodeId cid){
    Code c = decode(cid);
    char command_name[20];
    command2string(c.com, command_name);
    printf("Bin:%02X,\tCode:%s,\tOp:%X\n", cid, command_name, c.op);
}

void printState(Statep sp){
    printf("Program Counter:%X\n", sp->pc);
    printf("Register A: %02X\n", sp->ra);
    printf("Register B: %02X\n", sp->rb);
    puts("----------------------------------");
    for(int i = 0; i < MEMORY_SIZE; i++){
        printf("%X: ", i);
        printMemory(sp->mem[i]);
    }
    puts("----------------------------------");
}