import java.util.Scanner;

public class StudentGrades {
   
    static int calculateSum (int[] marks){
         int sum = 0;
         for(int i=0; i<marks.length;i++)sum+=marks[i];
         return sum;
    }
    static double calculateAverage(int sum , int length){
         return (double)sum /length;
    }
    public static void main(String args[]){
        Scanner sc= new Scanner(System.in);  
        System.out.println("Enter the length of subject :");
        int subjectsLength = sc.nextInt();
        int[] marks =new int[subjectsLength];
        System.out.println("Enter marks accordingly : \n 1._Mathematics , \n 2._Science \n ,3._Social Science ,\n 4._English ,\n 5.Hindi , \nother  Subjects ,\n(Enter marks one by one with space separted ) :");
        for(int i= 0;i<marks.length;i++) marks[i]=sc.nextInt();
        int sum =calculateSum(marks);
        double avg = calculateAverage(sum, marks.length);
        System.out.printf("Sum of marks : %d\n",sum);
        System.out.printf("Average of marks is %.2f :", avg);
    }
}
