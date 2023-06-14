/**
 * @file assembler.h
 * @author Makoto TANABE (tanabe@ube-k.ac.jp)
 * @brief アセンブリ言語（簡易）のシミュレータ
 * @version 0.1
 * @date 2022-07-04
 * 
 * @copyright Copyright (c) 2022
 * 
 */

/*
 命令部分
 メモリ上の1ワード(コードとよぶ）が「コマンド＋オペランド」で構成されていると仮定する。
 コマンドとオペランドのビット数や、これらを取り出すためのマスクを定義する。
 */
/// コマンドのビット数
#define COMMAND_BITS 4
/// オペランドのビット数
#define OPERAND_BITS 4 //オペランドのビット数
/// コマンドのマスク コマンド= (コードID >> OPERAND_BITS) & COMMAND_MASK で取り出す。
#define COMMAND_MASK 0xf
/// オペランドのマスク オペランド= コードID & OPERAND_MASK で取り出す。
#define OPERAND_MASK 0xf 

/// コードID型。 上位ビットがコマンド、下位ビットがオペランド。
typedef unsigned char CodeId;

/// コマンド型。
enum Command_tag { //オペランドNに対する動作
NOTHING, // 何もしない
SaveA, // N : レジスタAから値を取って「自アドレス＋N」番地に保存する。
SaveB, // N : レジスタAから値を取って「自アドレス＋N」番地に保存する。
LoadA, // N : 「自アドレス+N」番地のデータをレジスタAにロードする。
LoadB, // N : 「自アドレス+N」番地のデータをレジスタBにロードする。
AddA, // N : 「自アドレス+N」番地のデータとレジスタAのデータを足し算し、結果をレジスタAにロードする。
AddB, // N : 「自アドレス+N」番地のデータとレジスタBのデータを足し算し、結果をレジスタAにロードする。
Jump, // N : PC値をN番地増やす
IfA, // N :  レジスタAの値が0以外であればPC値をN番地増やす。そうでなければ何もしない。
IfB, // N :  レジスタBの値が0以外であればPC値をN番地増やす。そうでなければ何もしない。
End, // N :  プログラムを終了する（Nは任意）。
};
typedef enum Command_tag Command;

/// オペランド型
typedef unsigned char Operand; //オペランド

/// コード型。コマンドとオペランドを持つ。コードID型とほぼ同等だが、実装方法が異なるかもしれないので区別する。
typedef struct {
    Command com;
    Operand op;
} Code;


/**
 * @brief 状態部分。メモリーの状態、プログラムカウンターの値、レジスターの値から構成される。
 */
/// メモリサイズ
#define MEMORY_SIZE 16
/// レジスターの値を表す型。0～255。
typedef unsigned char Register; 
/// プログラムカウンターの値を表す型。実際には0～15。
typedef unsigned char Pc; 
/// 状態を表す型（構造体）。
typedef struct {
    CodeId mem[MEMORY_SIZE]; //各メモリ上のコード
    Pc pc;
    Register ra;
    Register rb;
} State;
typedef State * Statep;

/// 関数
/**
 * @brief: その状態（のPCカウンタが挿す）におけるコードのIDを取得する。
 */
CodeId fetch(Statep sp); //コードIDをfetch

/**
 * @brief: コードIDをコード型の構造体に変換する。
 */
Code decode(CodeId cid);  
/**
 * @brief コマンド番号とオペランドをコードIDに変換する。
 * 
 * @param com コマンド番号
 * @param op オペランド
 * @return CodeId コードID
 */
CodeId encode(Command com, Operand op); 

/**
 * @brief コードを実行し、状態を変化させる。
 * 
 * @param sp 状態へのポインタ。実行後はcode実行後の状態に変化する。
 * @param code 実行するコード
 */
void exec(Statep sp, const Code *code); //ステートを変化させる。

/**
 * @brief 状態を標準出力に表示する。
 * 
 * @param sp 
 */
void printState(Statep sp); //状態を表示する