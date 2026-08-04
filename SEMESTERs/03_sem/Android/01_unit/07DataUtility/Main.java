public class Main {
    public static void main(String[] args) {
        String enteredAge = " 21 ";
        int age = Integer.parseInt(enteredAge.trim());
        System.out.println("Age: " + age);

        String role = "admin";
        if ("admin".equals(role)) {
            System.out.println("Administrator logged in.");
        }

        StringBuilder message = new StringBuilder("Selected items: ");
        for (int i = 1; i <= 3; i++) {
            message.append(i);
            if (i < 3) {
                message.append(", ");
            }
        }
        System.out.println(message);
    }
}
