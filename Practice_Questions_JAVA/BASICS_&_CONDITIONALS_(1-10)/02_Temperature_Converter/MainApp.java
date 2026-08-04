import java.util.*;
class ConvertToFahrenheit{
     double f;
     ConvertToFahrenheit(double Celsius){
        this.f = ( Celsius * 9.0 /5.0) + 32;
     }
      void DISPLAY_RESULT(){
        System.out.printf("--- Results ---\nFahrenheit: %.2f\n" ,f);
    }
}

class MainApp{
    public static void main (String[] args){
         Scanner sc = new Scanner(System.in);
         System.out.print("Enter temperature in Celsius :");
         double cal = sc.nextDouble();
         sc.close();
        ConvertToFahrenheit cTf = new ConvertToFahrenheit(cal);
        cTf.DISPLAY_RESULT();
    }
}