// Lesson 1: Classes, Objects, & Encapsulation

import com.myapp.User;

public class Lesson01 {
    public static void main(String[] args) {
        // Creating an object (instantiation)
        User user1 = new User(101, "Aditya", "aditya@example.com");
        
        // Display initial details
        user1.displayUser();

        // Updating a property via setter
        user1.setName("Aditya Sharma");
        
        // Attempting to set an invalid email
        user1.setEmail("invalidemail.com"); 

        // Output final details using getter
        System.out.println("Updated Name: " + user1.getName());
        user1.displayUser();
    }
}
