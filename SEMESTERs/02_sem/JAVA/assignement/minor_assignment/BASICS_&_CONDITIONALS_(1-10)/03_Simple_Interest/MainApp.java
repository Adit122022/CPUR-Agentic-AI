//3. **Simple Interest:** Input P, R, T; calculate Interest and Total Amount.

import java.util.*;

class Calculate{
double p,r,t;
double SI;
 Calculate(double P, double R , double T){
this.p =P;
this.r = R;
this.t =T;
}
void CalculateInterest(){
 this.SI =( p * r * t)/100;
System.out.printf("Simple interest : %.2f\n", SI);
}
void CalculateAmount(){
System.out.printf("Total Amount :%.2f\n",p+SI);
}

}

class MainApp{
public static void main(String[] args){
Scanner sc = new Scanner(System.in);
System.out.println("Enter Principal Amount :");
double principal = sc.nextDouble();
System.out.println("Enter Rate :");
double rate = sc.nextDouble();
System.out.println("Enter Time :");
double time = sc.nextDouble();

sc.close();
//object of calculator constructor
Calculate cl = new Calculate(principal , rate , time);
cl.CalculateInterest();  // calling method
cl.CalculateAmount();  // calling method
}
}