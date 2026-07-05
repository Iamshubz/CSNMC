// Class containing the method to find string length
class Solution {
    // Function to return length of a string
    public int findLength(String s) {
        // Return length using built-in function
        return s.length();
    }
}

// Driver class
public class main {
    public static void main(String[] args) {
        // Create object of Solution class
        Solution obj = new Solution();
        // Input string
        String s = "Shubham";
        // Call function and print result
        System.out.println(obj.findLength(s));
    }
}
