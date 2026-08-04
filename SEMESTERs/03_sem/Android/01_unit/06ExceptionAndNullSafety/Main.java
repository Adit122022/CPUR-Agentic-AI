public class Main {
    public static void main(String[] args) {
        System.out.println("Parsed number: " + parseNumber("42"));
        System.out.println("Parsed number: " + parseNumber("not-a-number"));
        printUpperCase(null);
    }

    private static int parseNumber(String input) {
        try {
            return Integer.parseInt(input.trim());
        } catch (NumberFormatException exception) {
            System.out.println("Invalid number: " + input);
            return 0;
        } finally {
            System.out.println("Parsing attempt completed.");
        }
    }

    private static void printUpperCase(String value) {
        if (value == null) {
            System.out.println("Value is missing; avoiding NullPointerException.");
            return;
        }
        System.out.println(value.toUpperCase());
    }
}
