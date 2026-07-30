// 4. **Even/Odd:** Input a number; check if it is Even or Odd.
import java.util.*;

class EvenOdd{
 long num;
	EvenOdd(long n){
	this.num = n;	
	}
 void IsEven(){
System.out.println((num & 1) == 0 ? "Even" : "Odd");
}
}

class MainApp{
public static void main(String[] args){
Scanner sc = new Scanner(System.in);
System.out.print("Enter Number to check Even or Odd : ");
long num = sc.nextLong();
sc.close();
EvenOdd check = new EvenOdd(num);
check.IsEven();
}
}