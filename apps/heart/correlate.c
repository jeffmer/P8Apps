
/*
var correlator = E.compiledC(`
// void put(int)
// int conf(void)
// int bpm(void)

__attribute__((section(".text"))) const int NSLOT = 128;
__attribute__((section(".text"))) char buffer[NSLOT];
__attribute__((section(".text"))) int next = 0;
__attribute__((section(".text"))) int confidence = 0;

void put(int v){
    buffer[next]=v;
    next = (next+1)%NSLOT;
}

int conf() {return confidence;}

int bpm() {
    const int CMIN = 7; // 60000/(200bpm * 40ms)
    const int CMAX = 37; //60000/(40bpm * 40ms)
    int minCorr = 0x7FFFFFFF;
    int maxCorr = 0;
    int minIdx = 0;
    for (int c=CMIN; c<CMAX;c++){
        int s = 0;
        int a = next;
        int b = (next + c) % NSLOT;
        //correlate
        for (int i = 0;i<NSLOT-CMAX;i++){
            int d = buffer[b]-buffer[a];
            b = (b+1)%NSLOT;
            a = (a+1)%NSLOT;
            s+=d*d;
        }
        if (s<minCorr) {minCorr=s; minIdx=c;}
        if (s>maxCorr) maxCorr = s;
    }
    confidence = 120 - (minCorr/600);
    if (maxCorr<10000) confidence -= (10000-maxCorr)/50;
    confidence = confidence<0?0:confidence>100?100:confidence;
    return  minIdx==0?0:(60000/(minIdx*40));
}
`);
*/
var correlator = (function(){
  var bin=atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3p8EM8T39EACDX+ACAByMCRm/wAEU3TAPrCAEMQAAsvr8E8f80ZPB/BAE0QUZP8FsMACYH6wQOnvgEkAfrAQ6e+ATgzusJDgTxAQkpTAnqBAQALAHxAQkmSbi/BPH/NAnqAQG8v2TwfwQBNAApvr8B8f8xYfB/AQExvPEBDA77DmbX0a5CvL8YRjVGATOyQri/MkYlK77Rb/QfcQtEQvIPcYpClfvz8wPxeAMC3RNKekQJ4ML1HFIQMm/wMQGS+/HyE0QOSnpEwviEMA1KekTS+IQwZCuov2QjI+rjc8L4hDAosSgjWENO9mAjk/vw8L3o8IN/AACAbv///8T+//+u/v//pv7//wJLe0TT+IQAcEcAv2r+//8JSXlEC2jKGBBxWhwFSxNAACu+vwPx/zNj8H8DATMLYHBHAL9/AACAWv7//w==");
  return {
    put:E.nativeCall(417, "void(int)", bin),
    conf:E.nativeCall(401, "int(void)", bin),
    bpm:E.nativeCall(137, "int(void)", bin),
  };
})();
