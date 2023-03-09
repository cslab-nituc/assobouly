/*!
 * question.js
 * (c) 2022 Ayumi TAKEHIRO / Computer Science Lab., Dev. of ISE, NITUC
 */
//問題のクラス
//初期状態はすべて入力、ゴールは特定の条件のみ
class Question{
    constructor(){
        this.text;  //問題文
        this.ini_ra;  //レジスタAの初期値
        this.ini_rb;  //レジスタBの初期値
        this.ini_mem = new Array(16);  //メモリの初期値
        this.goal_ra;  //レジスタAの目標値(指定があるときのみ)
        this.goal_rb;  //レジスタBの目標値(指定があるときのみ)
        this.goal_mem = new Array(MEMORY_SIZE);  //メモリの目標値(指定があるときのみ)
    }
    //問題文を設定する関数
    setText(str){
        this.text = str;
    }
    //レジスタAとBの初期値を設定する関数
    setRegister(ra, rb){
        this.ini_ra = ra;
        this.ini_rb = rb;
    }
    //メモリのi番目の要素を設定する関数
    setMem(num,i){
        this.ini_mem[i]=num;
    }
    //レジスタAの目標値を設定する関数
    setGra(ra){
        this.goal_ra=ra;
    }
    //レジスタBの目標値を設定する関数
    setGrb(rb){
        this.goal_rb=rb;
    }
    //メモリのi番目の目標値を設定する
    setGmem(num,i){
        this.goal_mem[i]=num;
    }
    //クリア判定を行う関数(返値が0:未クリア　返値が1：クリア)
    judge(s){
        /*
       for(let i=0;i<18;i++){
        if(i==0){
            if(this.goal_ra != null){
                if(this.goal_ra == s.ra){
                    complete |=1;
                }
                else{
                    complete &= ~1;
                }
            }
            else{
                complete |=1;
            }
        }
        if(i==1){
            if(this.goal_rb != null){
                if(this.goal_rb == s.rb){
                    complete |=1<<i;
                }
                else{
                    complete &= ~(1<<i);
                }
            }
            else{
                complete |= 1<<i;
            }
        }
        if(i>1){
            if(this.goal_mem[i-2] != null){
                if(this.goal_mem[i-2] == s.mem[i-2]){
                    complete |=1<<i;
                }
                else{
                    complete &= ~(1<<i);
                }
            }
            else{
                complete |=1<<i;
            }
        }
       }
       if((complete & (2^18-1)) == (2^18-1)){
        return 1;
       }
       else{
        return 0;
       }
       */
      if(this.text == null){
        return 0;
      }
      if((this.goal_ra != null) && (this.goal_ra != s.ra)){
        return 0;
      }
      if((this.goal_rb != null) && (this.goal_rb != s.rb)){
        return 0;
      }
      for(let i=0;i<MEMORY_SIZE;i++){
        if((this.goal_mem[i] != null) && (this.goal_mem[i] != s.mem[i])){
            return 0;
        }
      }


      
      return 1;
    }
}

const question = [
    new Question //空の問題(自由にやるモード)
    , new Question //1問目
    , new Question
    , new Question
];
//1問目
question[1].setText("レジスタAとレジスタBの値を入れ替えよう");
question[1].setRegister(0x34, 0xa2);
for(let i=0;i<MEMORY_SIZE;i++){
    question[1].setMem(0,i);
}
question[1].setGra(question[1].ini_rb);
question[1].setGrb(question[1].ini_ra);

//2問目
question[2].setText("メモリの(絶対番地で)13～15番地の数値を\n足し合わせた値をレジスタAに入れよう");
question[2].setRegister(0,0);
for(let i=0; i<MEMORY_SIZE-3; i++){
    question[2].setMem(0,i);
}
question[2].setMem(0x13,13);
question[2].setMem(0x04,14);
question[2].setMem(0x36,15);
question[2].setGra(question[2].ini_mem[13] + question[2].ini_mem[14] + question[2].ini_mem[15]);

//3問目
question[3].setText("メモリの(絶対番地)1～3番地にある値を\n(絶対番地)13～15番地に順序はそのままでコピーしよう");
question[3].setRegister(0,0);
question[3].setMem(0x24,1);
question[3].setMem(0x3e,2);
question[3].setMem(0xa5,3);
question[3].setGmem(question[3].ini_mem[1],13);
question[3].setGmem(question[3].ini_mem[2],14);
question[3].setGmem(question[3].ini_mem[3],15);
