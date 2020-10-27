//driver for HRS3300

var HRS = {
    avgtotal:0,
    NSAMPLE:24, // Exponential Moving average DC removal alpha = 1/NSAMPLE
    NSLOT:4,
    next:0,
    buf:Int16Array(4),
    writeByte:(a,d) => { 
        I2C1.writeTo(0x44,a,d);
    }, 
    readByte:(a) => {
        I2C1.writeTo(0x44, a);
        return I2C1.readFrom(0x18,1)[0]; 
    },
    init:() => {
        HRS.writeByte(0x01,0x50); //reg ENABLE 50ms wait, (partly) 20ma drive
        HRS.writeByte(0x0C,0x6E); // reg PDRIVER 20ma driver power on
        HRS.writeByte(0x16,0x88); //reg REG , HRS and ALS in 16-bit mode
        HRS.writeByte(0x17,0x10); //reg HGAIN , 64x gain
    },
    enable:(b) => {
        var en = HRS.readByte(0x01);
        en = b?en|0x80:en&~0x80;
        HRS.writeByte(0x01,en);
    },
    read:()=>{
        var m = HRS.readByte(0x09);
        var h = HRS.readByte(0x0A);
        var l = HRS.readByte(0x0F);
        return(m<<8)|((h&0x0F)<<4)|(l&0x0F); //16 bit
    },
    dcFilter:(v)=>{
        HRS.avgtotal+=(v-HRS.avgtotal/HRS.NSAMPLE);
        return Math.floor(v-HRS.avgtotal/HRS.NSAMPLE);
    },
    maFilter:(v)=>{
        HRS.buf[HRS.next]=v;
        ++HRS.next; HRS.next = HRS.next>=HRS.NSLOT?0:HRS.next;
        var t=0;
        for(var i=0;i<NSLOT;++i) t+=HRS.buf[i];
        return Math.floor(t/HRS.NSLOT);
    }
}
