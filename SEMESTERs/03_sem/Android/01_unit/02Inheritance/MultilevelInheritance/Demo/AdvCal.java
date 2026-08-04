public class AdvCal extends Calc {
    public int mul(int a , int b){ return a *b ;}
    public int div(int a , int b){ 
       if(b==0) { return a; }
       return b / a;
    }
}
