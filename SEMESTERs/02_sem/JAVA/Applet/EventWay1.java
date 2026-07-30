import java.awt.*;
import java.awt.event.*;

public class EventWay1 extends implements  ActionListener{

    Button btn;
    Label lb;
    EventWay1(){
        btn=new Button();
        lb = new Label();
        btn.addActionListener(this);
    }
}
