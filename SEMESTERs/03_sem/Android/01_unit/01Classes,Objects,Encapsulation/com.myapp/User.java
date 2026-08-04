package 01Classes,Object,Encapsulation/com.myapp;

public class User {
  
    // 1. Private fields (Encapsulation)
    private int id;
    private String name;
    private String email;

    // 2. Constructor
    public User(int id, String name, String email) {
        this.id = id;
        this.name = name;
        setEmail(email); 
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email != null && email.contains("@")) {
            this.email = email;
        } else {
            this.email = "invalid_email@domain.com";
            System.out.println("Warning: Invalid email format provided for " + name);
        }
    }

    public void displayUser() {
        System.out.println("User [ID: " + id + " | Name: " + name + " | Email: " + email + "]");
    }


}
