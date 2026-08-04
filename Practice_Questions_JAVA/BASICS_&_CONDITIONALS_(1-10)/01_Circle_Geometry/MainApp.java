// 1. **Circle Geometry:** Input radius; calculate Area and Circumference.

import java.util.*;

class Circle{
    double r;
    // constructor
    Circle(double value){
        this.r = value;
    }

    //  method
    double calculateArea(){
        return Math.PI *r *r;   //Area = pi*r*r
    }
    double calculateCircumference(){
        return  2 * Math.PI *r;
    }

    void DISPLAY_RESULT(){
        System.out.printf("--- Results ---\nArea of Circle: %.2f\n", calculateArea());
        System.out.printf("Circumference of Circle: %.2f\n", calculateCircumference());
    }
}

public class MainApp{
    public static void main(String[] args){
        Scanner sc= new Scanner(System.in);
        System.out.println("Enter the radius of Circle :");
        double r= sc.nextDouble();
        sc.close(); // hamesha scanner ko close karna  for better performance
        Circle cr = new Circle(r); // Object parameterized constructor se banaya hai 
        cr.DISPLAY_RESULT();  // method from cr object
    }
}