/*!
 * assembler.js
 * (c) 2022 Ayumi TAKEHIRO / Computer Science Lab., Dev. of ISE, NITUC
 */
/*
命令部分
*/
/// コマンドビット数
const COMMAND_BITS = 4;
/// オペランドビット数
const OPERAND_BITS = 4;
/// コマンド= (コードID >> OPERAND_BITS) & COMMAND_MASK
const COMMAND_MASK = 0xf; 
/// オペランド= コードID & OPERAND_MASK で取り出す。
const OPERAND_MASK = 0xf;

//let CodeId;

/// コマンド
const Command={//オペランドNに対する動作
    NOTHING : 0, // 何もしない
    SaveA : 1, // N : レジスタAから値を取って「自アドレス＋N」番地に保存する。
    SaveB : 2, // N : レジスタBから値を取って「自アドレス＋N」番地に保存する。
    LoadA : 3, // N : 「自アドレス+N」番地のデータをレジスタAにロードする。
    LoadB : 4, // N : 「自アドレス+N」番地のデータをレジスタBにロードする。
    AddA : 5, // N : 「自アドレス+N」番地のデータとレジスタAのデータを足し算し、結果をレジスタAにロードする。
    AddB : 6, // N : 「自アドレス+N」番地のデータとレジスタBのデータを足し算し、結果をレジスタAにロードする。
    Jump : 7, // N : PC値をN番地増やす
    IfA : 8, // N :  レジスタAの値が0以外であればPC値をN番地増やす。そうでなければ何もしない。
    IfB : 9, // N :  レジスタBの値が0以外であればPC値をN番地増やす。そうでなければ何もしない。
    ScanA : 10, // N : レジスタAにNを読み込む
    ScanB : 11, // N : レジスタBにNを読み込む
    End : 12, // N :  プログラムを終了する（Nは任意）。
};

let Operand;

/// コードクラス
class code{
    constructor(){
        this.com;
        this.op;
    }
    /*
    SetCom(cid){
        //コマンド
        this.com = (cid >> OPERAND_BITS) & COMMAnD_MASK;
    }
    SetOp(cid){
        //オペランド
        this.op = cid & OPERAND_MASK;
    }
    GetCom(){
        return this.com;
    }
    GetOp(){
        return this.op;
    }
    */
}

const MEMORY_SIZE=16;

class state{
    constructor(){
        this.mem = new Array(MEMORY_SIZE); //メモリ上のコード
        this.pc; //プログラムカウンターの値
        this.ra; //レジスタA
        this.rb; //レジスタB
    }
    /*
    SetMem(i, num){
        this.mem[i] = num;
    }
    SetPc(Pc){
        this.pc = Pc;
    }
    SetRa(Ra){
        this.ra = Ra;
    }
    SetRb(Rb){
        this.rb = Rb;
    }
    GetMem(i){
        return this.mem[i];
    }
    GetPc(){
        return this.pc;
    }
    GetRa(){
        return this.ra;
    }
    GetRb(){
        return this.rb;
    }
    */
}

/* process.js */

/*
export {COMMAND_BITS, COMMAND_MASK, OPERAND_BITS
        , OPERAND_MASK, Command, Operand
        , code, state};
*/

function fetch(sp){
    p = sp.pc;
    cid = sp.mem[p];
    return cid;
}

function decode(cid,code){
    code.com = (cid >> OPERAND_BITS) & COMMAND_MASK;
    code.op = cid & OPERAND_MASK ;
}

function encode(com, op){
    const cid = ((com & COMMAND_MASK) << COMMAND_BITS) | (op & OPERAND_MASK);
    return cid;
}

function exec(sp, cp){
    //console.log(cp.com)
    switch(cp.com){
        case Command.NOTHING:
            sp.pc++;
            break;
        case Command.SaveA:
            sp.mem[(sp.pc + cp.op) % MEMORY_SIZE] = sp.ra;
            sp.pc++;
        break;
        case Command.SaveB: // N : レジスタAから値を取って「自アドレス＋N」番地に保存する。
            sp.mem[(sp.pc + cp.op) % MEMORY_SIZE] = sp.rb;
            sp.pc++;
            break;
        case Command.LoadA: // N : 「自アドレス+N」番地のデータをレジスタAにロードする。
            sp.ra = sp.mem[(sp.pc + cp.op) % MEMORY_SIZE];
            sp.pc++;
            break;
        case Command.LoadB: // N : 「自アドレス+N」番地のデータをレジスタBにロードする。
            sp.rb = sp.mem[(sp.pc + cp.op) % MEMORY_SIZE];
            sp.pc++;
            break;
        case Command.AddA: // N : 「自アドレス+N」番地のデータとレジスタAのデータを足し算し、結果をレジスタAにロードする。
            sp.ra += sp.mem[(sp.pc + cp.op) % MEMORY_SIZE] ;
            sp.pc++;
            break;
        case Command.AddB: // N : 「自アドレス+N」番地のデータとレジスタBのデータを足し算し、結果をレジスタAにロードする。
            sp.rb += sp.mem[(sp.pc + cp.op) % MEMORY_SIZE] ;
            sp.pc++;
            break;
        case Command.Jump: // N : PC値をN番地増やす
            sp.pc += cp.op;
            break;
        case Command.IfA: // N :  レジスタAの値が0以外であればPC値をN番地増やす。そうでなければ何もしない。
            if(sp.ra){
                sp.pc += cp.op;
            }
            else{
                sp.pc++;
            }
            break;
        case Command.IfB: // N :  レジスタBの値が0以外であればPC値をN番地増やす。そうでなければ何もしない。
            if(sp.rb){
                sp.pc += cp.op;
            }
            else{
                sp.pc++;
            }
            break;
        case Command.ScanA: //N : レジスタAにNを読み込む。
            sp.ra = cp.op;
            sp.pc++;
            break;
        case Command.ScanB:
            sp.rb = cp.op;
            sp.pc++;
            break;
        case Command.End: // N :  プログラムを終了する（Nは任意）。
            printf("ENDは実装されていないよ\n");
        default: //対応するコマンドが無いため何もしない
            sp.pc++;
            break;
        }
    sp.pc = sp.pc % MEMORY_SIZE;
    if(sp.ra > 255){
        sp.ra = 0;
    }
    if(sp.rb > 255){
        sp.rb = 0;
    }
}

const commandName = new Array(
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
    "ScanA",
    "ScanB",
    "End",
)

function command2string(com, str){
    str = commandName[com];
    return str;
}

function printMemory(cid){
    const C = new code;
    decode(cid, C);
    let command_name = new Array("");
    command_name=command2string(C.com, command_name);
    console.log("Bin:",cid.toString(16),",   Code:",command_name,",   Op:",C.op.toString(16));
}

function printState(sp){
    console.log("Program Counter:", sp.pc.toString(16));
    console.log("Register A: ", sp.ra.toString(16));
    console.log("Register B: ", sp.rb.toString(16));
    console.log("----------------------------------");
    for(let i = 0; i < MEMORY_SIZE; i++){
        console.log(i.toString(16)," : ");
        printMemory(sp.mem[i]);
    }
    console.log("----------------------------------");
}

/* assembler_test.js */

