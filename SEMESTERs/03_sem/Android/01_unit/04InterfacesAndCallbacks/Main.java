public class Main {
    public static void main(String[] args) {
        Button saveButton = new Button();

        saveButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick() {
                System.out.println("Save button clicked.");
            }
        });

        saveButton.click();
    }
}
