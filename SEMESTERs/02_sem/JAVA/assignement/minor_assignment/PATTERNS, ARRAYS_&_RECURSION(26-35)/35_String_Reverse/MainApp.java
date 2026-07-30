import java.util.*;

class StringReverse {
    String str;

    StringReverse(String str) {
        this.str = str;
    }

    void reverse() {
        String reversed = "";

        for (int i = str.length() - 1; i >= 0; i--) {
            reversed += str.charAt(i);
        }

        System.out.println("Reversed: " + reversed);
    }
}

public class MainApp {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a string: ");
        String input = sc.nextLine();   

        sc.close();

        StringReverse obj = new StringReverse(input);
        obj.reverse();
    }
}