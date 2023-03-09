/*!
 * pixijs.js
 * (c) 2022 Ayumi TAKEHIRO / Computer Science Lab., Dev. of ISE, NITUC
 */
//const { arrayRemove } = require("utils");
const a=20;
//キャンバス
let app = new PIXI.Application({ 
    width: 1000, height: 600+a, backgroundColor: 0x1099bb
    , resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const cx = 390;
const cy = 240+a;
const r = 150;
const theta = 2*Math.PI/16
const rx = 260;
const ry = 180;
const px = 420;
const py = 275+a;

//文字の設定
const textStyle = new PIXI.TextStyle({
    fontSize:50
});

//ゲーム画面のコンテナ
const gamen = new PIXI.Container();
app.stage.addChild(gamen);
//クリア画面のコンテナ
const cleargamen = new PIXI.Container();
let clearmessage = new PIXI.Text("クリア\n問題ボタンか初期化ボタンを押してね",textStyle);
//clearmessage.x = cx;
clearmessage.y = cy;
app.stage.addChild(cleargamen);
cleargamen.addChild(clearmessage);

//表示させるコンテナを選択(true：表示　false：非表示)
gamen.visible = true;
cleargamen.visible = false;

let ra_data;
let rb_data;
let flag=0;  //進数フラグ(0：16進数　1：10進数)
const sinsu=[16,10];  //進数

const adress = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let adress_text = new Array(MEMORY_SIZE);


/*
const programcount =[
    [100,100],[150,150],[120,120],[140,140],
    [110,110],[60,60],[90,90],[130,130],
    [100,100],[120,120],[140,140],[90,90],
    [70,70],[50,50],[10,10],[100,100]
]
*/

//メモリ表示用のテクスチャ
const texture=[
    PIXI.Texture.from('figure/number_0.png'),
    PIXI.Texture.from('figure/number_1.png'),
    PIXI.Texture.from('figure/number_2.png'),
    PIXI.Texture.from('figure/number_3.png'),
    PIXI.Texture.from('figure/number_4.png'),
    PIXI.Texture.from('figure/number_5.png'),
    PIXI.Texture.from('figure/number_6.png'),
    PIXI.Texture.from('figure/number_7.png'),
    PIXI.Texture.from('figure/number_8.png'),
    PIXI.Texture.from('figure/number_9.png'),
    PIXI.Texture.from('figure/alphabet_character_a.png'),
    PIXI.Texture.from('figure/alphabet_character_b.png'),
    PIXI.Texture.from('figure/alphabet_character_c.png'),
    PIXI.Texture.from('figure/alphabet_character_d.png'),
    PIXI.Texture.from('figure/alphabet_character_e.png'),
    PIXI.Texture.from('figure/alphabet_character_f.png')
    
];
//メモリの上位4ビット(コマンド)用
let memory_graphic = new Array(16);
//メモリの下位4ビット(オペランド)用
let memop_graphic = new Array(16);

const programCounter = PIXI.Sprite.from('figure/pc.png');
const register_A = PIXI.Sprite.from('figure/ra.png');
const register_B = PIXI.Sprite.from('figure/rb.png');

let coma;  //レジスタAの上位4ビット
let opa;  //レジスタAの下位4ビット
let comb;  //レジスタBの上位4ビット
let opb;  //レジスタBの下位4ビット

//問題文の表示
let question_text = new PIXI.Text(question[qflag].text);
gamen.addChild(question_text);

//表示(初期化)
function init_graphic(s){
    /* プログラムカウンタ */
    programCounter.width = 50;
    programCounter.height = 50;
    programCounter.x = px+1.3*rx*Math.sin(theta*(s.pc));
    programCounter.y = py-1.5*ry*Math.cos(theta*(s.pc));
    gamen.addChild(programCounter);

    /* レジスタ(画像)表示 */
    if(ra_data == null){
        register_A.x = cx-140;
        register_A.y = cy-50;
        register_A.scale.x = 2.0;
        register_A.scale.y = 1.6;
        gamen.addChild(register_A);
    }
    if(rb_data == null){
        register_B.x = cx+45;
        register_B.y = cy-53;
        register_B.scale.x = 2.0;
        register_B.scale.y = 1.55;
        gamen.addChild(register_B);
    }
    
    /* レジスタの値表示 */
    flag = 0;
    coma = s.ra >> COMMAND_BITS;
    opa = s.ra & OPERAND_MASK;
    comb = s.rb >> COMMAND_BITS;
    opb = s.rb & OPERAND_MASK;
    if(ra_data == null){
        //ra_data = new PIXI.Text(s.ra.toString(16),textStyle);
        ra_data = new PIXI.Text(coma.toString(sinsu[flag])
        +"."+opa.toString(sinsu[flag]),textStyle);
        ra_data.x = cx-55;
        ra_data.y = cy+20;
        gamen.addChild(ra_data);
    }
    else{
        ra_data.text = coma.toString(sinsu[flag])
        +"."+opa.toString(sinsu[flag]);
    }
    if(rb_data == null){
        //rb_data = new PIXI.Text(s.rb.toString(16),textStyle);
        rb_data = new PIXI.Text(comb.toString(sinsu[flag])
        +"."+opb.toString(sinsu[flag]),textStyle);
        rb_data.x = cx+120;
        rb_data.y = cy+20;
        gamen.addChild(rb_data);
    }
    else{
        rb_data.text = comb.toString(sinsu[flag])
        +"."+opb.toString(sinsu[flag]);
    }

    /* メモリ(コマンド部分)の表示 */
    for(let i=0;i<16;i++){
        if(memory_graphic[i] != null){
            gamen.removeChild(memory_graphic[i]);
            memory_graphic[i].destroy();
            }
        memory_graphic[i]=new PIXI.Sprite(texture[s.mem[i]>>COMMAND_BITS]);
        memory_graphic[i].x=cx+rx*Math.sin(theta*(i));
        memory_graphic[i].y=cy-ry*Math.cos(theta*(i));
        gamen.addChild(memory_graphic[i]);
    }
    /* メモリ(オペランド部分の表示) */
    for(let i=0;i<16;i++){
        if(memop_graphic[i] != null){
            gamen.removeChild(memop_graphic[i]);
            memop_graphic[i].destroy();
            }
        memop_graphic[i]=new PIXI.Sprite(texture[s.mem[i] & OPERAND_MASK]);
        //memop_graphic[i].weight = 50;
        //memop_graphic[i].height = 50;
        memop_graphic[i].scale.x=0.5;
        memop_graphic[i].scale.y=0.5
        memop_graphic[i].x=cx+rx*Math.sin(theta*(i))+60;
        memop_graphic[i].y=cy-ry*Math.cos(theta*(i))+50;
        gamen.addChild(memop_graphic[i]);
    }
    
    //相対アドレスの表示
    for(let i=0; i<MEMORY_SIZE; i++){
        //console.log(adress[i]);
        if(adress_text[i] == null){
            adress_text[i] = new PIXI.Text(adress[(MEMORY_SIZE-s.pc+i)%MEMORY_SIZE].toString(sinsu[flag]));
            adress_text[i].x = px+10+1.2*(rx+15)*Math.sin(theta*i);
            adress_text[i].y = py+10-1.3*(ry+15)*Math.cos(theta*i);
            gamen.addChild(adress_text[i]);
        }
        else{
            adress_text[i].text = adress[(MEMORY_SIZE-s.pc+i)%MEMORY_SIZE].toString(sinsu[flag]);
        }
    }
}

//表示(初期化以外)
function graphic(s,c){
    //programCounter.x = programcount[s.pc][0];
    //programCounter.y = programcount[s.pc][1];

    /* プログラムカウンタの移動 */
    programCounter.x = px+1.3*rx*Math.sin(theta*(s.pc));
    programCounter.y = py-1.5*ry*Math.cos(theta*(s.pc));

    /* メモリの更新 */
    for(let i=0;i<16;i++){
        if(memory_graphic[i] != null){
        gamen.removeChild(memory_graphic[i]);
        memory_graphic[i].destroy();  //一回なくす
        }
        //新しく作る
        memory_graphic[i]=new PIXI.Sprite(texture[s.mem[i]>>COMMAND_BITS]);
        memory_graphic[i].x=cx+rx*Math.sin(theta*(i));
        memory_graphic[i].y=cy-ry*Math.cos(theta*(i));
        gamen.addChild(memory_graphic[i]);
        
    }   
    for(let i=0;i<16;i++){
        if(memop_graphic[i] != null){
        gamen.removeChild(memop_graphic[i]);
        memop_graphic[i].destroy();
        }
        memop_graphic[i]=new PIXI.Sprite(texture[s.mem[i] & OPERAND_MASK]);
        //memop_graphic[i].weight = 50;
        //memop_graphic[i].height = 50;
        memop_graphic[i].scale.x=0.5;
        memop_graphic[i].scale.y=0.5
        memop_graphic[i].x=cx+rx*Math.sin(theta*(i))+60;
        memop_graphic[i].y=cy-ry*Math.cos(theta*(i))+50;
        gamen.addChild(memop_graphic[i]);
    }

    /* レジスタの値を更新する */
    coma = s.ra >> COMMAND_BITS;
    opa = s.ra & OPERAND_MASK;
    comb = s.rb >> COMMAND_BITS;
    opb = s.rb & OPERAND_MASK;
    ra_data.text = coma.toString(sinsu[flag])+"."+opa.toString(sinsu[flag]);
    rb_data.text = comb.toString(sinsu[flag])+"."+opb.toString(sinsu[flag]);

    //相対アドレスの更新
    for(let i=0; i<MEMORY_SIZE; i++){    
        adress_text[i].text = adress[(MEMORY_SIZE-s.pc+i)%MEMORY_SIZE].toString(sinsu[flag]);
    }
}

//レジスタの値の進数表示を変更する関数
function change(){
    flag = ~flag;
    //ra_data.text = s.ra.toString(sinsu[flag]);
    //rb_data.text = s.rb.toString(sinsu[flag]);
   coma = s.ra >> COMMAND_BITS;
   opa = s.ra & OPERAND_MASK;
   comb = s.rb >> COMMAND_BITS;
   opb = s.rb & OPERAND_MASK;
   ra_data.text = coma.toString(sinsu[flag])+"."+opa.toString(sinsu[flag]);
   rb_data.text = comb.toString(sinsu[flag])+"."+opb.toString(sinsu[flag]);

   for(let i=0; i<MEMORY_SIZE; i++){    
    adress_text[i].text = adress[(MEMORY_SIZE-s.pc+i)%MEMORY_SIZE].toString(sinsu[flag]);
    }
}

//表示させるコンテナを変更する関数
function selectgamen(num){
    if(num==0){
        cleargamen.visible = false;
        gamen.visible = true;
    }
    if(num==1){
        cleargamen.visible = true;
        gamen.visible = false;
    }
}
//表示させる問題文を変更する関数
function changeText(num){
    question_text.text=question[num].text;
}