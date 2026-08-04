class Animal {
    private String type;

    // Getter and setter
    public void setType(String t) {
        this.type = t;
    }

    public String getType() {
        return type;
    }
}

class Dog extends Animal {
    public void bark() {
        System.out.println("DOg Barks ");
    }
}

class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.setType("AALu");
        System.out.println("Extended Type into Animal Class :  " + d.getType());
        d.bark();
    }
}