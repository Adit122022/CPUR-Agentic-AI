// File name: StudentApp.java


import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

public class StudentApp extends JFrame implements ActionListener {
    
    // Data store karne ke liye (DB nahi hai to ArrayList)
    ArrayList<String[]> students = new ArrayList<>();
    
    JTextField tfName, tfMarks;
    JTextArea taList;
    JButton btnAdd, btnShow, btnClear;
    
    StudentApp() {
        setTitle("Student Management System");
        setLayout(new BorderLayout());
        
        // TOP - Input Panel
        JPanel inputPanel = new JPanel(new GridLayout(3, 2, 10, 10));
        inputPanel.setBorder(BorderFactory.createTitledBorder("Add Student"));
        
        inputPanel.add(new JLabel("Name:"));
        tfName = new JTextField();
        inputPanel.add(tfName);
        
        inputPanel.add(new JLabel("Marks:"));
        tfMarks = new JTextField();
        inputPanel.add(tfMarks);
        
        btnAdd = new JButton("ADD");
        btnShow = new JButton("SHOW ALL");
        btnClear = new JButton("CLEAR");
        
        btnAdd.setBackground(Color.GREEN);
        btnShow.setBackground(Color.BLUE);
        btnShow.setForeground(Color.WHITE);
        btnClear.setBackground(Color.RED);
        btnClear.setForeground(Color.WHITE);
        
        inputPanel.add(btnAdd);
        inputPanel.add(btnShow);
        
        add(inputPanel, BorderLayout.NORTH);
        
        // CENTER - Output
        taList = new JTextArea();
        taList.setEditable(false);
        taList.setFont(new Font("Monospaced", Font.PLAIN, 14));
        add(new JScrollPane(taList), BorderLayout.CENTER);
        
        // SOUTH
        add(btnClear, BorderLayout.SOUTH);
        
        // Events
        btnAdd.addActionListener(this);
        btnShow.addActionListener(this);
        btnClear.addActionListener(this);
        
        setSize(500, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setVisible(true);
    }
    
    public void actionPerformed(ActionEvent e) {
        if(e.getSource() == btnAdd) {
            String name = tfName.getText().trim();
            String marks = tfMarks.getText().trim();
            
            if(name.isEmpty() || marks.isEmpty()) {
                JOptionPane.showMessageDialog(this,
                    "Please fill all fields!",
                    "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            
            students.add(new String[]{name, marks});
            JOptionPane.showMessageDialog(this,
                "Student Added: " + name,
                "Success", JOptionPane.INFORMATION_MESSAGE);
            tfName.setText("");
            tfMarks.setText("");
        }
        
        if(e.getSource() == btnShow) {
            StringBuilder sb = new StringBuilder();
            sb.append("ID  Name           Marks  Grade\n");
            sb.append("─".repeat(40)).append("\n");
            
            int id = 1;
            for(String[] s : students) {
                double m = Double.parseDouble(s[1]);
                String grade = m>=90?"A":m>=80?"B":m>=70?"C":m>=60?"D":"F";
                sb.append(String.format("%-4d%-15s%-7s%s\n", 
                    id++, s[0], s[1], grade));
            }
            taList.setText(sb.toString());
        }
        
        if(e.getSource() == btnClear) {
            taList.setText("");
        }
    }
    
    public static void main(String[] args) {
        new StudentApp();
    }
}