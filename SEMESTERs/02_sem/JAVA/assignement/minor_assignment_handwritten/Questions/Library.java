import java.util.Scanner;

class Book {
    int bookID;
    String title;
    boolean isAvailable;

    Book(int id, String t) {
        bookID = id;
        title = t;
        isAvailable = true;
    }

    void issueBook() {
        if (isAvailable) {
            isAvailable = false;
            System.out.println(title + " has been issued.");
        } else {
            System.out.println("Sorry, " + title + " is already issued.");
        }
    }

    void returnBook() {
        isAvailable = true;
        System.out.println(title + " returned successfully.");
    }
}

public class Library {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        Book[] library = new Book[3];

        for (int i = 0; i < library.length; i++) {
            System.out.print("Enter Book ID: ");
            int id = sc.nextInt();
            sc.nextLine();

            System.out.print("Enter Book Name: ");
            String name = sc.nextLine();

            library[i] = new Book(id, name);
        }

        System.out.println("Enter book index to issue:");
        int index = sc.nextInt();

        library[index].issueBook();
        
    }
}