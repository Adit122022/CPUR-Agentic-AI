public class Main {
    public static void main(String[] args) {
        Vehicle v = new Car(); // Polymorphism
        v.start();
        v.getInfo();
        System.out.println(v.getClass());

    }

}

class Vehicle {
    public void start() {
        System.out.println("Vehicle is starting.");
    }

    public void getInfo() {
        System.out.println("Vehicle Class");
    }
}

class Car extends Vehicle {
    @Override
    public void start() {
        System.out.println("Car starts with a key or push button.");
    }

}