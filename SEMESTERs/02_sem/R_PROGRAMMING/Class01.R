#date -16 march 2026  
#Topics - 
#Factor -> Data Structure in R 
  # - use to represent categorical  data (yes/no) , (M, F) into numerical values
  # - each factor has 
          #-> level(numerical notation)
          #-> label(human readable labels for these values)
#dplyr package
#ggplot package
#inbuilt factor


#factor
# 1. Define your initial vector
threat_types <- c("Phishing", "DDoS", "Malware", "SQL Injection", "XSS")

security_logs <- c("High", "Medium", "High", "Critical", "Low")

# 3. Map the levels to your threat vector
security_data <- data.frame(Threat =threat_types , Severty = security_logs)

# 4. Create a clean Data Frame for your logs
security_diversity <- factor(security_data$Severty,level = c("low","medium","high","critical"), ordered = TRUE)

print(security_logs)
