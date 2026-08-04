// 5. **Voting Eligibility:** Input age; check if the user can vote (Age $\ge$ 18).
import java.util.*;

class VotingEligibility{
 int age;
	VotingEligibility(int age){
	 if(age <= 0){
            System.out.println("Invalid Age!");
            this.age = 0;
        } else {
            this.age = age;
        }	
	}
 void checkVotingEligibility(){
 if(age == 0){
            return;
        }
        System.out.println(age >= 18 ? "Valid Voter" : "Not a Valid Voter");
}
}

class MainApp{
public static void main(String[] args){
Scanner sc = new Scanner(System.in);
System.out.print("Enter age : ");
int age = sc.nextInt();
sc.close();
VotingEligibility check = new VotingEligibility(age);
check.checkVotingEligibility();
}
}