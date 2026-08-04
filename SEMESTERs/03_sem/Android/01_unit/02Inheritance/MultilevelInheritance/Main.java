class GrandParents {
    public void getInfo() {
        System.out.println("GrandParents===");
    }

    public void propertyForGrandChild() {
        System.out.println("Property for grandChild===");
    }

    public void propertyForParent() {
        System.out.println("Property for Prents===");
    }

}

class Parents extends GrandParents {
    public void getInfo() {
        System.out.println("Parents ====== ");
    }
}

class Child extends Parents {
    public void getInfo() {
        System.out.println("Child  ====== ");
    }
}

class Main {
    public static void main(String[] args) {
        Child ch = new Child();
        ch.getInfo();
        ch.propertyForParent();

    }
}