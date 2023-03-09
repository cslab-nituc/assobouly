/*!
 * assembler_exe.js
 * (c) 2022 Ayumi TAKEHIRO / Computer Science Lab., Dev. of ISE, NITUC
 */
let cid;
const s = new state;
const c = new code;
let qflag = 0;
let qcomplete = 0;
let log =[[0,0]];

const elementButton = document.querySelector("#buttonExecute");

elementButton.addEventListener("click", exe);

function init(){
    log=[[0,0]];
    s.pc = 0;
    if(question[qflag].ini_ra==null){
        s.ra = 0;
    }
    else{
        s.ra = question[qflag].ini_ra;
    }
    if(question[qflag].ini_rb==null){
        s.rb = 0;
    }
    else{
        s.rb = question[qflag].ini_rb;
    }
    for(let i = 0; i < MEMORY_SIZE; i++){
        if(question[qflag].ini_mem[i]==null){
            s.mem[i] = 0;
        }
        else{
            s.mem[i] = question[qflag].ini_mem[i];
        }
    }
    init_graphic(s);
    //printState(s);
    qcomplete=0;
    selectgamen(qcomplete);
 }

 function Screen(s,c){
    //console.log(log[log.length-1][0],log[log.length-1][1]);
    //console.log(command2string(log[log.length][0],commandName),log[log.length][1].toString(16));
    //printState(s);
    graphic(s,c);        
 }

 
function exe(){
    let elementNum1 = document.querySelector("#command");
    let elementNum2 = document.querySelector("#op");

    let com = Number(elementNum1.value);
    let num = Number(elementNum2.value);
    if(qcomplete==0){
        s.mem[s.pc] = encode(com,num);
        cid = fetch(s);
        decode(cid,c);
        exec(s, c);
        //log.push(c.com);
        log[log.length-1][0]=c.com;
        log[log.length-1][1]=c.op;
        Screen(s,c);
        qcomplete=question[qflag].judge(s);
    }
    selectgamen(qcomplete);
}

function qchange(num){
    qflag = num;
    changeText(qflag);
    init();
}
